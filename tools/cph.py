#!/usr/bin/env python3
"""Read CPH-NG's gzip-JSON problem cache.

Usage:
    python3 /path/to/dsh-oi-selfguide/tools/cph.py [P1002]

Without an argument, the most recently modified cache file is used.
Problem caches live at <current directory>/<problem-id>/<problem-id>.cpp.bin,
so run this from the OI workspace (the script itself may live anywhere).
The script only reads; it never writes anywhere.
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
    return text[:MAX_FIELD] + f"\n… [truncated {len(text) - MAX_FIELD} chars]"


def pick(query: str) -> Path:
    files = sorted(
        ROOT.glob("*/*.cpp.bin"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    if not files:
        sys.exit(f"no problem caches under {ROOT} (expected <id>/<id>.cpp.bin)")
    if query:
        matched = [p for p in files if query.lower() in p.name.lower()]
        if not matched:
            names = ", ".join(p.name for p in files[:5])
            sys.exit(f"no cache matching {query!r}; newest: {names}")
        return matched[0]
    return files[0]


def main() -> None:
    path = pick(sys.argv[1] if len(sys.argv) > 1 else "")
    data = json.loads(gzip.decompress(path.read_bytes()))
    raw_tests = list(data.get("testcases", {}).values())
    tests = [
        {
            "input": clip(t.get("stdin", {}).get("data", "")),
            "answer": clip(t.get("answer", {}).get("data", "")),
        }
        for t in raw_tests[:5]
    ]
    overrides = data.get("overrides") or {}
    print(
        json.dumps(
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
        )
    )


if __name__ == "__main__":
    main()
