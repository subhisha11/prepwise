import ast
import multiprocessing as mp
import time
from typing import Any


BLOCKED_NAMES = {"eval", "exec", "compile", "open", "__import__", "input"}
BLOCKED_MODULES = {"os", "sys", "subprocess", "socket", "pathlib", "shutil"}


def validate_code(code: str) -> None:
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            modules = [alias.name.split(".")[0] for alias in node.names] if isinstance(node, ast.Import) else [(node.module or "").split(".")[0]]
            if any(module in BLOCKED_MODULES for module in modules):
                raise ValueError("This import is not allowed in the demo runner.")
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in BLOCKED_NAMES:
            raise ValueError(f"{node.func.id} is not allowed in the demo runner.")


def _execute(code: str, function_name: str, cases: list[dict], queue: mp.Queue) -> None:
    safe_builtins = {
        "len": len, "range": range, "enumerate": enumerate, "zip": zip, "sum": sum,
        "min": min, "max": max, "sorted": sorted, "set": set, "list": list,
        "dict": dict, "tuple": tuple, "str": str, "int": int, "float": float,
        "bool": bool, "abs": abs, "all": all, "any": any,
    }
    namespace: dict[str, Any] = {"__builtins__": safe_builtins}
    try:
        exec(code, namespace, namespace)
        function = namespace.get(function_name)
        if not callable(function):
            raise ValueError(f"Define a function named {function_name}.")
        results = []
        for case in cases:
            actual = function(*case["input"])
            results.append({"passed": actual == case["expected"], "actual": actual})
        queue.put({"results": results})
    except Exception as exc:
        queue.put({"error": str(exc)})


def run_submission(code: str, test_cases: list[dict], function_name: str) -> dict:
    try:
        validate_code(code)
    except (SyntaxError, ValueError) as exc:
        return {"status": "Error", "passed": 0, "total": len(test_cases), "runtime_ms": 0, "feedback": str(exc)}
    queue: mp.Queue = mp.Queue()
    start = time.perf_counter()
    process = mp.Process(target=_execute, args=(code, function_name, test_cases, queue))
    process.start()
    process.join(3)
    runtime = int((time.perf_counter() - start) * 1000)
    if process.is_alive():
        process.terminate()
        return {"status": "Time Limit Exceeded", "passed": 0, "total": len(test_cases), "runtime_ms": runtime, "feedback": "Execution exceeded 3 seconds."}
    result = queue.get() if not queue.empty() else {"error": "Runner exited unexpectedly."}
    if "error" in result:
        return {"status": "Error", "passed": 0, "total": len(test_cases), "runtime_ms": runtime, "feedback": result["error"]}
    passed = sum(1 for item in result["results"] if item["passed"])
    return {
        "status": "Accepted" if passed == len(test_cases) else "Wrong Answer",
        "passed": passed,
        "total": len(test_cases),
        "runtime_ms": runtime,
        "feedback": "Excellent—your solution passes every test." if passed == len(test_cases) else "Review edge cases and trace the failing inputs.",
    }

