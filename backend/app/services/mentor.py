import json
from typing import Any
from openai import AsyncOpenAI
from app.core.config import settings


ROLE_SKILLS = {
    "software engineer": ["DSA", "OOP", "DBMS", "OS", "Computer Networks", "Git", "System Design"],
    "backend engineer": ["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "Redis", "System Design"],
    "frontend engineer": ["JavaScript", "TypeScript", "React", "Next.js", "CSS", "Testing", "Web Performance"],
    "data analyst": ["Python", "SQL", "Excel", "Power BI", "Statistics", "Data Visualization"],
    "ml engineer": ["Python", "Machine Learning", "Deep Learning", "SQL", "MLOps", "Docker", "AWS"],
}

KNOWN_SKILLS = sorted({
    skill for skills in ROLE_SKILLS.values() for skill in skills
} | {
    "C++", "Java", "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "MongoDB", "MySQL", "Linux", "Kubernetes", "TensorFlow", "PyTorch", "NLP",
    "Pandas", "NumPy", "Scikit-learn", "REST API", "Microservices", "Communication",
})


class MentorService:
    def __init__(self) -> None:
        self.enabled = bool(settings.ai_api_key)
        self.client = (
            AsyncOpenAI(api_key=settings.ai_api_key, base_url=settings.ai_base_url)
            if self.enabled else None
        )

    async def json_completion(
        self, system: str, prompt: str, fallback: dict[str, Any]
    ) -> dict[str, Any]:
        if not self.client:
            return fallback
        try:
            response = await self.client.chat.completions.create(
                model=settings.ai_model,
                temperature=0.25,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
            )
            return json.loads(response.choices[0].message.content or "{}")
        except Exception:
            return fallback

    async def text_completion(self, system: str, prompt: str, fallback: str) -> str:
        if not self.client:
            return fallback
        try:
            response = await self.client.chat.completions.create(
                model=settings.ai_model,
                temperature=0.55,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
            )
            return response.choices[0].message.content or fallback
        except Exception:
            return fallback


mentor_service = MentorService()


def required_skills(role: str) -> list[str]:
    normalized = role.lower()
    for key, skills in ROLE_SKILLS.items():
        if key in normalized or normalized in key:
            return skills
    return ROLE_SKILLS["software engineer"]

