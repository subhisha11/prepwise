from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import hash_password
from app.models import CodingQuestion, Roadmap, User


QUESTIONS = [
    {
        "slug": "two_sum",
        "title": "Two Sum",
        "difficulty": "Easy",
        "topic": "Arrays & Hashing",
        "description": "Given an integer array nums and an integer target, return the indices of the two numbers that add up to target.",
        "examples": [{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"}],
        "constraints": ["2 ≤ nums.length ≤ 10⁴", "Exactly one valid answer exists."],
        "starter_code": "def two_sum(nums, target):\n    # Write your solution here\n    pass",
        "test_cases": [
            {"input": [[2, 7, 11, 15], 9], "expected": [0, 1]},
            {"input": [[3, 2, 4], 6], "expected": [1, 2]},
            {"input": [[3, 3], 6], "expected": [0, 1]},
        ],
    },
    {
        "slug": "valid_parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "topic": "Stack",
        "description": "Given a string containing brackets, determine whether every opening bracket is closed in the correct order.",
        "examples": [{"input": "s = '()[]{}'", "output": "True"}],
        "constraints": ["1 ≤ s.length ≤ 10⁴", "s contains only bracket characters."],
        "starter_code": "def valid_parentheses(s):\n    # Write your solution here\n    pass",
        "test_cases": [
            {"input": ["()"], "expected": True},
            {"input": ["()[]{}"], "expected": True},
            {"input": ["(]"], "expected": False},
        ],
    },
    {
        "slug": "max_subarray",
        "title": "Maximum Subarray",
        "difficulty": "Medium",
        "topic": "Dynamic Programming",
        "description": "Find the contiguous subarray with the largest sum and return its sum.",
        "examples": [{"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6"}],
        "constraints": ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
        "starter_code": "def max_subarray(nums):\n    # Write your solution here\n    pass",
        "test_cases": [
            {"input": [[-2,1,-3,4,-1,2,1,-5,4]], "expected": 6},
            {"input": [[1]], "expected": 1},
            {"input": [[5,4,-1,7,8]], "expected": 23},
        ],
    },
]


async def seed_data(db: AsyncSession) -> None:
    if not await db.scalar(select(User).where(User.email == "demo@prepwise.ai")):
        user = User(
            full_name="Aarav Sharma",
            email="demo@prepwise.ai",
            password_hash=hash_password("Demo@123"),
            target_role="Backend Engineer",
            placement_weeks=12,
            daily_hours=2.5,
            skills=["Python", "FastAPI", "SQL", "React", "Git"],
        )
        db.add(user)
        await db.flush()
        db.add(Roadmap(
            user_id=user.id, target_role=user.target_role, timeline_weeks=12,
            daily_hours=2.5, progress=36,
            plan=[
                {"week": i, "phase": "Foundation" if i < 5 else "Build & practice", "focus": focus, "hours": 15,
                 "tasks": [f"Revise {focus} fundamentals", "Complete targeted practice", "Document weekly learning"], "completed": i <= 4}
                for i, focus in enumerate(["Arrays", "Linked Lists", "DBMS", "Operating Systems", "APIs", "Docker", "System Design", "Projects", "Networks", "Aptitude", "Mock Interviews", "Final Revision"], 1)
            ],
        ))
    for question in QUESTIONS:
        if not await db.scalar(select(CodingQuestion).where(CodingQuestion.slug == question["slug"])):
            db.add(CodingQuestion(**question))
    await db.commit()

