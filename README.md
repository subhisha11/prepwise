# PrepWise — AI Placement Mentor

PrepWise is a full-stack placement preparation platform that turns resume analysis, coding performance, interview practice, and skill gaps into one adaptive weekly plan.

## What is included

- Next.js 15 frontend with TypeScript, Tailwind CSS, React Query, Recharts, and reusable UI components
- FastAPI backend with async SQLAlchemy, JWT authentication, role checks, and OpenAPI docs
- PostgreSQL-ready schema (SQLite works out of the box for local demos)
- Resume PDF extraction, ATS scoring, skill extraction, and personalized feedback
- LangGraph-based mentoring workflow with an OpenAI-compatible provider and a no-key demo fallback
- Coding question bank, test-case execution, submissions, and performance tracking
- Real-time mock interviews over WebSockets
- Personalized roadmaps, skill-gap analysis, dashboard metrics, and recommendations
- Docker Compose for local production-like development

## Quick start

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```powershell
cd frontend
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

App: http://localhost:3000

Create an account or use the demo login:

- Email: `demo@prepwise.ai`
- Password: `Demo@123`

## AI configuration

The app is fully usable without an AI key. To enable live model responses, set these backend variables:

```env
AI_API_KEY=your_key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

Groq also works because the client uses the OpenAI-compatible API:

```env
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
```

## Docker

```powershell
Copy-Item .env.example .env
docker compose up --build
```

The frontend runs on port 3000, backend on 8000, and PostgreSQL on 5432.

## Project structure

```text
prepwise/
├── frontend/                 Next.js application
├── backend/                  FastAPI application
│   ├── app/
│   │   ├── agents/           LangGraph mentor workflow
│   │   ├── api/routes/       REST and WebSocket routes
│   │   ├── core/             Settings, security, database
│   │   ├── models/           SQLAlchemy schema
│   │   ├── schemas/          Pydantic contracts
│   │   └── services/         Domain and AI services
│   └── tests/
├── docker-compose.yml
└── .env.example
```

## Deployment

### Supabase

1. Create a Supabase project.
2. Copy the transaction-pooler PostgreSQL URL.
3. Change the scheme to `postgresql+asyncpg://`.
4. Set it as `DATABASE_URL` on Render.

### Render backend

- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/health`
- Set `SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS`, and optional AI variables.

### Vercel frontend

- Root directory: `frontend`
- Set `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com`
- Set `NEXT_PUBLIC_WS_URL=wss://your-render-service.onrender.com`

## Safety notes

The coding runner currently executes a constrained Python subset with a timeout. For public, multi-tenant deployment, replace it with a dedicated sandbox such as Judge0, Piston, or isolated Firecracker workers. Resume uploads are size/type checked; production storage should use private object storage with malware scanning.

