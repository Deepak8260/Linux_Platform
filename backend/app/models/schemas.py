from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    xp: int = 1250
    streak: int = 5
    level: str = "Linux Novice"
    badges: List[str] = ["First Container", "Terminal Master", "Bash Ninja"]
    completed_labs: int = 8


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile


class CreateSessionRequest(BaseModel):
    user_id: Optional[str] = "guest"


class SessionInfoResponse(BaseModel):
    session_id: str
    user_id: str
    remaining_seconds: int
    ttl_seconds: int
    is_mock: bool
    status: str = "active"


class AIAskRequest(BaseModel):
    prompt: str
    context: Optional[str] = ""


class AIAskResponse(BaseModel):
    answer: str
    suggested_commands: List[str]
    source: str


class ValidateCommandRequest(BaseModel):
    command: str


class LabStep(BaseModel):
    step_number: int
    title: str
    instructions: str
    hint: Optional[str] = None
    validation_cmd: Optional[str] = None


class Lab(BaseModel):
    id: str
    title: str
    category: str  # Fundamentals, Admin, Networking, Docker, K8s, RHCSA, DevOps
    difficulty: str  # Easy, Medium, Hard
    xp_reward: int
    description: str
    steps: List[LabStep]


class LabVerifyRequest(BaseModel):
    session_id: str
    lab_id: str
    step_number: int


class LabVerifyResponse(BaseModel):
    success: bool
    message: str
    exit_code: int
    output: str
