from typing import List
from fastapi import APIRouter
from pydantic import BaseModel

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


LEADERBOARD_DATA = [
    LeaderboardUser(rank=1, name="Sarah Jenkins", avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", xp=4850, streak=24, badge="DevOps Legend"),
    LeaderboardUser(rank=2, name="David Kim", avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", xp=4120, streak=19, badge="Linux Administration Specialist"),
    LeaderboardUser(rank=3, name="Elena Rostova", avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", xp=3890, streak=14, badge="Kernel Master"),
    LeaderboardUser(rank=4, name="Alex Student (You)", avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", xp=1450, streak=7, badge="Terminal Explorer"),
    LeaderboardUser(rank=5, name="Marcus Vance", avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", xp=1200, streak=4, badge="Bash Explorer"),
]

ASSESSMENTS_DATA = [
    RecruiterAssessment(id="eval-01", title="Senior DevOps Engineer Linux Practical Test", topic="Linux Admin + K8s", duration_minutes=45, candidate_count=12, status="Active"),
    RecruiterAssessment(id="eval-02", title="Linux System Administrator Screening", topic="Users, Permissions, Storage", duration_minutes=60, candidate_count=8, status="Completed"),
]


@router.get("/leaderboard", response_model=List[LeaderboardUser])
async def get_leaderboard():
    return LEADERBOARD_DATA


@router.get("/recruiter/assessments", response_model=List[RecruiterAssessment])
async def get_assessments():
    return ASSESSMENTS_DATA
