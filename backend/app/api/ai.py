from fastapi import APIRouter
from app.models.schemas import AIAskRequest, AIAskResponse, ValidateCommandRequest
from app.ai.mentor import ai_mentor, validator

router = APIRouter(prefix="/ai", tags=["AI Mentor"])


@router.post("/ask", response_model=AIAskResponse)
async def ask_mentor(req: AIAskRequest):
    res = await ai_mentor.generate_response(req.prompt, req.context or "")
    return AIAskResponse(
        answer=res["answer"],
        suggested_commands=res["suggested_commands"],
        source=res["source"]
    )


@router.post("/validate")
async def validate_command(req: ValidateCommandRequest):
    res = validator.validate_command(req.command)
    return res
