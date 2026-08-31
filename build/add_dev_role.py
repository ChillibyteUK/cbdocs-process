#!/usr/bin/env python3
"""
Weave the Web Developer role into the step model.

The split: Head of Web specifies work packages and assures what comes back.
Web Developer delivers them. Development changes hands entirely; several other
steps gain the developer as a contributor because they either produce the
specification the developer works from, or consume what the developer returns.
"""
import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent
p = root / 'data' / 'steps.js'
src = p.read_text()

# id -> (field, new value)
CHANGES = {
    'block-identification': [('contributors', ["designer", "web-developer"])],
    'wireframes':           [('contributors', ["designer", "web-developer"])],
    'build-spec':           [('contributors', ["designer", "web-developer"])],
    'access-credentials':   [('contributors', ["head-of-web", "web-developer"])],
    'development':          [('owner', "web-developer"),
                             ('contributors', ["head-of-web", "designer", "copywriter"]),
                             ('approver', "head-of-web")],
    'internal-qa':          [('contributors', ["web-developer", "account-management"])],
    'staging-review':       [('contributors', ["head-of-web", "web-developer", "client"])],
    'launch-prep':          [('contributors', ["web-developer", "account-management", "seo-analytics"])],
    'launch-closure':       [('contributors', ["web-developer", "account-management", "seo-analytics"])],
}

# Split the file into per-step chunks so a field edit cannot leak into a neighbour.
bounds = [(m.start(), m.group(1)) for m in re.finditer(r"\n\s*id: [\"']([\w-]+)[\"'],", src)]
bounds.append((len(src), None))

out = src
applied = []
for i in range(len(bounds) - 1):
    start, sid = bounds[i]
    end = bounds[i + 1][0]
    if sid not in CHANGES:
        continue
    chunk = src[start:end]
    new_chunk = chunk
    for field, value in CHANGES[sid]:
        if isinstance(value, list):
            rendered = '[' + ', '.join(f'"{v}"' for v in value) + ']'
            pat = re.compile(rf'(\n    {field}: )\[[^\]]*\]')
        else:
            rendered = f'"{value}"'
            pat = re.compile(rf'(\n    {field}: )["\'][\w-]+["\']')
        new_chunk, n = pat.subn(lambda m: m.group(1) + rendered, new_chunk, count=1)
        if n:
            applied.append(f'{sid}.{field}')
        else:
            print(f'  ! {sid}.{field} not matched')
    out = out.replace(chunk, new_chunk, 1)

p.write_text(out)
print(f'  applied {len(applied)} field changes:')
for a in applied:
    print(f'    {a}')
