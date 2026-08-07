import uuid
from fastapi import APIRouter, HTTPException
from app.models.schemas import CreateSessionRequest, SessionInfoResponse
from app.docker.manager import docker_manager

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/create", response_model=SessionInfoResponse)
async def create_session(req: CreateSessionRequest):
    session_id = f"sess_{uuid.uuid4().hex[:12]}"
    try:
        session = await docker_manager.create_session(session_id, user_id=req.user_id or "guest")
        return SessionInfoResponse(
            session_id=session.session_id,
            user_id=session.user_id,
            remaining_seconds=session.remaining_seconds,
            ttl_seconds=session.ttl_seconds,
            is_mock=session.is_mock,
            status="active"
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.get("/{session_id}", response_model=SessionInfoResponse)
async def get_session_info(session_id: str):
    session = docker_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session expired or not found")

    return SessionInfoResponse(
        session_id=session.session_id,
        user_id=session.user_id,
        remaining_seconds=session.remaining_seconds,
        ttl_seconds=session.ttl_seconds,
        is_mock=session.is_mock,
        status="active"
    )


@router.post("/{session_id}/terminate")
async def terminate_session(session_id: str):
    await docker_manager.terminate_session(session_id)
    return {"status": "success", "message": f"Session {session_id} terminated."}
