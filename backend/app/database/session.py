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


def ensure_columns_exist():
    """Automatically adds missing columns to MySQL users table if schema changed."""
    try:
        connection = pymysql.connect(
            host=settings.MYSQL_SERVER,
            port=settings.MYSQL_PORT,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWORD,
            database=settings.MYSQL_DB
        )
        with connection.cursor() as cursor:
            columns = [
                ("student_id", "VARCHAR(50)"),
                ("username", "VARCHAR(100)"),
                ("phone", "VARCHAR(30)"),
                ("enrolled_course", "VARCHAR(100)"),
                ("batch", "VARCHAR(100)"),
                ("avatar_url", "LONGTEXT"),
                ("is_admin", "BOOLEAN DEFAULT 0"),
            ]
            for col_name, col_type in columns:
                try:
                    cursor.execute(f"ALTER TABLE users ADD COLUMN `{col_name}` {col_type};")
                except Exception:
                    pass

            # Whichever account uses the platform owner's identifier always gets
            # admin rights, even if the row already existed before this feature.
            try:
                cursor.execute(
                    "UPDATE users SET is_admin = 1 WHERE email = %s OR username = %s",
                    ("kd8260@gmail.com", "kd8260"),
                )
            except Exception:
                pass
        connection.commit()
        connection.close()
    except Exception as e:
        logger.warning(f"Auto-migration check notice: {e}")


def ensure_sqlite_columns_exist(engine):
    """Mirrors ensure_columns_exist() for the local SQLite fallback database,
    so the is_admin column/flag is present there too."""
    try:
        with engine.connect() as conn:
            existing_cols = {row[1] for row in conn.exec_driver_sql("PRAGMA table_info(users);")}
            if "is_admin" not in existing_cols:
                conn.exec_driver_sql("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0;")
            conn.exec_driver_sql(
                "UPDATE users SET is_admin = 1 WHERE email = 'kd8260@gmail.com' OR username = 'kd8260';"
            )
            conn.commit()
    except Exception as e:
        logger.warning(f"SQLite auto-migration check notice: {e}")


def get_engine():
    db_url = settings.DATABASE_URL
    if "mysql" in db_url:
        db_created = ensure_mysql_database_exists()
        if db_created:
            ensure_columns_exist()
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
    sqlite_engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
    ensure_sqlite_columns_exist(sqlite_engine)
    return sqlite_engine


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI Dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
