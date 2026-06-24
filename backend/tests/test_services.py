from app.services.coding import run_submission
from app.services.resume import extract_pdf_text


def test_coding_runner_accepts_correct_solution():
    code = "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target-n in seen: return [seen[target-n], i]\n        seen[n] = i"
    result = run_submission(code, [{"input": [[2, 7], 9], "expected": [0, 1]}], "two_sum")
    assert result["status"] == "Accepted"


def test_coding_runner_blocks_dangerous_import():
    result = run_submission("import os\ndef solve(): pass", [], "solve")
    assert result["status"] == "Error"

