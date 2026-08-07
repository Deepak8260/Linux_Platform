import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()


def get_engine():
    db_url = settings.DATABASE_URL
    try:
        if "mysql" in db_url:
            # Create engine for MySQL
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=3600,
                pool_size=10,
                max_overflow=20
            )
            # Test MySQL connection
            with engine.connect() as conn:
                pass
            logger.info("Successfully connected to MySQL Database.")
            return engine
        else:
            engine = create_engine(db_url, connect_args={"check_same_thread": False})
            return engine
    except Exception as e:
        logger.warning(f"Could not connect to MySQL Database ({e}). Falling back to local SQLite database.")
        fallback_url = "sqlite:///./linux_arena_dev.db"
        return create_engine(fallback_url, connect_args={"check_same_thread": False})


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI Dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
