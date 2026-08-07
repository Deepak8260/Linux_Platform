import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.domain import User
from app.models.schemas import UserLogin, UserSignup, UserProfile, TokenResponse, OAuthAuthRequest
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
        auth_provider="manual",
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
        auth_provider="manual",
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

    if not user:
        # Auto-create user for frictionless development if not existing
        uid = f"usr_{uuid.uuid4().hex[:8]}"
        hashed_pwd = hash_password(credentials.password)
        user = User(
            id=uid,
            name=credentials.email.split("@")[0].capitalize() if "@" in credentials.email else "Student",
            email=credentials.email,
            hashed_password=hashed_pwd,
            auth_provider="manual",
            xp=1250,
            streak=5,
            level="Linux Explorer",
            badges=["Terminal Pioneer"],
            completed_labs=4
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    elif user.hashed_password and not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id, "email": user.email})
    profile = UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        avatar_url=user.avatar_url,
        auth_provider=user.auth_provider,
        xp=user.xp,
        streak=user.streak,
        level=user.level,
        badges=user.badges or [],
        completed_labs=user.completed_labs
    )

    return TokenResponse(access_token=token, user=profile)


@router.post("/google", response_model=TokenResponse)
async def google_auth(req: OAuthAuthRequest, db: Session = Depends(get_db)):
    """Google OAuth authentication (creates/updates MySQL user record)."""
    user = db.query(User).filter(User.email == req.email).first()
    
    if not user:
        uid = f"usr_g_{uuid.uuid4().hex[:8]}"
        user = User(
            id=uid,
            name=req.name or "Google Learner",
            email=req.email,
            auth_provider="google",
            provider_id=req.provider_id,
            avatar_url=req.avatar_url or "https://lh3.googleusercontent.com/a/default-user",
            xp=200,
            streak=1,
            level="Google Certified Explorer",
            badges=["Google Auth Verified"],
            completed_labs=1
        )
        db.add(user)
    else:
        user.auth_provider = "google"
        if req.avatar_url:
            user.avatar_url = req.avatar_url
        if req.provider_id:
            user.provider_id = req.provider_id

    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email})
    profile = UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        avatar_url=user.avatar_url,
        auth_provider="google",
        xp=user.xp,
        streak=user.streak,
        level=user.level,
        badges=user.badges or [],
        completed_labs=user.completed_labs
    )

    return TokenResponse(access_token=token, user=profile)


@router.post("/github", response_model=TokenResponse)
async def github_auth(req: OAuthAuthRequest, db: Session = Depends(get_db)):
    """GitHub OAuth authentication (creates/updates MySQL user record)."""
    user = db.query(User).filter(User.email == req.email).first()

    if not user:
        uid = f"usr_gh_{uuid.uuid4().hex[:8]}"
        user = User(
            id=uid,
            name=req.name or "GitHub Developer",
            email=req.email,
            auth_provider="github",
            provider_id=req.provider_id,
            avatar_url=req.avatar_url or "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            xp=250,
            streak=2,
            level="DevOps Hacker",
            badges=["GitHub Auth Verified", "Open Source Pioneer"],
            completed_labs=2
        )
        db.add(user)
    else:
        user.auth_provider = "github"
        if req.avatar_url:
            user.avatar_url = req.avatar_url
        if req.provider_id:
            user.provider_id = req.provider_id

    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email})
    profile = UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        avatar_url=user.avatar_url,
        auth_provider="github",
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
        avatar_url=user.avatar_url,
        auth_provider=user.auth_provider,
        xp=user.xp,
        streak=user.streak,
        level=user.level,
        badges=user.badges or [],
        completed_labs=user.completed_labs
    )
