from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class UserLogin(BaseModel):
    email: str
    password: str


class UserSignup(BaseModel):
    name: str
    email: str
    password: str


class OAuthAuthRequest(BaseModel):
    provider: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    provider_id: Optional[str] = None


class ProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    enrolled_course: Optional[str] = None
    batch: Optional[str] = None


class PasswordChangeSchema(BaseModel):
    current_password: str
    new_password: str


class UserProfile(BaseModel):
    id: str
    student_id: str = "LA-10452"
    name: str
    username: Optional[str] = "deepak_dev"
    email: str
    phone: Optional[str] = "+91 9876543210"
    avatar_url: Optional[str] = None
    auth_provider: str = "manual"
    enrolled_course: str = "Linux Administration Track"
    batch: str = "Linux Administration Batch 2026"
    xp: int = 1450
    streak: int = 7
    level: str = "Linux Administrator"
    badges: List[str] = ["Container Master", "Terminal Explorer", "Scripting Pro"]
    completed_labs: int = 8
    created_at: Optional[str] = None


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
    category: str
    difficulty: str
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
