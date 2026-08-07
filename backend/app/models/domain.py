import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    xp = Column(Integer, default=100)
    streak = Column(Integer, default=1)
    level = Column(String(50), default="Linux Novice")
    badges = Column(JSON, default=list)
    completed_labs = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class LabModel(Base):
    __tablename__ = "labs"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)
    difficulty = Column(String(30), nullable=False)
    xp_reward = Column(Integer, default=100)
    description = Column(Text, nullable=True)

    steps = relationship("LabStepModel", back_populates="lab", cascade="all, delete-orphan")


class LabStepModel(Base):
    __tablename__ = "lab_steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    lab_id = Column(String(50), ForeignKey("labs.id"), nullable=False)
    step_number = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    instructions = Column(Text, nullable=False)
    hint = Column(Text, nullable=True)
    validation_cmd = Column(Text, nullable=True)

    lab = relationship("LabModel", back_populates="steps")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    lab_id = Column(String(50), nullable=False)
    step_number = Column(Integer, nullable=False)
    completed = Column(Boolean, default=True)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)


class ContainerSessionRecord(Base):
    __tablename__ = "container_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(String(50), nullable=False)
    is_mock = Column(Boolean, default=False)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
