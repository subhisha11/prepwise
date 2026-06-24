from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.models import InterviewSession, User
from app.services.interview import QUESTIONS, interview_reply, score_interview


router = APIRouter(prefix="/interviews", tags=["mock interviews"])


@router.post("")
async def create_interview(mode: str = "technical", user: User = Depends(get_current_user)):
    async with SessionLocal() as db:
        session = InterviewSession(
            user_id=user.id,
            mode=mode,
            transcript=[{"role": "interviewer", "content": QUESTIONS.get(mode, QUESTIONS["technical"])[0]}],
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return {"id": session.id, "mode": mode, "first_question": session.transcript[0]["content"]}


@router.websocket("/ws/{session_id}")
async def interview_socket(websocket: WebSocket, session_id: str, token: str):
    try:
        payload = decode_access_token(token)
    except ValueError:
        await websocket.close(code=4401)
        return
    await websocket.accept()
    async with SessionLocal() as db:
        session = await db.get(InterviewSession, session_id)
        if not session or session.user_id != payload.get("sub"):
            await websocket.close(code=4404)
            return
        try:
            while True:
                data = await websocket.receive_json()
                if data.get("type") == "end":
                    result = await score_interview(session.mode, session.transcript)
                    session.score = result["score"]
                    session.feedback = result["feedback"]
                    await db.commit()
                    await websocket.send_json({"type": "complete", **result})
                    break
                answer = str(data.get("message", "")).strip()
                if not answer:
                    continue
                transcript = list(session.transcript)
                transcript.append({"role": "candidate", "content": answer})
                turn = sum(1 for item in transcript if item["role"] == "candidate")
                reply = await interview_reply(session.mode, answer, turn)
                transcript.append({"role": "interviewer", "content": reply})
                session.transcript = transcript
                await db.commit()
                await websocket.send_json({"type": "message", "message": reply})
        except WebSocketDisconnect:
            await db.commit()

