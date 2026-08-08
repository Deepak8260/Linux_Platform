import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "LinuxArena"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "linux-arena-super-secret-jwt-key-2026-production-ready")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Session / Container Settings
    SESSION_TTL_SECONDS: int = 1800  # 30 minutes
    MAX_CONCURRENT_CONTAINERS: int = 10
    CONTAINER_IMAGE: str = "ubuntu:24.04"
    CONTAINER_MEM_LIMIT: str = "256m"
    CONTAINER_NCPU: float = 0.5

    # Optional override for the Docker daemon endpoint used by `docker.from_env()`.
    # Leave blank to use docker-py's platform default (unix:///var/run/docker.sock on
    # Linux/macOS, npipe:////./pipe/docker_engine on native Windows). Set this if your
    # Docker Desktop is configured differently, e.g.:
    #   Windows named pipe (default Docker Desktop):  npipe:////./pipe/docker_engine
    #   Docker Desktop "Expose daemon on tcp://localhost:2375 without TLS":  tcp://localhost:2375
    DOCKER_HOST: str = os.getenv("DOCKER_HOST", "")

    # AI Mentor Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # MySQL Database Config
    MYSQL_SERVER: str = os.getenv("MYSQL_SERVER", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "root")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "linuxarena_db")

    # Full Database URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"mysql+pymysql://{os.getenv('MYSQL_USER', 'root')}:{os.getenv('MYSQL_PASSWORD', 'root')}@{os.getenv('MYSQL_SERVER', 'localhost')}:{os.getenv('MYSQL_PORT', '3306')}/{os.getenv('MYSQL_DB', 'linuxarena_db')}"
    )

    # OAuth Settings (Google & GitHub)
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "mock-google-client-id")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "mock-google-client-secret")

    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "mock-github-client-id")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "mock-github-client-secret")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
