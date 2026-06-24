from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import Roadmap, User
from app.schemas.domain import RoadmapRequest
from app.services.roadmap import build_roadmap


router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


@router.post("")
async def create_roadmap(
    payload: RoadmapRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    plan = await build_roadmap(payload.target_role, payload.timeline_weeks, payload.daily_hours, user.skills)
    roadmap = Roadmap(
        user_id=user.id,
        target_role=payload.target_role,
        timeline_weeks=payload.timeline_weeks,
        daily_hours=payload.daily_hours,
        plan=plan,
    )
    user.target_role = payload.target_role
    user.placement_weeks = payload.timeline_weeks
    user.daily_hours = payload.daily_hours
    db.add(roadmap)
    await db.commit()
    await db.refresh(roadmap)
    return serialize(roadmap)


@router.get("/latest")
async def latest_roadmap(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    roadmap = await db.scalar(
        select(Roadmap).where(Roadmap.user_id == user.id).order_by(desc(Roadmap.created_at))
    )
    if not roadmap:
        raise HTTPException(status_code=404, detail="No roadmap yet")
    return serialize(roadmap)


def serialize(item: Roadmap) -> dict:
    return {
        "id": item.id, "target_role": item.target_role, "timeline_weeks": item.timeline_weeks,
        "daily_hours": item.daily_hours, "progress": item.progress, "plan": item.plan,
    }

