import logging
import re
from typing import List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

# Rejection patterns for dangerous operations
DANGEROUS_PATTERNS = [
    r"rm\s+-rf\s+/",
    r"rm\s+-rf\s+\*",
    r"dd\s+if=/dev/(zero|null)",
    r":\(\)\{\s*:\|:&\s*\};:",  # Fork bomb
    r"mkfs",
    r"> /dev/sd[a-z]",
    r"chmod\s+-R\s+777\s+/",
    r"shutdown",
    r"reboot",
    r"init\s+0"
]


class CommandSecurityValidator:
    @staticmethod
    def validate_command(command: str) -> Dict[str, Any]:
        """Check if command contains dangerous execution patterns."""
        for pattern in DANGEROUS_PATTERNS:
            if re.search(pattern, command, re.IGNORECASE):
                return {
                    "is_safe": False,
                    "reason": f"Command contains blocked high-risk execution pattern ({pattern}). Execution prevented for system safety."
                }
        return {"is_safe": True, "reason": "Command passed safety validation rules."}


class GeminiAIMentor:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        self._init_client()

    def _init_client(self):
        if not self.api_key:
            logger.info("No GEMINI_API_KEY found in config. AI Mentor will run in rule-assisted mode.")
            return
        try:
            from google import genai
            self.client = genai.Client(api_key=self.api_key)
            logger.info("Gemini Client initialized successfully.")
        except Exception as e:
            logger.warning(f"Failed to initialize Gemini Client: {e}")
            self.client = None

    async def generate_response(self, prompt: str, context: str = "") -> Dict[str, Any]:
        system_instructions = (
            "You are LinuxArena AI Mentor, an expert Linux, RHCSA, and DevOps mentor. "
            "Help students understand Linux commands, debug errors, write Bash scripts, and master DevOps tools (Docker, K8s, Nginx). "
            "Keep explanations clear, structured, and educational. Always provide exact commands in clean bash codeblocks."
        )

        if self.client:
            try:
                # Use gemini-2.5-flash or gemini-2.0-flash
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=f"{system_instructions}\nContext: {context}\nUser Question: {prompt}"
                )
                text = response.text
                commands = self._extract_commands(text)
                return {
                    "answer": text,
                    "suggested_commands": commands,
                    "source": "gemini"
                }
            except Exception as e:
                logger.error(f"Gemini API error: {e}")

        # Fallback intelligent rule-based mentor
        return self._rule_based_response(prompt)

    def _extract_commands(self, text: str) -> List[str]:
        """Extract bash commands enclosed in code blocks."""
        code_blocks = re.findall(r"```(?:bash|sh)?\n(.*?)```", text, re.DOTALL)
        extracted = []
        for block in code_blocks:
            lines = [line.strip() for line in block.split("\n") if line.strip() and not line.strip().startswith("#")]
            extracted.extend(lines)
        return extracted

    def _rule_based_response(self, prompt: str) -> Dict[str, Any]:
        p = prompt.lower()

        if "user" in p and ("create" in p or "add" in p):
            cmd = "sudo useradd -m -s /bin/bash john && sudo passwd john"
            ans = (
                "### Creating a New User in Linux\n\n"
                "To add a new user named `john` with a home directory and default bash shell, use `useradd`:\n\n"
                "```bash\nsudo useradd -m -s /bin/bash john\nsudo passwd john\n```\n\n"
                "**Key flags explained:**\n"
                "- `-m`: Creates the user's home directory `/home/john`.\n"
                "- `-s /bin/bash`: Sets Bash as default shell."
            )
            return {"answer": ans, "suggested_commands": [cmd], "source": "rule_mentor"}

        elif "permission" in p or "chmod" in p or "chown" in p:
            cmd = "chmod 755 script.sh && chown student:student script.sh"
            ans = (
                "### Managing Linux File Permissions\n\n"
                "Use `chmod` to set read, write, execute permissions and `chown` to change ownership:\n\n"
                "```bash\nchmod 755 script.sh\nchown student:student script.sh\n```\n\n"
                "- `755`: Owner (rwx), Group (r-x), Others (r-x)."
            )
            return {"answer": ans, "suggested_commands": [cmd], "source": "rule_mentor"}

        elif "process" in p or "kill" in p or "ps" in p:
            cmd = "ps aux | grep nginx\nsudo kill -9 <PID>"
            ans = (
                "### Managing Linux Processes\n\n"
                "You can view running processes with `ps aux` or `top`, and terminate them using `kill`:\n\n"
                "```bash\nps aux | grep nginx\nsudo kill -9 <PID>\n```"
            )
            return {"answer": ans, "suggested_commands": ["ps aux", "top"], "source": "rule_mentor"}

        elif "docker" in p:
            cmd = "docker run -d -p 80:80 --name webserver nginx:alpine"
            ans = (
                "### Docker Container Management\n\n"
                "To run an Nginx web server container in background mode:\n\n"
                "```bash\ndocker run -d -p 80:80 --name webserver nginx:alpine\n```"
            )
            return {"answer": ans, "suggested_commands": [cmd], "source": "rule_mentor"}

        else:
            cmd = "help"
            ans = (
                f"### LinuxArena Mentor Assistance\n\n"
                f"Here is guidance for your request: **'{prompt}'**\n\n"
                "```bash\nhelp\nuname -a\ncat /etc/os-release\n```\n\n"
                "Try running these diagnostic commands in the live terminal to inspect the system environment!"
            )
            return {"answer": ans, "suggested_commands": ["uname -a", "cat /etc/os-release"], "source": "rule_mentor"}


ai_mentor = GeminiAIMentor()
validator = CommandSecurityValidator()
