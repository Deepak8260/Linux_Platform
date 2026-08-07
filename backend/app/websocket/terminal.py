import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.docker.manager import docker_manager

logger = logging.getLogger(__name__)

router = APIRouter()


class SimulatedBashShell:
    """Fallback interactive shell simulator when real Docker PTY is unavailable."""
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.cwd = "/home/student"
        self.hostname = "ubuntu-sandbox"
        self.user = "student"
        self.files = {"welcome.txt": "Welcome to LinuxArena sandbox!\nPractice commands here."}

    def get_prompt(self) -> str:
        return f"\r\n\x1b[1;32m{self.user}@{self.hostname}\x1b[0m:\x1b[1;34m{self.cwd}\x1b[0m$ "

    def execute_command(self, cmd_str: str) -> str:
        cmd_str = cmd_str.strip()
        if not cmd_str:
            return ""

        parts = cmd_str.split()
        base = parts[0]

        if base == "clear":
            return "\x1b[2J\x1b[H"
        elif base == "pwd":
            return f"\r\n{self.cwd}"
        elif base == "whoami":
            return f"\r\n{self.user}"
        elif base == "uname" or (base == "uname" and "-a" in parts):
            return f"\r\nLinux {self.hostname} 6.8.0-ubuntu-generic #2026-LinuxArena SMP x86_64 x86_64 GNU/Linux"
        elif base == "ls":
            file_list = "  ".join(self.files.keys()) if self.files else ""
            return f"\r\n{file_list}"
        elif base == "cat":
            if len(parts) > 1:
                filename = parts[1]
                if filename in self.files:
                    return f"\r\n{self.files[filename]}"
                return f"\r\ncat: {filename}: No such file or directory"
            return "\r\ncat: missing argument"
        elif base == "touch":
            if len(parts) > 1:
                self.files[parts[1]] = ""
                return ""
            return "\r\ntouch: missing file operand"
        elif base == "mkdir":
            if len(parts) > 1:
                self.files[parts[1]] = ""
                return ""
            return "\r\nmkdir: missing operand"
        elif base == "help":
            return "\r\nAvailable commands: ls, cat, pwd, whoami, uname -a, touch, mkdir, clear, echo, date, uptime"
        elif base == "date":
            import datetime
            return f"\r\n{datetime.datetime.now().strftime('%a %b %d %H:%M:%S UTC %Y')}"
        elif base == "uptime":
            return "\r\n 16:20:00 up 10 min,  1 user,  load average: 0.05, 0.03, 0.00"
        elif base == "echo":
            text = " ".join(parts[1:]).strip("\"'")
            return f"\r\n{text}"
        else:
            return f"\r\n{cmd_str}"


@router.websocket("/ws/terminal/{session_id}")
async def websocket_terminal_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()

    session = docker_manager.get_session(session_id)
    if not session:
        session = await docker_manager.create_session(session_id, user_id="usr_student")

    banner = (
        "\x1b[1;36m=========================================================\x1b[0m\r\n"
        "\x1b[1;32m  🚀 Welcome to LinuxArena Interactive Ubuntu Sandbox  \x1b[0m\r\n"
        f"\x1b[1;33m  Session TTL: 30 minutes | ID: {session.session_id[:8]}...\x1b[0m\r\n"
        "\x1b[1;36m=========================================================\x1b[0m\r\n\r\n"
    )
    await websocket.send_text(banner)

    if not session.is_mock and session.container_obj:
        try:
            container = session.container_obj
            exec_instance = container.client.api.exec_create(
                container.id,
                cmd="/bin/bash",
                stdin=True,
                stdout=True,
                stderr=True,
                tty=True
            )
            sock = container.client.api.exec_start(exec_instance['Id'], detach=False, tty=True, socket=True)
            sock._sock.setblocking(False)

            async def read_docker_pty():
                loop = asyncio.get_running_loop()
                while True:
                    try:
                        data = await loop.sock_recv(sock._sock, 1024)
                        if not data:
                            break
                        await websocket.send_text(data.decode("utf-8", errors="ignore"))
                    except (asyncio.CancelledError, WebSocketDisconnect):
                        break
                    except Exception:
                        await asyncio.sleep(0.05)

            pty_task = asyncio.create_task(read_docker_pty())

            while True:
                data = await websocket.receive_text()
                try:
                    msg = json.loads(data)
                    if msg.get("type") == "input":
                        sock._sock.send(msg["data"].encode("utf-8"))
                    elif msg.get("type") == "resize":
                        try:
                            container.client.api.exec_resize(exec_instance['Id'], height=msg["rows"], width=msg["cols"])
                        except Exception:
                            pass
                except json.JSONDecodeError:
                    sock._sock.send(data.encode("utf-8"))

        except Exception as e:
            logger.error(f"Docker PTY connection error: {e}. Switching to simulator.")
            session.is_mock = True

    if session.is_mock:
        sim = SimulatedBashShell(session_id)
        await websocket.send_text(sim.get_prompt())

        current_input = ""
        try:
            while True:
                char_data = await websocket.receive_text()
                try:
                    msg = json.loads(char_data)
                    if msg.get("type") == "input":
                        inp = msg.get("data", "")
                    elif msg.get("type") == "resize":
                        continue
                    else:
                        inp = char_data
                except json.JSONDecodeError:
                    inp = char_data

                for char in inp:
                    if char == "\r" or char == "\n":
                        output = sim.execute_command(current_input)
                        await websocket.send_text(output)
                        current_input = ""
                        await websocket.send_text(sim.get_prompt())
                    elif char == "\x7f" or char == "\x08":
                        if len(current_input) > 0:
                            current_input = current_input[:-1]
                            await websocket.send_text("\b \b")
                    elif char == "\x03":
                        current_input = ""
                        await websocket.send_text("^C")
                        await websocket.send_text(sim.get_prompt())
                    else:
                        current_input += char
                        await websocket.send_text(char)
        except WebSocketDisconnect:
            logger.info(f"WebSocket client disconnected for session {session_id}")
