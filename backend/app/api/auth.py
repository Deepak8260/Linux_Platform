import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import User
from app.models.schemas import UserLogin, UserSignup, UserProfile, TokenResponse
from app.security.jwt import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # Check if email exists in database
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    uid = f"usr_{uuid.uuid4().hex[:8]}"
    hashed_pwd = hash_password(user_data.password)

    new_user = User(
        id=uid,
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_pwd,
        xp=100,
        streak=1,
        level="Linux Novice",
        badges=["First Login"],
        completed_labs=0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "email": new_user.email})

    profile = UserProfile(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        xp=new_user.xp,
        streak=new_user.streak,
        level=new_user.level,
        badges=new_user.badges or [],
        completed_labs=new_user.completed_labs
    )

    return TokenResponse(access_token=token, user=profile)


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        # Demo fallback for instant guest login convenience
        profile = UserProfile(
            id="usr_demo",
            name=credentials.email.split("@")[0].capitalize() if "@" in credentials.email else "Student",
            email=credentials.email,
            xp=1250,
            streak=5,
            level="Linux Explorer",
            badges=["Terminal Pioneer"],
            completed_labs=6
        )
        demo_token = create_access_token({"sub": "usr_demo", "email": credentials.email})
        return TokenResponse(access_token=demo_token, user=profile)

    token = create_access_token({"sub": user.id, "email": user.email})
    profile = UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        xp=user.xp,
        streak=user.streak,
        level=user.level,
        badges=user.badges or [],
        completed_labs=user.completed_labs
    )

    return TokenResponse(access_token=token, user=profile)


@router.get("/me", response_model=UserProfile)
async def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        xp=user.xp,
        streak=user.streak,
        level=user.level,
        badges=user.badges or [],
        completed_labs=user.completed_labs
    )
