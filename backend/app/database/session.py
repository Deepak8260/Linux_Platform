import logging
import pymysql
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()


def ensure_mysql_database_exists():
    """Connects to MySQL server and automatically creates database if missing."""
    try:
        connection = pymysql.connect(
            host=settings.MYSQL_SERVER,
            port=settings.MYSQL_PORT,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
        )
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{settings.MYSQL_DB}` CHARACTER SET utf8mb4;")
        connection.commit()
        connection.close()
        logger.info(f"Verified/Created MySQL database: {settings.MYSQL_DB}")
        return True
    except Exception as e:
        logger.error(f"MySQL connection attempt failed: {e}")
        return False


def get_engine():
    db_url = settings.DATABASE_URL
    if "mysql" in db_url:
        db_created = ensure_mysql_database_exists()
        if db_created:
            try:
                engine = create_engine(
                    db_url,
                    pool_pre_ping=True,
                    pool_recycle=3600,
                    pool_size=10,
                    max_overflow=20
                )
                with engine.connect() as conn:
                    pass
                print("==================================================")
                print(" SUCCESS: Connected to MySQL Database successfully!")
                print("==================================================")
                return engine
            except Exception as e:
                logger.error(f"SQLAlchemy MySQL Engine Error: {e}")

    logger.warning("Could not connect to MySQL. Falling back to local SQLite database.")
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
