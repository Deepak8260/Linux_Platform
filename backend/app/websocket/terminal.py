import asyncio
import json
import logging
import os
import threading
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState
from app.docker.manager import docker_manager

logger = logging.getLogger(__name__)

router = APIRouter()


def _pty_socket_read(sock, n: int = 4096) -> bytes:
    """Read a chunk from a docker-py exec socket, regardless of the
    underlying transport.

    docker-py's `exec_start(..., socket=True)` returns a *different* kind of
    object depending on how the daemon is reached:

      - Unix domain socket (Linux/macOS, `unix:///var/run/docker.sock`):
        the raw object is a `socket.SocketIO` instance, which exposes
        `.read()` / `.write()` (inherited from `io.RawIOBase`) but has NO
        `.recv()` / `.send()` methods at all.
      - Windows named pipe (`npipe:////./pipe/docker_engine`, the DEFAULT
        transport Docker Desktop for Windows uses when `DOCKER_HOST` is not
        overridden): the raw object is a `docker.transport.npipesocket
        .NpipeSocket`, which exposes `.recv()` / `.send()` but has NO
        `.read()` / `.write()` / `._sock` at all.
      - TCP/TLS: a real `socket.socket` (optionally wrapped in `ssl`),
        which exposes `.recv()` / `.send()` directly.

    The previous implementation only checked `hasattr(sock, 'read')` and
    then `hasattr(sock, '_sock')` - on the Windows npipe transport NEITHER
    attribute exists, so every iteration silently hit `else: break` and the
    reader thread exited immediately after starting, without raising any
    exception. That is why only the static banner ever showed up in the
    browser: the container's real bash process was running and producing a
    prompt, but nothing was ever read off its PTY socket to forward to the
    browser.
    """
    if hasattr(sock, "recv"):
        return sock.recv(n)
    if hasattr(sock, "read"):
        return sock.read(n)
    if hasattr(sock, "_sock"):
        return sock._sock.recv(n)
    return os.read(sock.fileno(), n)


def _pty_socket_write(sock, data: bytes) -> None:
    """Write bytes to a docker-py exec socket, regardless of transport.

    Mirrors `_pty_socket_read` above: NpipeSocket has `.send()` but not
    `.write()`/`._sock`; the Unix `SocketIO` wrapper has `.write()` but not
    `.send()`. Checking `.send()` first (matching docker-py's own
    `docker.utils.socket.read` dispatch order) makes this work on every
    transport instead of only Unix sockets.
    """
    if hasattr(sock, "send"):
        sock.send(data)
        return
    if hasattr(sock, "write"):
        sock.write(data)
        if hasattr(sock, "flush"):
            sock.flush()
        return
    if hasattr(sock, "_sock"):
        sock._sock.send(data)
        return
    os.write(sock.fileno(), data)


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

        # Handle sudo prefixes
        if cmd_str.startswith("sudo "):
            clean_cmd = cmd_str[5:].strip()
            return f"\r\n[sudo] password for {self.user}: \r\n" + self.execute_command(clean_cmd)

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
        elif base == "apt" or base == "apt-get":
            pkg = parts[2] if len(parts) > 2 else "package"
            return f"\r\nReading package lists... Done\r\nBuilding dependency tree... Done\r\n{pkg} is already the newest version (2.12-1).\r\n0 upgraded, 0 newly installed."
        elif base == "docker":
            sub = parts[1] if len(parts) > 1 else ""
            if sub in ("-v", "--version", "version"):
                return "\r\nDocker version 24.0.5, build ced0996"
            elif sub == "ps":
                return "\r\nCONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES"
            elif sub == "images":
                return "\r\nREPOSITORY   TAG       IMAGE ID   CREATED   SIZE"
            else:
                return "\r\nClient: Docker Engine - Community\r\n Version:           24.0.5\r\n API version:       1.43"
        elif base == "help":
            return "\r\nAvailable commands: ls, cat, pwd, whoami, uname -a, touch, mkdir, clear, echo, date, uptime, sudo, apt"
        elif base == "date":
            import datetime
            return f"\r\n{datetime.datetime.now().strftime('%a %b %d %H:%M:%S UTC %Y')}"
        elif base == "uptime":
            return "\r\n 16:20:00 up 10 min,  1 user,  load average: 0.05, 0.03, 0.00"
        elif base == "echo":
            text = " ".join(parts[1:]).strip("\"'")
            return f"\r\n{text}"
        else:
            return f"\r\n{cmd_str}: command executed successfully."


