"""Parse and lint a problem's challenge.md (the HackerRank Create Challenge form)."""
import os
import re

# Form fields in the order HackerRank shows them, then the two extra sections.
FIELDS = ["Challenge Name", "Description", "Problem Statement", "Input Format",
          "Constraints", "Output Format", "Tags"]
SECTIONS = FIELDS + ["Test Cases tab", "Settings"]
DESCRIPTION_LIMIT = 140


def parse(path):
    """Returns (title, {section: {"notes": str, "blocks": [str]}}) in file order."""
    text = open(path, encoding="utf-8").read()
    title, sections, current = "", {}, None
    for line in text.split("\n"):
        if line.startswith("# ") and not title:
            title = line[2:].strip()
        elif line.startswith("## "):
            current = line[3:].strip()
            sections[current] = []
        elif current is not None:
            sections[current].append(line)
    parsed = {}
    for name, lines in sections.items():
        notes, blocks, i = [], [], 0
        while i < len(lines):
            if lines[i].startswith("~~~"):
                j = i + 1
                while j < len(lines) and lines[j] != "~~~":
                    j += 1
                if j == len(lines):
                    raise ValueError(f"unterminated ~~~ block in section {name!r}")
                blocks.append("\n".join(lines[i + 1:j]))
                i = j + 1
            else:
                notes.append(lines[i])
                i += 1
        parsed[name] = {"notes": "\n".join(notes).strip(), "blocks": blocks}
    return title, parsed


def lint(pdir, num_tests):
    """Returns a list of problems found in pdir/challenge.md (empty when clean)."""
    path = os.path.join(pdir, "challenge.md")
    if not os.path.exists(path):
        return ["challenge.md is missing"]
    raw = open(path, encoding="utf-8").read()
    errors = []
    if "\r" in raw or "\t" in raw:
        errors.append("challenge.md contains CR or TAB characters")
    try:
        _, s = parse(path)
    except ValueError as e:
        return [str(e)]
    if list(s) != SECTIONS:
        errors.append(f"sections are {list(s)}, expected {SECTIONS}")
        return errors
    for f in FIELDS:
        if len(s[f]["blocks"]) != 1 or not s[f]["blocks"][0].strip():
            errors.append(f"field {f!r} needs exactly one non-empty ~~~ block")
    if errors:
        return errors
    name = s["Challenge Name"]["blocks"][0]
    if "\n" in name.strip():
        errors.append("Challenge Name must be one line")
    desc = s["Description"]["blocks"][0]
    if "\n" in desc.strip():
        errors.append("Description must be one line")
    if len(desc) > DESCRIPTION_LIMIT:
        errors.append(f"Description has {len(desc)} characters (limit {DESCRIPTION_LIMIT})")
    for f in FIELDS:
        block = s[f]["blocks"][0]
        if "$" in block:
            errors.append(f"{f!r} contains '$' (LaTeX does not render reliably; use Unicode)")
        if re.search(r"[ \t]+$", block, re.M):
            errors.append(f"{f!r} has trailing spaces")
    for img in re.findall(r"UPLOAD (\S+) HERE", s["Problem Statement"]["blocks"][0]):
        if not os.path.exists(os.path.join(pdir, img)):
            errors.append(f"statement wants image {img}, which is missing")
    m = re.search(r"\((\d+) test cases?", s["Test Cases tab"]["notes"])
    if not m:
        errors.append("Test Cases tab must say '(N test cases'")
    elif int(m[1]) != num_tests:
        errors.append(f"Test Cases tab says {m[1]} test cases, but there are {num_tests}")
    if not s["Test Cases tab"]["blocks"]:
        errors.append("Test Cases tab needs an explanation block for the sample")
    return errors
