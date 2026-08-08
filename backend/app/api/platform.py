from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.domain import User

router = APIRouter(prefix="/platform", tags=["Platform & Recruiter"])


class LeaderboardUser(BaseModel):
    rank: int
    name: str
    avatar: str
    xp: int
    streak: int
    badge: str


class RecruiterAssessment(BaseModel):
    id: str
    title: str
    topic: str
    duration_minutes: int
    candidate_count: int
    status: str


@router.get("/leaderboard", response_model=List[LeaderboardUser])
async def get_leaderboard(db: Session = Depends(get_db)):
    """Real leaderboard, built from actual users in the database - ranked by
    XP. No more fake/sample entries here; if nobody has earned XP yet this
    simply returns an empty list and the frontend shows an empty state."""
    top_users = (
        db.query(User)
        .filter(User.xp.isnot(None))
        .order_by(User.xp.desc())
        .limit(50)
        .all()
    )
    return [
        LeaderboardUser(
            rank=idx + 1,
            name=u.name,
            avatar=u.avatar_url or "",
            xp=u.xp or 0,
            streak=u.streak or 0,
            badge=u.level or "Learner",
        )
        for idx, u in enumerate(top_users)
    ]


@router.get("/recruiter/assessments", response_model=List[RecruiterAssessment])
async def get_assessments():
    """Recruiter assessments are not backed by a real table yet - there is
    nothing genuine to show here, so this returns an empty list instead of
    fabricated sample assessments. Admins can still preview what this feature
    looks like via /api/v1/admin/demo-content."""
    return []
