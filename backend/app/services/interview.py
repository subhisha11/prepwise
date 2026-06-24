from app.services.mentor import mentor_service


QUESTIONS = {
    "technical": [
        "Tell me about a technically challenging project and the trade-offs you made.",
        "How would you design a URL shortener that handles millions of requests?",
        "Explain the difference between a process and a thread.",
        "How do database indexes improve reads, and what do they cost?",
    ],
    "behavioral": [
        "Tell me about a time you disagreed with a teammate.",
        "Describe a failure that changed how you work.",
        "When have you taken ownership beyond your assigned task?",
        "How do you prioritize when everything feels urgent?",
    ],
    "hr": [
        "Walk me through your background.",
        "Why are you interested in this role and our company?",
        "What kind of team environment helps you do your best work?",
        "Where do you want to grow over the next two years?",
    ],
}


async def interview_reply(mode: str, answer: str, turn: int) -> str:
    questions = QUESTIONS.get(mode, QUESTIONS["technical"])
    next_question = questions[min(turn, len(questions) - 1)]
    fallback = (
        "Good direction. You made the core idea clear; strengthen it with one concrete "
        f"example or measurable result. Next question: {next_question}"
    )
    return await mentor_service.text_completion(
        f"You are a warm but rigorous {mode} interviewer. Briefly evaluate the answer in 1-2 sentences, then ask exactly one next question.",
        f"Candidate answer: {answer}\nNext question theme: {next_question}",
        fallback,
    )


async def score_interview(mode: str, transcript: list[dict]) -> dict:
    answer_words = sum(
        len(item.get("content", "").split()) for item in transcript if item.get("role") == "candidate"
    )
    score = min(92, max(48, 55 + answer_words // 8))
    fallback = {
        "score": score,
        "feedback": [
            "Use a clearer situation-action-result structure.",
            "Add specific metrics or technical trade-offs to strengthen credibility.",
            "End answers with what you learned or would improve next time.",
        ],
    }
    return await mentor_service.json_completion(
        "Score this mock interview from 0-100. Return JSON with score and exactly 3 feedback strings.",
        f"Mode: {mode}\nTranscript: {transcript}",
        fallback,
    )

