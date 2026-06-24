from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, coding, dashboard, interview, resume, roadmap
from app.core.config import settings
from app.core.database import SessionLocal, init_db
from app.seed import seed_data


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_db()
    async with SessionLocal() as db:
        await seed_data(db)
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Adaptive AI placement mentoring API",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://prepwise-seven-sand.vercel.app",
        "https://prepwise-git-main-subhishachintadas-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for route in [auth.router, dashboard.router, resume.router, roadmap.router, coding.router, interview.router]:
    app.include_router(route, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["system"])
async def health():
    return {"status": "healthy", "service": settings.app_name}

