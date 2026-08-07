import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.sessions import router as sessions_router
from app.api.labs import router as labs_router
from app.api.ai import router as ai_router
from app.api.platform import router as platform_router
from app.websocket.terminal import router as ws_router
from app.docker.manager import docker_manager

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="LinuxArena - Live Ubuntu Sandbox Practice & Assessment Platform",
    version="1.0.0"
)

# CORS middleware for local dev & vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(sessions_router, prefix=settings.API_V1_STR)
app.include_router(labs_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(platform_router, prefix=settings.API_V1_STR)
app.include_router(ws_router)


@app.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "container_ttl_seconds": settings.SESSION_TTL_SECONDS,
        "max_concurrent_containers": settings.MAX_CONCURRENT_CONTAINERS,
        "active_containers": len(docker_manager.sessions)
    }


@app.on_event("startup")
async def startup_event():
    # Background periodic task to prune expired container sessions
    async def session_cleaner():
        while True:
            await asyncio.sleep(30)
            await docker_manager.clean_expired_sessions()

    asyncio.create_task(session_cleaner())
