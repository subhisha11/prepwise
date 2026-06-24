from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models import User

bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign in required",
        )

    try:
        payload = decode_access_token(credentials.credentials)

        print("=" * 50)
        print("PAYLOAD:", payload)
        print("SUB:", payload.get("sub"))
        print("SUB TYPE:", type(payload.get("sub")))
        print("=" * 50)

        user = await db.get(User, payload["sub"])

        print("=" * 50)
        print("USER FOUND:", user)
        print("=" * 50)

    except Exception as e:
        print("=" * 50)
        print("AUTH ERROR:", str(e))
        print("=" * 50)
        user = None

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
        )

    return user


def require_role(*roles: str):
    async def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )
        return user

    return checker