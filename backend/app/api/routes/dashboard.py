from distro import name
from fastapi import APIRouter, Depends
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.agents import run_mentor_workflow
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import CodingSubmission, InterviewSession, ResumeAnalysis, Roadmap, User


router = APIRouter(tags=["dashboard"])


@router.get("/dashboard")
async def dashboard(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    resume = await db.scalar(
        select(ResumeAnalysis).where(ResumeAnalysis.user_id == user.id).order_by(desc(ResumeAnalysis.created_at))
    )
    roadmap = await db.scalar(
        select(Roadmap).where(Roadmap.user_id == user.id).order_by(desc(Roadmap.created_at))
    )
    coding = (
        await db.execute(select(CodingSubmission).where(CodingSubmission.user_id == user.id))
    ).scalars().all()
    interview = await db.scalar(
        select(InterviewSession).where(InterviewSession.user_id == user.id, InterviewSession.score.is_not(None)).order_by(desc(InterviewSession.created_at))
    )
    accuracy = round(sum(s.passed for s in coding) / max(1, sum(s.total for s in coding)) * 100)
    workflow = await run_mentor_workflow({
        "target_role": user.target_role,
        "resume_skills": resume.skills_found if resume else user.skills,
        "coding_accuracy": accuracy or 62,
        "interview_score": interview.score if interview and interview.score else 68,
    })
    return {
        "user": {
            "name": "Guest User",
            "target_role": "Student"
        },
        "metrics": {
            "ats_score": resume.ats_score if resume else 78,
            "readiness_score": workflow["readiness_score"],
            "coding_accuracy": accuracy or 62,
            "interview_score": interview.score if interview and interview.score else 68,
            "roadmap_progress": roadmap.progress if roadmap else 36,
        },
        "skill_gaps": workflow["skill_gaps"][:5],
        "recommendations": workflow["recommendations"],
        "weekly_goals": [
            {"label": "Solve 8 DSA problems", "progress": 5, "total": 8},
            {"label": "Complete DBMS revision", "progress": 3, "total": 5},
            {"label": "Practice mock interview", "progress": 1, "total": 2},
        ],
        "activity": [
            {"day": day, "coding": coding_score, "learning": learning}
            for day, coding_score, learning in [
                ("Mon", 42, 30), ("Tue", 55, 48), ("Wed", 48, 62),
                ("Thu", 72, 54), ("Fri", 64, 76), ("Sat", 82, 68), ("Sun", 74, 84),
            ]
        ],
    }


@router.get("/skill-gaps")
async def skill_gaps(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    resume = await db.scalar(
        select(ResumeAnalysis).where(ResumeAnalysis.user_id == user.id).order_by(desc(ResumeAnalysis.created_at))
    )
    workflow = await run_mentor_workflow({
        "target_role": user.target_role,
        "resume_skills": resume.skills_found if resume else user.skills,
        "coding_accuracy": 62,
        "interview_score": 68,
    })
    resources = ["Build a guided mini-project", "Complete focused concept notes", "Practice 10 interview questions"]
    return {
        "target_role": user.target_role,
        "gaps": [
            {
                "skill": skill,
                "priority": "High" if index < 2 else "Medium",
                "estimated_weeks": 2 + index,
                "recommendation": resources[index % len(resources)],
            }
            for index, skill in enumerate(workflow["skill_gaps"][:6])
        ],
    }

