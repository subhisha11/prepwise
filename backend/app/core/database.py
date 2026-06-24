from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import settings


engine = create_async_engine(settings.database_url, echo=False)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Sign in required")

    try:
        payload = decode_access_token(credentials.credentials)

        print("TOKEN PAYLOAD:", payload)
        print("SUB:", payload.get("sub"))
        print("SUB TYPE:", type(payload.get("sub")))

        user = await db.get(User, payload["sub"])

        print("USER FOUND:", user)

    except Exception as e:
        print("AUTH ERROR:", str(e))
        user = None

    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid session")

    return user