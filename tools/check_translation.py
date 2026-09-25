"""Check that an English translation keeps the structure of its Russian source.

Usage: python tools/check_translation.py <source.md> <translation.md>

A translation passes when it has the same headings, mermaid blocks, fenced code
blocks and table rows as the source, and is actually English (almost no Cyrillic
left outside code). It does not judge the quality of the prose; it catches the
failures a reviewer skimming the diff would miss: a dropped section, a lost
diagram, a table collapsed into a paragraph, half a file left untranslated.
"""
import re
import sys
from pathlib import Path

CYRILLIC = re.compile(r"[А-Яа-яЁё]")


def strip_code(text: str) -> str:
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return re.sub(r"`[^`\n]*`", "", text)


def shape(text: str) -> dict:
    lines = text.splitlines()
    return {
        "h1": sum(1 for l in lines if l.startswith("# ")),
        "h2": sum(1 for l in lines if l.startswith("## ")),
        "h3": sum(1 for l in lines if l.startswith("### ")),
        "mermaid": text.count("```mermaid"),
        "fences": text.count("```"),
        "table_rows": sum(1 for l in lines if l.lstrip().startswith("|")),
    }


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    if not dst.exists():
        print(f"FAIL: {dst} does not exist")
        return 1
    a, b = src.read_text(encoding="utf-8"), dst.read_text(encoding="utf-8")
    problems = [f"{k}: source {v}, translation {shape(b)[k]}"
                for k, v in shape(a).items() if shape(b)[k] != v]

    prose = strip_code(b)
    letters = [c for c in prose if c.isalpha()]
    cyr = len(CYRILLIC.findall(prose))
    ratio = cyr / max(1, len(letters))
    if ratio > 0.01:
        sample = sorted(set(re.findall(r"[А-Яа-яЁё]+", prose)))[:12]
        problems.append(f"Cyrillic outside code: {ratio:.1%} of letters, e.g. {sample}")

    if len(b) < 0.6 * len(a):
        problems.append(f"translation is {len(b)} chars vs source {len(a)} - looks truncated")

    if problems:
        print(f"FAIL {dst}:")
        for p in problems:
            print("  -", p)
        return 1
    print(f"OK {dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
