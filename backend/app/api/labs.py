from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import Lab, LabVerifyRequest, LabVerifyResponse
from app.docker.manager import docker_manager

router = APIRouter(prefix="/labs", tags=["Labs"])

# Curated Curriculum Labs
LABS_CATALOG: List[Lab] = [
    Lab(
        id="lab-01-navigation",
        title="Linux File Navigation & Discovery",
        category="Linux Fundamentals",
        difficulty="Easy",
        xp_reward=100,
        description="Master foundational commands to inspect directory structures, list files, and view file contents.",
        steps=[
            {
                "step_number": 1,
                "title": "Identify Current Directory",
                "instructions": "Print your current working directory using `pwd`.",
                "hint": "Type `pwd` in the terminal.",
                "validation_cmd": "pwd"
            },
            {
                "step_number": 2,
                "title": "Create a Project Directory",
                "instructions": "Create a directory named `/home/student/workspace` using `mkdir`.",
                "hint": "Run `mkdir -p /home/student/workspace`",
                "validation_cmd": "test -d /home/student/workspace"
            },
            {
                "step_number": 3,
                "title": "Create a Welcome File",
                "instructions": "Create a file at `/home/student/workspace/notes.txt` containing the text 'LinuxArena'.",
                "hint": "Run `echo 'LinuxArena' > /home/student/workspace/notes.txt`",
                "validation_cmd": "grep -q 'LinuxArena' /home/student/workspace/notes.txt"
            }
        ]
    ),
    Lab(
        id="lab-02-permissions",
        title="File Permissions & Ownership (Chmod/Chown)",
        category="Users & Permissions",
        difficulty="Medium",
        xp_reward=150,
        description="Configure Linux file permissions, executable bits, and ownership.",
        steps=[
            {
                "step_number": 1,
                "title": "Create a Script File",
                "instructions": "Create a script file at `/home/student/deploy.sh` with `#!/bin/bash` header.",
                "hint": "Run `echo '#!/bin/bash' > /home/student/deploy.sh`",
                "validation_cmd": "test -f /home/student/deploy.sh"
            },
            {
                "step_number": 2,
                "title": "Grant Executable Permissions",
                "instructions": "Make `/home/student/deploy.sh` executable for owner and group (755).",
                "hint": "Run `chmod 755 /home/student/deploy.sh`",
                "validation_cmd": "test -x /home/student/deploy.sh"
            }
        ]
    ),
    Lab(
        id="lab-03-rhcsa-user-group",
        title="RHCSA Exam Challenge: Admin User Setup",
        category="RHCSA",
        difficulty="Hard",
        xp_reward=250,
        description="Simulate RHCSA exam requirement: create sysadmin group, add user devops, set sudo permissions.",
        steps=[
            {
                "step_number": 1,
                "title": "Create Group 'sysadmin'",
                "instructions": "Create a system group named `sysadmin`.",
                "hint": "Run `groupadd sysadmin`",
                "validation_cmd": "getent group sysadmin"
            },
            {
                "step_number": 2,
                "title": "Create User 'devops'",
                "instructions": "Create user `devops` assigned to primary group `sysadmin`.",
                "hint": "Run `useradd -g sysadmin devops`",
                "validation_cmd": "id devops | grep -q sysadmin"
            }
        ]
    ),
    Lab(
        id="lab-04-docker-nginx",
        title="DevOps Lab: Deploy Nginx Web Container",
        category="Docker & DevOps",
        difficulty="Medium",
        xp_reward=200,
        description="Launch an isolated web service container and inspect active processes.",
        steps=[
            {
                "step_number": 1,
                "title": "Install / Verify Nginx",
                "instructions": "Verify or install nginx package inside the system environment.",
                "hint": "Run `apt-get update && apt-get install -y nginx`",
                "validation_cmd": "which nginx || test -f /etc/nginx/nginx.conf"
            }
        ]
    )
]


@router.get("", response_model=List[Lab])
async def list_labs():
    return LABS_CATALOG


@router.get("/{lab_id}", response_model=Lab)
async def get_lab(lab_id: str):
    for lab in LABS_CATALOG:
        if lab.id == lab_id:
            return lab
    raise HTTPException(status_code=404, detail="Lab not found")


@router.post("/verify", response_model=LabVerifyResponse)
async def verify_lab_step(req: LabVerifyRequest):
    # Find lab and step
    target_lab = None
    for l in LABS_CATALOG:
        if l.id == req.lab_id:
            target_lab = l
            break

    if not target_lab:
        raise HTTPException(status_code=404, detail="Lab not found")

    target_step = None
    for st in target_lab.steps:
        if st.step_number == req.step_number:
            target_step = st
            break

    if not target_step:
        raise HTTPException(status_code=404, detail="Step not found")

    validation_cmd = target_step.validation_cmd
    if not validation_cmd:
        return LabVerifyResponse(success=True, message="Step auto-completed", exit_code=0, output="")

    # Execute check inside container session
    result = docker_manager.exec_validation_command(req.session_id, validation_cmd)

    if result["exit_code"] == 0:
        return LabVerifyResponse(
            success=True,
            message=f"Step {req.step_number} verified successfully! Great job! 🎉",
            exit_code=result["exit_code"],
            output=result["output"]
        )
    else:
        return LabVerifyResponse(
            success=False,
            message=f"Validation failed. Step requirement not yet met. (Output: {result['output'].strip() or 'Exit code non-zero'})",
            exit_code=result["exit_code"],
            output=result["output"]
        )
