import math
from app.services.mentor import mentor_service, required_skills


async def build_roadmap(
    target_role: str, weeks: int, daily_hours: float, current_skills: list[str]
) -> list[dict]:
    foundations = ["DSA", "DBMS", "Operating Systems", "Computer Networks", "Aptitude"]
    role_topics = required_skills(target_role)
    topics = list(dict.fromkeys(foundations + role_topics + ["Projects", "Mock Interviews"]))
    plan = []
    for week in range(1, weeks + 1):
        topic = topics[(week - 1) % len(topics)]
        phase = "Foundation" if week <= math.ceil(weeks * .35) else (
            "Build & practice" if week <= math.ceil(weeks * .75) else "Interview sprint"
        )
        plan.append({
            "week": week,
            "phase": phase,
            "focus": topic,
            "hours": round(daily_hours * 6),
            "tasks": [
                f"Learn and revise core {topic} concepts",
                f"Complete {max(3, round(daily_hours * 3))} targeted practice exercises",
                "Write a short weekly retrospective and update weak areas",
            ],
            "completed": False,
        })
    fallback = {"plan": plan}
    result = await mentor_service.json_completion(
        "You are a placement mentor. Return JSON with a plan array. Every item must include week, phase, focus, hours, tasks (3 strings), completed false.",
        f"Create a {weeks}-week roadmap for {target_role}, {daily_hours} hours/day. Current skills: {current_skills}. Cover DSA, DBMS, OS, CN, aptitude, projects and interviews.",
        fallback,
    )
    return result.get("plan", plan)

