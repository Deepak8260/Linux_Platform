import asyncio
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base
from app.api.auth import router as auth_router
from app.api.sessions import router as sessions_router
from app.api.labs import router as labs_router
from app.api.ai import router as ai_router
from app.api.platform import router as platform_router
from app.websocket.terminal import router as ws_router
from app.docker.manager import docker_manager

# Ensure app-level loggers (app.ai.mentor, app.docker.manager, etc.) actually emit
# INFO/WARNING/ERROR output to the console. Without this, the root logger stays at
# its default WARNING level with no handler attached, so logger.info(...) calls are
# silently dropped and diagnosing issues (e.g. why the AI Mentor fell back to its
# canned response) is much harder.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="LinuxArena - Production MySQL Backend with Google, GitHub & Manual Auth",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
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
        "database": "MySQL" if "mysql" in settings.DATABASE_URL else "SQLite (Fallback)",
        "auth_methods": ["manual", "google", "github"],
        "active_containers": len(docker_manager.sessions)
    }


@app.on_event("startup")
async def startup_event():
    # Automatically create MySQL tables if they don't exist
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Successfully created/verified MySQL database schemas.")
    except Exception as e:
        logger.warning(f"Could not auto-create database tables on startup: {e}")

    # Periodic background task to clean expired 30-min container sessions
    async def session_cleaner():
        while True:
            await asyncio.sleep(30)
            await docker_manager.clean_expired_sessions()

    asyncio.create_task(session_cleaner())
