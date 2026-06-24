import uuid
from sqlalchemy import Boolean, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


def uuid_str() -> str:
    return str(uuid.uuid4())


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="student")
    target_role: Mapped[str] = mapped_column(String(120), default="Software Engineer")
    placement_weeks: Mapped[int] = mapped_column(Integer, default=12)
    daily_hours: Mapped[float] = mapped_column(Float, default=2.0)
    skills: Mapped[list] = mapped_column(JSON, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    resumes = relationship("ResumeAnalysis", back_populates="user")
    roadmaps = relationship("Roadmap", back_populates="user")
    submissions = relationship("CodingSubmission", back_populates="user")
    interviews = relationship("InterviewSession", back_populates="user")


class ResumeAnalysis(Base, TimestampMixin):
    __tablename__ = "resume_analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    filename: Mapped[str] = mapped_column(String(255))
    raw_text: Mapped[str] = mapped_column(Text)
    ats_score: Mapped[int] = mapped_column(Integer)
    skills_found: Mapped[list] = mapped_column(JSON, default=list)
    missing_skills: Mapped[list] = mapped_column(JSON, default=list)
    strengths: Mapped[list] = mapped_column(JSON, default=list)
    weaknesses: Mapped[list] = mapped_column(JSON, default=list)
    suggestions: Mapped[list] = mapped_column(JSON, default=list)
    user = relationship("User", back_populates="resumes")


class Roadmap(Base, TimestampMixin):
    __tablename__ = "roadmaps"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    target_role: Mapped[str] = mapped_column(String(120))
    timeline_weeks: Mapped[int] = mapped_column(Integer)
    daily_hours: Mapped[float] = mapped_column(Float)
    plan: Mapped[list] = mapped_column(JSON, default=list)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    user = relationship("User", back_populates="roadmaps")


class CodingQuestion(Base, TimestampMixin):
    __tablename__ = "coding_questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(160))
    difficulty: Mapped[str] = mapped_column(String(30))
    topic: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text)
    examples: Mapped[list] = mapped_column(JSON, default=list)
    constraints: Mapped[list] = mapped_column(JSON, default=list)
    starter_code: Mapped[str] = mapped_column(Text)
    test_cases: Mapped[list] = mapped_column(JSON, default=list)


class CodingSubmission(Base, TimestampMixin):
    __tablename__ = "coding_submissions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    question_id: Mapped[str] = mapped_column(ForeignKey("coding_questions.id"))
    code: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(30), default="python")
    status: Mapped[str] = mapped_column(String(40))
    passed: Mapped[int] = mapped_column(Integer, default=0)
    total: Mapped[int] = mapped_column(Integer, default=0)
    runtime_ms: Mapped[int] = mapped_column(Integer, default=0)
    feedback: Mapped[str] = mapped_column(Text, default="")
    user = relationship("User", back_populates="submissions")


class InterviewSession(Base, TimestampMixin):
    __tablename__ = "interview_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    mode: Mapped[str] = mapped_column(String(40))
    transcript: Mapped[list] = mapped_column(JSON, default=list)
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    feedback: Mapped[list] = mapped_column(JSON, default=list)
    user = relationship("User", back_populates="interviews")

