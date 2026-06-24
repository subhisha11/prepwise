from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models import ResumeAnalysis, User
from app.services.resume import analyze_resume, extract_pdf_text


router = APIRouter(prefix="/resume", tags=["resume intelligence"])


@router.post("/analyze")
async def upload_resume(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Please upload a PDF resume")
    content = await file.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"Resume must be under {settings.max_upload_mb} MB")
    try:
        text = extract_pdf_text(content)
    except Exception as exc:
        raise HTTPException(status_code=422, detail="The PDF could not be read") from exc
    if len(text.strip()) < 80:
        raise HTTPException(status_code=422, detail="The resume does not contain enough selectable text")
    result = await analyze_resume(text, user.target_role)
    analysis = ResumeAnalysis(
        user_id=user.id,
        filename=file.filename or "resume.pdf",
        raw_text=text,
        **result,
    )
    user.skills = result["skills_found"]
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)
    return serialize(analysis)


@router.get("/latest")
async def latest_resume(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    analysis = await db.scalar(
        select(ResumeAnalysis).where(ResumeAnalysis.user_id == user.id).order_by(desc(ResumeAnalysis.created_at))
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="No resume analysis yet")
    return serialize(analysis)


def serialize(item: ResumeAnalysis) -> dict:
    return {
        "id": item.id,
        "filename": item.filename,
        "ats_score": item.ats_score,
        "skills_found": item.skills_found,
        "missing_skills": item.missing_skills,
        "strengths": item.strengths,
        "weaknesses": item.weaknesses,
        "suggestions": item.suggestions,
    }

