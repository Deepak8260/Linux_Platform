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

        # REUSE EXISTING CONTAINER: Ensure only 1 container runs per user!
        for existing in self.sessions.values():
            if existing.user_id == user_id and not existing.is_expired:
                logger.info(f"Reusing active container session {existing.session_id} for user {user_id}")
                return existing

        # Check active container limit across all users
        active_count = len([s for s in self.sessions.values() if not s.is_expired])
        if active_count >= settings.MAX_CONCURRENT_CONTAINERS:
            raise RuntimeError(f"Server capacity reached ({settings.MAX_CONCURRENT_CONTAINERS} max concurrent containers). Please wait a moment.")

        if self.docker_client:
            try:
                try:
                    self.docker_client.images.get(settings.CONTAINER_IMAGE)
                except Exception:
                    logger.info(f"Pulling image {settings.CONTAINER_IMAGE}...")
                    self.docker_client.images.pull(settings.CONTAINER_IMAGE)

                # Create container with resource constraints
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

                # Setup student user directory inside container
                container.exec_run("useradd -m -s /bin/bash student || true")
                container.exec_run("chown -R student:student /home/student || true")

                session = ContainerSession(session_id, user_id, container_obj=container, is_mock=False)
                self.sessions[session_id] = session
                logger.info(f"Created single container session {session_id} for user {user_id}")
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
        if session and session.is_expired:
            asyncio.create_task(self.terminate_session(session_id))
            return None
        return session

    async def terminate_session(self, session_id: str):
        session = self.sessions.pop(session_id, None)
        if not session:
            return

        if session.container_obj and not session.is_mock:
            try:
                session.container_obj.stop(timeout=2)
                session.container_obj.remove(force=True)
                logger.info(f"Destroyed Docker container for session {session_id}")
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