async def safe_send_text(websocket: WebSocket, text: str) -> bool:
    """Send text to the client websocket, but never raise if it's already gone.

    Returns True if the send succeeded, False if the client was already
    disconnected (in which case the caller should stop trying to talk to it).
    """
    if websocket.client_state != WebSocketState.CONNECTED:
        return False
    try:
        await websocket.send_text(text)
        return True
    except (WebSocketDisconnect, RuntimeError):
        # RuntimeError covers starlette raising after the ASGI connection
        # has already closed underneath us (e.g. "Cannot call 'send' once
        # a close message has been sent").
        return False


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
    if not await safe_send_text(websocket, banner):
        logger.info(f"Browser websocket closed before banner could be sent for session {session_id}.")
        return

    if not session.is_mock and session.container_obj:
        # --- Step 1: set up the Docker exec/PTY itself. Only genuine failures
        # to create/start the exec socket should be treated as "Docker PTY
        # failed" and trigger a fallback to the simulator. This is kept in
        # its own try/except, separate from the browser-facing receive loop
        # below, so that an ordinary/early close of the BROWSER's websocket
        # is never misreported as a Docker problem.
        container = session.container_obj
        docker_setup_ok = False
        try:
            exec_instance = container.client.api.exec_create(
                container.id,
                cmd="/bin/bash",
                stdin=True,
                stdout=True,
                stderr=True,
                tty=True,
                user="root"
            )
            sock = container.client.api.exec_start(exec_instance['Id'], detach=False, tty=True, socket=True)
            docker_setup_ok = True
        except Exception as e:
            logger.error(f"Docker exec/PTY setup failed for session {session_id}: {e}. Switching to simulator.")
            session.is_mock = True

        if docker_setup_ok:
            loop = asyncio.get_running_loop()

            # Thread reader for Docker PTY socket on Windows & Linux. Uses a
            # blocking loop (docker's raw exec socket is a blocking OS
            # socket / named pipe) offloaded onto a dedicated thread, and
            # hands each chunk back to the asyncio event loop via
            # run_coroutine_threadsafe so the websocket send happens on the
            # loop that owns it.
            def pty_reader_thread():
                while True:
                    try:
                        chunk = _pty_socket_read(sock, 4096)

                        if not chunk:
                            break

                        text = chunk.decode("utf-8", errors="ignore")
                        asyncio.run_coroutine_threadsafe(safe_send_text(websocket, text), loop)
                    except Exception as read_exc:
                        logger.info(f"Docker PTY socket reader stopped for session {session_id}: {read_exc}")
                        break

            reader_thread = threading.Thread(target=pty_reader_thread, daemon=True)
            reader_thread.start()

            # --- Step 2: forward input from the BROWSER's websocket to the
            # Docker PTY socket. A disconnect here means the *browser* went
            # away (tab closed, page navigated, effect-cleanup reconnect,
            # etc.) - it says nothing about the Docker socket's health, so it
            # must never be logged/treated as a Docker PTY error.
            try:
                while True:
                    data = await websocket.receive_text()
                    try:
                        msg = json.loads(data)
                        if msg.get("type") == "input":
                            payload = msg["data"].encode("utf-8")
                        elif msg.get("type") == "resize":
                            try:
                                container.client.api.exec_resize(exec_instance['Id'], height=msg["rows"], width=msg["cols"])
                            except Exception:
                                pass
                            continue
                        else:
                            payload = data.encode("utf-8")
                    except json.JSONDecodeError:
                        payload = data.encode("utf-8")

                    try:
                        _pty_socket_write(sock, payload)
                    except Exception as write_exc:
                        # This IS a genuine Docker-side socket failure.
                        logger.error(f"Docker PTY socket write error for session {session_id}: {write_exc}.")
                        raise

            except WebSocketDisconnect:
                logger.info(f"Browser websocket disconnected for session {session_id} (Docker PTY session ended normally).")
                return
            except Exception as e:
                logger.error(f"Docker PTY socket error for session {session_id}: {e}. Switching to simulator.")
                session.is_mock = True

    if session.is_mock:
        # The browser side may already be gone (e.g. we just fell back to the
        # simulator after the socket died mid-session) - never let a send
        # here crash the ASGI app.
        if websocket.client_state != WebSocketState.CONNECTED:
            logger.info(f"Skipping simulator fallback for session {session_id}: browser websocket already closed.")
            return

        sim = SimulatedBashShell(session_id)
        if not await safe_send_text(websocket, sim.get_prompt()):
            logger.info(f"Browser websocket closed before simulator prompt could be sent for session {session_id}.")
            return

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
                        if not await safe_send_text(websocket, output):
                            return
                        current_input = ""
                        if not await safe_send_text(websocket, sim.get_prompt()):
                            return
                    elif char == "\x7f" or char == "\x08":
                        if len(current_input) > 0:
                            current_input = current_input[:-1]
                            if not await safe_send_text(websocket, "\b \b"):
                                return
                    elif char == "\x03":
                        current_input = ""
                        if not await safe_send_text(websocket, "^C"):
                            return
                        if not await safe_send_text(websocket, sim.get_prompt()):
                            return
                    else:
                        current_input += char
                        if not await safe_send_text(websocket, char):
                            return
        except WebSocketDisconnect:
            logger.info(f"WebSocket client disconnected for session {session_id}")
