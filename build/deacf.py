#!/usr/bin/env python3
"""
One-off: remove ACF-specific language from the process.

The process should describe a modular block-based build without naming the
plugin that happens to implement it. Ordered longest-first so specific phrases
win over general ones.
"""
import pathlib
import re

SUBS = [
    ("reusable ACF block system", "reusable block system"),
    ("reusable ACF component", "reusable block"),
    ("modular ACF builds", "modular block-based builds"),
    ("modular ACF build", "modular block-based build"),
    ("ACF Pro blocks", "block framework"),
    ("ACF Pro", "Block framework"),
    ("ACF field patterns", "field patterns"),
    ("ACF field groups", "field groups"),
    ("ACF field group", "field group"),
    ("ACF field notes", "field notes"),
    ("ACF field list", "field list"),
    ("ACF fields", "fields"),
    ("ACF patterns", "field patterns"),
    ("ACF version", "Block framework version"),
    ("ACF repeater", "repeater field"),
    ("ACF blocks", "reusable blocks"),
    ("in ACF", "in the block framework"),
    ("ACF", "the block framework"),
]

FILES = [
    "data/process.js", "data/steps.js", "data/worked-example.js",
    "assets/js/guide.js", "build/make_docx.py", "build/make_xlsx.py",
]

root = pathlib.Path(__file__).resolve().parent.parent
total = 0
for rel in FILES:
    p = root / rel
    t = p.read_text()
    before = t
    n = 0
    for old, new in SUBS:
        c = t.count(old)
        if c:
            t = t.replace(old, new)
            n += c
    if t != before:
        p.write_text(t)
    print(f"  {rel:<28} {n} replacements")
    total += n

# Tidy artefacts of the substitution
for rel in FILES:
    p = root / rel
    t = p.read_text()
    t = t.replace("Block framework blocks", "block framework")
    t = t.replace("the block framework Pro", "block framework")
    t = re.sub(r"\bfield groups group\b", "field group", t)
    p.write_text(t)

print(f"  TOTAL {total}")
remaining = []
for rel in FILES:
    for i, line in enumerate((root / rel).read_text().splitlines(), 1):
        if "ACF" in line:
            remaining.append(f"{rel}:{i}: {line.strip()[:90]}")
print("  remaining ACF mentions:", remaining or "none")
