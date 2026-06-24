from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import CodingQuestion, CodingSubmission, User
from app.schemas.domain import SubmissionRequest
from app.services.coding import run_submission


router = APIRouter(prefix="/coding", tags=["coding arena"])


@router.get("/questions")
async def questions(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    items = (await db.execute(select(CodingQuestion))).scalars().all()
    return [serialize_question(item) for item in items]


@router.get("/questions/{slug}")
async def question(slug: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    item = await db.scalar(select(CodingQuestion).where(CodingQuestion.slug == slug))
    if not item:
        raise HTTPException(status_code=404, detail="Question not found")
    return serialize_question(item)


@router.post("/submit")
async def submit(
    payload: SubmissionRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = await db.get(CodingQuestion, payload.question_id)
    if not item:
        raise HTTPException(status_code=404, detail="Question not found")
    if payload.language != "python":
        raise HTTPException(status_code=400, detail="The local runner currently supports Python")
    result = run_submission(payload.code, item.test_cases, item.slug.replace("-", "_"))
    submission = CodingSubmission(
        user_id=user.id, question_id=item.id, code=payload.code,
        language=payload.language, **result,
    )
    db.add(submission)
    await db.commit()
    return result


def serialize_question(item: CodingQuestion) -> dict:
    return {
        "id": item.id, "slug": item.slug, "title": item.title, "difficulty": item.difficulty,
        "topic": item.topic, "description": item.description, "examples": item.examples,
        "constraints": item.constraints, "starter_code": item.starter_code,
        "test_case_count": len(item.test_cases),
    }

