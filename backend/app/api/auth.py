import uuid
from fastapi import APIRouter, HTTPException, Status
from app.models.schemas import UserLogin, UserSignup, UserProfile, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

# Mock memory store for demonstration / local dev
USERS_DB = {
    "student@linuxarena.io": {
        "id": "usr_101",
        "name": "Alex Student",
        "email": "student@linuxarena.io",
        "password": "password123",
        "xp": 1450,
        "streak": 7,
        "level": "RHCSA Aspirant",
        "badges": ["Container Master", "Terminal Explorer", "Scripting Pro"],
        "completed_labs": 12
    }
}


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup):
    if user_data.email in USERS_DB:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    uid = f"usr_{uuid.uuid4().hex[:8]}"
    profile = UserProfile(
        id=uid,
        name=user_data.name,
        email=user_data.email,
        xp=100,
        streak=1,
        level="Linux Novice",
        badges=["First Login"],
        completed_labs=0
    )
    USERS_DB[user_data.email] = {
        "id": uid,
        "name": user_data.name,
        "email": user_data.email,
        "password": user_data.password,
        "xp": 100,
        "streak": 1,
        "level": "Linux Novice",
        "badges": ["First Login"],
        "completed_labs": 0
    }

    return TokenResponse(
        access_token=f"mock_token_{uid}",
        user=profile
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = USERS_DB.get(credentials.email)
    if not user or user["password"] != credentials.password:
        # Allow default guest login fallback for convenience
        profile = UserProfile(
            id="usr_demo",
            name=credentials.email.split("@")[0].capitalize(),
            email=credentials.email,
            xp=1250,
            streak=5,
            level="Linux Explorer",
            badges=["Terminal Pioneer"],
            completed_labs=6
        )
        return TokenResponse(access_token="mock_token_demo", user=profile)

    profile = UserProfile(**{k: v for k, v in user.items() if k != "password"})
    return TokenResponse(access_token=f"mock_token_{user['id']}", user=profile)


@router.get("/me", response_model=UserProfile)
async def get_me():
    user = USERS_DB["student@linuxarena.io"]
    return UserProfile(**{k: v for k, v in user.items() if k != "password"})
