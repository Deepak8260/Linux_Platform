import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "LinuxArena"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "linux-arena-super-secret-jwt-key-2026-change-in-prod"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Session / Container Settings
    SESSION_TTL_SECONDS: int = 1800  # 30 minutes
    MAX_CONCURRENT_CONTAINERS: int = 10
    CONTAINER_IMAGE: str = "ubuntu:24.04"
    CONTAINER_MEM_LIMIT: str = "256m"
    CONTAINER_NCPU: float = 0.5

    # AI Mentor Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Database
    DATABASE_URL: str = "sqlite:///./linux_arena.db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
