#!/usr/bin/env python3
"""Builds setter-desk.html: one page with a Copy button for every HackerRank form field.

Usage: python3 tools/build_desk.py   (run after tools/check.py has passed for each problem)

Everything on the page is read from the problem folders (challenge.md, editorial.md,
testplan.txt, tests/, *.png), so the page cannot drift from the files.
"""
import base64
import glob
import html
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import challenge  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = "https://github.com/ForhanShahriarFahim/pub-cse-fest-26"


def git(*args):
    return subprocess.run(["git", "-C", ROOT, *args], capture_output=True, text=True).stdout.strip()


def readme_status():
    """Problem number -> status, from the README index table."""
    status = {}
    for line in open(os.path.join(ROOT, "README.md"), encoding="utf-8"):
        m = re.match(r"\| (\d\d) \|.*\| (\w[\w ]*) \|\s*$", line)
        if m:
            status[m[1]] = m[2].strip()
    return status


def problem(pdir, status, branch):
    slug = os.path.basename(pdir)
    num = slug[:2]
    title, s = challenge.parse(os.path.join(pdir, "challenge.md"))
    tier = re.search(r"\((.*)\)\s*$", title)
    fields = [{"name": f, "note": s[f]["notes"], "text": s[f]["blocks"][0]} for f in challenge.FIELDS]
    tests = []
    plan = [l.split() for l in open(os.path.join(pdir, "testplan.txt")) if l.split() and not l.startswith("#")]
    for i, parts in enumerate(plan):
        inp = os.path.join(pdir, "tests", "input", f"input{i:02d}.txt")
        tests.append({"id": f"{i:02d}", "source": " ".join(parts), "bytes": os.path.getsize(inp)})
    sample_in = open(os.path.join(pdir, "tests", "input", "input00.txt")).read()
    sample_out = open(os.path.join(pdir, "tests", "output", "output00.txt")).read()
    images = []
    # Only the pictures the statement asks to upload (other PNGs are drafts/alternatives).
    for name in re.findall(r"UPLOAD (\S+) HERE", s["Problem Statement"]["blocks"][0]):
        data = base64.b64encode(open(os.path.join(pdir, name), "rb").read()).decode()
        images.append({"name": name, "data": f"data:image/png;base64,{data}"})
    raw = f"{REPO}/raw/{branch}/problems/{slug}"
    return {
        "num": num,
        "slug": slug,
        "name": fields[0]["text"].strip(),
        "tier": tier[1] if tier else "",
        "status": status.get(num, "Drafted"),
        "fields": fields,
        "testsNote": s["Test Cases tab"]["notes"],
        "explanation": s["Test Cases tab"]["blocks"][0],
        "settings": s["Settings"]["notes"],
        "tests": tests,
        "sampleIn": sample_in,
        "sampleOut": sample_out,
        "images": images,
        "editorial": open(os.path.join(pdir, "editorial.md"), encoding="utf-8").read(),
        "zipUrl": f"{raw}/tests.zip",
        "folderUrl": f"{REPO}/tree/{branch}/problems/{slug}",
        "solutions": {f: f"{REPO}/blob/{branch}/problems/{slug}/{f}"
                      for f in ("sol.c", "sol.cpp", "Solution.java", "sol.py")},
    }


def main():
    branch = git("rev-parse", "--abbrev-ref", "HEAD")
    status = readme_status()
    problems = [problem(p, status, branch)
                for p in sorted(glob.glob(os.path.join(ROOT, "problems", "[0-9][0-9]-*")))]
    data = {"problems": problems, "commit": git("rev-parse", "--short", "HEAD"), "branch": branch,
            "repo": REPO}
    template = open(os.path.join(ROOT, "tools", "desk_template.html"), encoding="utf-8").read()
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    out = template.replace("/*__DATA__*/null", payload)
    path = os.path.join(ROOT, "setter-desk.html")
    open(path, "w", encoding="utf-8").write(out)
    print(f"wrote {path} ({len(out)/1024:.0f} KB, {len(problems)} problems)")


if __name__ == "__main__":
    main()
