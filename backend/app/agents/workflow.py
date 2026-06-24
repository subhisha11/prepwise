from typing import TypedDict
from langgraph.graph import END, StateGraph
from app.services.mentor import required_skills


class MentorState(TypedDict, total=False):
    target_role: str
    resume_skills: list[str]
    coding_accuracy: float
    interview_score: float
    skill_gaps: list[str]
    readiness_score: int
    recommendations: list[str]


def skill_gap_agent(state: MentorState) -> MentorState:
    known = {skill.lower() for skill in state.get("resume_skills", [])}
    gaps = [skill for skill in required_skills(state.get("target_role", "Software Engineer")) if skill.lower() not in known]
    return {"skill_gaps": gaps}


def readiness_agent(state: MentorState) -> MentorState:
    resume_component = min(100, 45 + len(state.get("resume_skills", [])) * 5)
    score = round(
        resume_component * .3
        + state.get("coding_accuracy", 0) * .4
        + state.get("interview_score", 0) * .3
    )
    return {"readiness_score": score}


def recommendation_agent(state: MentorState) -> MentorState:
    gaps = state.get("skill_gaps", [])
    recommendations = [
        f"Build a small project that demonstrates {gap}." for gap in gaps[:2]
    ]
    if state.get("coding_accuracy", 0) < 70:
        recommendations.append("Complete one timed DSA problem daily and review failed patterns.")
    if state.get("interview_score", 0) < 70:
        recommendations.append("Practice two STAR-format answers before your next mock interview.")
    return {"recommendations": recommendations[:4]}


graph = StateGraph(MentorState)
graph.add_node("skill_gap_agent", skill_gap_agent)
graph.add_node("readiness_agent", readiness_agent)
graph.add_node("recommendation_agent", recommendation_agent)
graph.set_entry_point("skill_gap_agent")
graph.add_edge("skill_gap_agent", "readiness_agent")
graph.add_edge("readiness_agent", "recommendation_agent")
graph.add_edge("recommendation_agent", END)
mentor_graph = graph.compile()


async def run_mentor_workflow(state: MentorState) -> MentorState:
    return await mentor_graph.ainvoke(state)

