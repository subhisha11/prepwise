import re
from io import BytesIO
from pypdf import PdfReader
from app.services.mentor import KNOWN_SKILLS, mentor_service, required_skills


def extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


async def analyze_resume(text: str, target_role: str) -> dict:
    lower = text.lower()
    found = [skill for skill in KNOWN_SKILLS if skill.lower() in lower]
    desired = required_skills(target_role)
    missing = [skill for skill in desired if skill.lower() not in lower]
    has_metrics = bool(re.search(r"\b\d+(?:\.\d+)?(?:%|\+|x| ms| users| projects?)\b", lower))
    sections = sum(
        1 for section in ["education", "experience", "projects", "skills", "achievement"]
        if section in lower
    )
    ats_score = min(96, 42 + min(len(found) * 4, 28) + sections * 4 + (8 if has_metrics else 0))
    fallback = {
        "ats_score": ats_score,
        "skills_found": found[:15],
        "missing_skills": missing[:8],
        "strengths": [
            "Clear technical foundation aligned with the target role",
            "Projects demonstrate practical application of core skills",
            "Resume structure is readable and ATS-friendly",
        ],
        "weaknesses": [
            "Project bullets need more measurable outcomes" if not has_metrics else "Some bullets can be more concise",
            "Target-role keywords are underrepresented" if missing else "Leadership evidence could be stronger",
        ],
        "suggestions": [
            "Lead each project bullet with a strong action verb and quantify the result.",
            f"Add evidence for {', '.join(missing[:3])} through coursework or projects." if missing else "Add one achievement showing scale or ownership.",
            "Keep the resume to one page and tailor the summary to each job description.",
        ],
    }
    return await mentor_service.json_completion(
        "You are an expert technical recruiter. Return strict JSON with ats_score, skills_found, missing_skills, strengths, weaknesses, suggestions.",
        f"Analyze this resume for a {target_role} role. Resume:\n{text[:12000]}",
        fallback,
    )

