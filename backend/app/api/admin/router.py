"""
Admin panel API.

Everything under /api/v1/admin/* requires a logged-in user whose is_admin flag
is true (enforced by the require_admin dependency). This is the ONLY place in
the app that still returns the platform's sample/demo content (fake
leaderboard entries, sample recruiter assessments, sample certificates,
sample badge catalog) - regular users never see it anymore since it isn't
backed by real database rows.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.domain import User, LabModel, UserProgress
from app.models.schemas import UserProfile
from app.dependencies.auth import require_admin
from app.docker.manager import docker_manager
from app.api.auth import user_to_profile

router = APIRouter(prefix="/admin", tags=["Admin"])


# --------------------------------------------------------------------------
# Schemas
# --------------------------------------------------------------------------

class AdminStats(BaseModel):
    total_users: int
    admin_users: int
    total_labs_completed_events: int
    active_container_sessions: int
    total_curated_labs: int
    signups_last_7_days: int


class SetAdminRequest(BaseModel):
    is_admin: bool


class DemoLeaderboardUser(BaseModel):
    rank: int
    name: str
    avatar: str
    xp: int
    streak: int
    badge: str


class DemoRecruiterAssessment(BaseModel):
    id: str
    title: str
    topic: str
    duration_minutes: int
    candidate_count: int
    status: str


class DemoCertificate(BaseModel):
    id: str
    title: str
    issueDate: str
    serialNumber: str
    skills: List[str]
    disclaimer: str


class DemoBadge(BaseModel):
    name: str
    desc: str
    unlocked: bool
    inProgress: bool
    requirement: Optional[str] = None
    icon: str


class DemoContentResponse(BaseModel):
    note: str
    leaderboard: List[DemoLeaderboardUser]
    recruiter_assessments: List[DemoRecruiterAssessment]
    certificates: List[DemoCertificate]
    badges: List[DemoBadge]


# --------------------------------------------------------------------------
# Stats & user management (real database data)
# --------------------------------------------------------------------------

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    import datetime
    seven_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)

    total_users = db.query(func.count(User.id)).scalar() or 0
    admin_users = db.query(func.count(User.id)).filter(User.is_admin.is_(True)).scalar() or 0
    completed_events = db.query(func.count(UserProgress.id)).filter(UserProgress.completed.is_(True)).scalar() or 0
    recent_signups = db.query(func.count(User.id)).filter(User.created_at >= seven_days_ago).scalar() or 0
    active_sessions = len([s for s in docker_manager.sessions.values() if not s.is_expired])

    return AdminStats(
        total_users=total_users,
        admin_users=admin_users,
        total_labs_completed_events=completed_events,
        active_container_sessions=active_sessions,
        total_curated_labs=db.query(func.count(LabModel.id)).scalar() or 0,
        signups_last_7_days=recent_signups,
    )


@router.get("/users", response_model=List[UserProfile])
async def list_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [user_to_profile(u) for u in users]


@router.patch("/users/{user_id}/admin", response_model=UserProfile)
async def set_user_admin(
    user_id: str,
    payload: SetAdminRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    if target.id == admin.id and not payload.is_admin:
        raise HTTPException(status_code=400, detail="You cannot remove your own admin access")

    target.is_admin = payload.is_admin
    db.commit()
    db.refresh(target)
    return user_to_profile(target)


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")

    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(target)
    db.commit()
    return {"status": "success", "message": f"Deleted user {user_id}"}


@router.get("/sessions")
async def list_active_sessions(admin: User = Depends(require_admin)):
    return [
        {
            "session_id": sid,
            "user_id": s.user_id,
            "status": "expired" if s.is_expired else "active",
            "is_mock": getattr(s, "is_mock", False),
        }
        for sid, s in docker_manager.sessions.items()
    ]


# --------------------------------------------------------------------------
# Demo / sample content — admin-only visibility.
#
# This is the same placeholder content that used to be hardcoded directly
# into the public LeaderboardPage / RecruiterPage / CertificatesPage /
# BadgesPage components as a fallback whenever a real API call failed. It has
# been moved here, behind require_admin, so ordinary visitors never see fake
# learners/certificates again - only admins can preview it, clearly labeled
# as sample data.
# --------------------------------------------------------------------------

DEMO_LEADERBOARD = [
    DemoLeaderboardUser(rank=1, name="Sarah Jenkins", avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", xp=4850, streak=24, badge="DevOps Legend"),
    DemoLeaderboardUser(rank=2, name="David Kim", avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", xp=4120, streak=19, badge="Linux Administration Specialist"),
    DemoLeaderboardUser(rank=3, name="Elena Rostova", avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", xp=3890, streak=14, badge="Kernel Master"),
    DemoLeaderboardUser(rank=4, name="Alex Student (You)", avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", xp=1450, streak=7, badge="Terminal Explorer"),
    DemoLeaderboardUser(rank=5, name="Marcus Vance", avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", xp=1200, streak=4, badge="Bash Explorer"),
]

DEMO_ASSESSMENTS = [
    DemoRecruiterAssessment(id="eval-01", title="Senior DevOps Engineer Linux Practical Test", topic="Linux Admin + K8s", duration_minutes=45, candidate_count=12, status="Active"),
    DemoRecruiterAssessment(id="eval-02", title="Linux System Administrator Screening", topic="Users, Permissions, Storage", duration_minutes=60, candidate_count=8, status="Completed"),
]

DEMO_CERTIFICATES = [
    DemoCertificate(
        id="cert-linux-admin-2026",
        title="LinuxArena Linux Administration Mastery",
        issueDate="August 2026",
        serialNumber="LA-CERT-2026-849201",
        skills=["Linux Coreutils", "User Management", "Permissions & Sudo", "Systemd Services"],
        disclaimer="Issued by LinuxArena. This certificate verifies completion of LinuxArena practical labs and is not an official third-party vendor certification.",
    ),
    DemoCertificate(
        id="cert-docker-2026",
        title="LinuxArena Docker & DevOps Fundamentals Specialist",
        issueDate="July 2026",
        serialNumber="LA-CERT-2026-392014",
        skills=["Docker Engine", "Nginx Configuration", "Process Troubleshooting"],
        disclaimer="Issued by LinuxArena. This certificate verifies completion of LinuxArena practical labs and is not an official vendor certification.",
    ),
]

DEMO_BADGES = [
    DemoBadge(name="Container Master", desc="Spin up 5 Ubuntu Sandbox sessions", unlocked=True, inProgress=False, icon="🚀"),
    DemoBadge(name="Terminal Explorer", desc="Execute 50 terminal commands in live bash sandbox", unlocked=True, inProgress=False, icon="💻"),
    DemoBadge(name="Scripting Pro", desc="Complete 5 guided Linux coreutils labs", unlocked=True, inProgress=False, icon="📜"),
    DemoBadge(name="Linux Administration Specialist", desc="Pass the Linux Admin User Setup simulation", unlocked=True, inProgress=False, icon="🛡️"),
    DemoBadge(name="Kernel Master", desc="Maintain a 14-day continuous daily practice streak", unlocked=False, inProgress=True, requirement="14-Day Streak (Progress: 7/14)", icon="🧠"),
    DemoBadge(name="DevOps Orchestrator", desc="Deploy 5 Nginx & Docker web container labs", unlocked=False, inProgress=True, requirement="Complete 5 DevOps Labs (Progress: 1/5)", icon="⚙️"),
]


@router.get("/demo-content", response_model=DemoContentResponse)
async def get_demo_content(admin: User = Depends(require_admin)):
    return DemoContentResponse(
        note="This is placeholder/sample content. It is only ever shown here, to admins - real visitors now see real (possibly empty) data instead.",
        leaderboard=DEMO_LEADERBOARD,
        recruiter_assessments=DEMO_ASSESSMENTS,
        certificates=DEMO_CERTIFICATES,
        badges=DEMO_BADGES,
    )
