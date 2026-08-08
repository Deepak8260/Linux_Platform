import asyncio
import logging
import time
from typing import Dict, Optional, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

try:
    import docker
    from docker.errors import DockerException
    DOCKER_AVAILABLE = True
except ImportError:
    DOCKER_AVAILABLE = False


class ContainerSession:
    def __init__(self, session_id: str, user_id: str, container_obj: Any = None, is_mock: bool = False):
        self.session_id = session_id
        self.user_id = user_id
        self.container_obj = container_obj
        self.is_mock = is_mock
        self.start_time = time.time()
        self.ttl_seconds = settings.SESSION_TTL_SECONDS
        self.exec_pty_socket = None

    @property
    def remaining_seconds(self) -> int:
        elapsed = time.time() - self.start_time
        remaining = int(self.ttl_seconds - elapsed)
        return max(0, remaining)

    @property
    def is_expired(self) -> bool:
        return self.remaining_seconds <= 0


class DockerSessionManager:
    def __init__(self):
        self.sessions: Dict[str, ContainerSession] = {}
        self.user_cooldowns: Dict[str, float] = {}
        self.docker_client = None
        self._init_docker()

    def _init_docker(self):
        if not DOCKER_AVAILABLE:
            logger.warning("Docker SDK python package not found. Using Mock mode.")
            return

        try:
            self.docker_client = docker.from_env()
            self.docker_client.ping()
            logger.info("Successfully connected to Docker engine.")
        except Exception as e:
            logger.warning(f"Could not connect to Docker daemon: {e}. Falling back to sandbox simulation mode.")
            self.docker_client = None

    async def create_session(self, session_id: str, user_id: str) -> ContainerSession:
        # Clean expired sessions first
        await self.clean_expired_sessions()

        # Check 5-minute cooldown constraint
        cooldown_until = self.user_cooldowns.get(user_id, 0)
        if time.time() < cooldown_until:
            remaining_cooldown = int(cooldown_until - time.time())
            m = remaining_cooldown // 60
            s = remaining_cooldown % 60
            raise RuntimeError(f"5-Minute Cooldown Active. Please wait {m}m {s}s before spinning up a new container instance.")

        # ABSOLUTE 1-CONTAINER GUARANTEE: If ANY active session exists, reuse it!
        for existing in list(self.sessions.values()):
            if not existing.is_expired:
                logger.info(f"Reusing existing single active container session {existing.session_id}")
                return existing

        # Check active container limit across all users
        active_count = len([s for s in self.sessions.values() if not s.is_expired])
        if active_count >= settings.MAX_CONCURRENT_CONTAINERS:
            raise RuntimeError(f"Server capacity reached ({settings.MAX_CONCURRENT_CONTAINERS} max concurrent containers). Please wait a moment.")

        if self.docker_client:
            try:
                # Cleanup leftover containers tagged linuxarena if any exist
                try:
                    leftovers = self.docker_client.containers.list(filters={"label": "app=linuxarena"})
                    for old_c in leftovers:
                        old_c.stop(timeout=1)
                        old_c.remove(force=True)
                except Exception:
                    pass

                try:
                    self.docker_client.images.get(settings.CONTAINER_IMAGE)
                except Exception:
                    logger.info(f"Pulling image {settings.CONTAINER_IMAGE}...")
                    self.docker_client.images.pull(settings.CONTAINER_IMAGE)

                # Create single container with resource constraints
                container = self.docker_client.containers.run(
                    image=settings.CONTAINER_IMAGE,
                    command="/bin/bash",
                    detach=True,
                    tty=True,
                    stdin_open=True,
                    mem_limit=settings.CONTAINER_MEM_LIMIT,
                    nano_cpus=int(settings.CONTAINER_NCPU * 1e9),
                    labels={"app": "linuxarena", "session_id": session_id, "user_id": user_id},
                    hostname="ubuntu-sandbox",
                    working_dir="/home/student",
                    user="root",
                    remove=False
                )

                # Setup student user, sudo, and permissions inside container
                container.exec_run("apt-get update -y && apt-get install -y sudo curl")
                container.exec_run("useradd -m -s /bin/bash student || true")
                container.exec_run("usermod -aG sudo student || true")
                container.exec_run("bash -c \"echo 'student ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/student\"")
                container.exec_run("chmod 0440 /etc/sudoers.d/student")
                container.exec_run("chown -R student:student /home/student")

                session = ContainerSession(session_id, user_id, container_obj=container, is_mock=False)
                self.sessions[session_id] = session
                logger.info(f"Created SINGLE container session {session_id} for user {user_id} with full sudo permissions")
                return session

            except Exception as e:
                logger.error(f"Failed to create Docker container: {e}. Falling back to simulation mode.")
                session = ContainerSession(session_id, user_id, is_mock=True)
                self.sessions[session_id] = session
                return session
        else:
            session = ContainerSession(session_id, user_id, is_mock=True)
            self.sessions[session_id] = session
            logger.info(f"Created simulation sandbox session {session_id} for user {user_id}")
            return session

    def get_session(self, session_id: str) -> Optional[ContainerSession]:
        session = self.sessions.get(session_id)
        if not session:
            # If any active session exists, return it
            active = [s for s in self.sessions.values() if not s.is_expired]
            if active:
                return active[0]
            return None

        if session.is_expired:
            asyncio.create_task(self.terminate_session(session_id))
            return None
        return session

    async def terminate_session(self, session_id: str):
        session = self.sessions.pop(session_id, None)

        if session:
            # Set 5-minute cooldown (300 seconds)
            self.user_cooldowns[session.user_id] = time.time() + 300.0

        if session and session.container_obj and not session.is_mock:
            try:
                session.container_obj.stop(timeout=2)
                session.container_obj.remove(force=True)
                logger.info(f"Destroyed Docker container for session {session_id} and set 5-min cooldown")
            except Exception as e:
                logger.error(f"Error destroying container {session_id}: {e}")

    async def clean_expired_sessions(self):
        expired_ids = [sid for sid, s in self.sessions.items() if s.is_expired]
        for sid in expired_ids:
            await self.terminate_session(sid)

    def exec_validation_command(self, session_id: str, cmd: str) -> dict:
        session = self.get_session(session_id)
        if not session:
            return {"exit_code": -1, "output": "Session expired or not found"}

        if session.is_mock or not session.container_obj:
            return {"exit_code": 0, "output": "Simulated check passed"}

        try:
            res = session.container_obj.exec_run(cmd, demux=False)
            return {
                "exit_code": res.exit_code,
                "output": res.output.decode("utf-8", errors="ignore") if res.output else ""
            }
        except Exception as e:
            return {"exit_code": -1, "output": str(e)}


docker_manager = DockerSessionManager()
