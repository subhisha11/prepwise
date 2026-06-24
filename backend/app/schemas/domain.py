from pydantic import BaseModel, Field


class RoadmapRequest(BaseModel):
    target_role: str = Field(min_length=2, max_length=120)
    timeline_weeks: int = Field(ge=4, le=24)
    daily_hours: float = Field(ge=0.5, le=8)


class SubmissionRequest(BaseModel):
    question_id: str
    code: str = Field(min_length=1, max_length=20000)
    language: str = "python"


class SkillGapRequest(BaseModel):
    target_role: str | None = None


class MentorRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)

