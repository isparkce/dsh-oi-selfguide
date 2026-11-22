#!/usr/bin/env python3
"""Read a CPH-NG gzip-JSON problem cache.

Usage:
    python3 cph.py [problem-id]

Run from the OI workspace. Cache layout:
    <workspace>/<problem-id>/<problem-id>.cpp.bin
"""
from __future__ import annotations

import gzip
import json
import sys
from pathlib import Path

ROOT = Path.cwd().resolve()
MAX_FIELD = 4000


def clip(text: str) -> str:
    if len(text) <= MAX_FIELD:
        return text
    return text[:MAX_FIELD] + f"\\n… [truncated {len(text) - MAX_FIELD} chars]"


def pick(problem_id: str = "") -> Path:
    files = list(ROOT.glob("*/*.cpp.bin"))

    if problem_id:
        # Both the directory and source basename must match exactly.
        expected_name = f"{problem_id}.cpp.bin"
        matched = [
            path for path in files
            if path.parent.name == problem_id and path.name == expected_name
        ]
        if not matched:
            sys.exit(f"no exact cache for {problem_id!r} under {ROOT}")
        return matched[0]

    if not files:
        sys.exit(f"no problem caches under {ROOT} (expected <id>/<id>.cpp.bin)")
    return max(files, key=lambda path: path.stat().st_mtime)


def main() -> None:
    path = pick(sys.argv[1] if len(sys.argv) > 1 else "")
    data = json.loads(gzip.decompress(path.read_bytes()))

    raw_tests = list((data.get("testcases") or {}).values())
    tests = [
        {
            "input": clip(test.get("stdin", {}).get("data", "")),
            "answer": clip(test.get("answer", {}).get("data", "")),
        }
        for test in raw_tests
    ]

    overrides = data.get("overrides") or {}
    print(json.dumps(
        {
            "file": str(path.relative_to(ROOT)),
            "name": data.get("name"),
            "url": data.get("url"),
            "limits": {
                "time_ms": overrides.get("timeLimitMs"),
                "memory_mb": overrides.get("memoryLimitMb"),
            },
            "test_count": len(raw_tests),
            "tests": tests,
        },
        ensure_ascii=False,
        indent=2,
    ))


if __name__ == "__main__":
    main()
