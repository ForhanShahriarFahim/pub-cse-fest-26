#!/usr/bin/env python3
"""Build, verify, audit and package one problem.

Usage: python3 tools/check.py problems/01-slug [--stress N]

Expects in the problem directory:
  sol.cpp            reference solution (produces the official outputs)
  sol.c              C solution          \
  Solution.java      Java solution        > must agree with sol.cpp on every test
  sol.py             Python 3 solution   /
  brute.cpp          optional slow solution, compared on small random tests
  wrong_*.cpp        solutions that MUST fail at least one official test
  gen.py             `python3 gen.py <mode> <seed> [args...]` prints one input
  validator.py       reads one input on stdin, exits non-zero if invalid
  testplan.txt       one official test per line:
                       file <path>          copy a hand-written input
                       gen <mode> <seed> .. run gen.py with these args
  challenge.md       HackerRank form (linted by tools/challenge.py)
  config.json        optional time limits in seconds, e.g. {"tl_cpp": 2}
"""
import json
import os
import re
import shutil
import subprocess
import sys
import time
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import challenge  # noqa: E402

BUILD = ".build"
# HackerRank limits: C/C++ 2 s and Java 8 4 s are documented. Python 3 has
# historically been 10 s; we only rely on half of each limit (see MARGIN).
DEFAULT_LIMITS = {"tl_c": 2, "tl_cpp": 2, "tl_java": 4, "tl_py": 10}
MARGIN = 0.5


def die(msg):
    print(f"FAIL: {msg}")
    sys.exit(1)


def run(cmd, inp, timeout, cwd=None):
    """Returns (stdout, seconds, status) where status is OK / TLE / RE."""
    start = time.perf_counter()
    try:
        p = subprocess.run(cmd, input=inp, capture_output=True, text=True,
                           timeout=timeout, cwd=cwd)
    except subprocess.TimeoutExpired:
        return "", timeout, "TLE"
    elapsed = time.perf_counter() - start
    return p.stdout, elapsed, ("OK" if p.returncode == 0 else "RE")


def same(a, b):
    """Line-by-line comparison that ignores trailing spaces and trailing blank lines."""
    def norm(s):
        return [line.rstrip() for line in s.rstrip().split("\n")]
    return norm(a) == norm(b)


def build(cmd, what):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        die(f"compile {what}\n{r.stderr}")


def hygiene(text, name, allow_empty=False):
    """Test files must be plain LF text: no CR, no tabs, no trailing spaces, final newline."""
    if text == "":
        if not allow_empty:
            die(f"{name} is empty")
        return
    if "\r" in text or "\t" in text:
        die(f"{name} contains CR or TAB")
    if not text.endswith("\n") or text.endswith("\n\n"):
        die(f"{name} must end with exactly one newline")
    if re.search(r" +$", text, re.M):
        die(f"{name} has trailing spaces")
    if not text.isascii():
        die(f"{name} has non-ASCII characters")


def main():
    pdir = os.path.abspath(sys.argv[1])
    stress = 1000
    if "--stress" in sys.argv:
        stress = int(sys.argv[sys.argv.index("--stress") + 1])
    cfg = dict(DEFAULT_LIMITS)
    if os.path.exists(f"{pdir}/config.json"):
        cfg.update(json.load(open(f"{pdir}/config.json")))

    bdir = f"{pdir}/{BUILD}"
    os.makedirs(bdir, exist_ok=True)

    # 0. Compile everything the way HackerRank's default environments would.
    build(["g++", "-O2", "-std=c++14", "-o", f"{bdir}/sol", f"{pdir}/sol.cpp"], "sol.cpp (C++14)")
    for std in ("c++11", "c++20"):
        build(["g++", "-fsyntax-only", f"-std={std}", f"{pdir}/sol.cpp"], f"sol.cpp ({std})")
    sols = {}
    for f in ("sol.c", "Solution.java", "sol.py"):
        if not os.path.exists(f"{pdir}/{f}"):
            die(f"{f} is missing")
    build(["gcc", "-O2", "-std=gnu11", "-o", f"{bdir}/sol_c", f"{pdir}/sol.c", "-lm"], "sol.c")
    sols["sol.c"] = ([f"{bdir}/sol_c"], cfg["tl_c"])
    build(["javac", "--release", "8", "-d", bdir, f"{pdir}/Solution.java"], "Solution.java (Java 8)")
    sols["Solution.java"] = (["java", "-Xss256m", "-cp", bdir, "Solution"], cfg["tl_java"])
    sols["sol.py"] = (["python3", f"{pdir}/sol.py"], cfg["tl_py"])
    if os.path.exists(f"{pdir}/brute.cpp"):
        build(["g++", "-O2", "-std=c++17", "-o", f"{bdir}/brute", f"{pdir}/brute.cpp"], "brute.cpp")
    wrongs = sorted(f for f in os.listdir(pdir) if f.startswith("wrong_") and f.endswith(".cpp"))
    for w in wrongs:
        build(["g++", "-O2", "-std=c++17", "-o", f"{bdir}/{w[:-4]}", f"{pdir}/{w}"], w)

    def gen(args):
        out, _, st = run(["python3", f"{pdir}/gen.py", *args], None, 120)
        if st != "OK":
            die(f"gen.py {' '.join(args)} -> {st}")
        return out

    def validate(inp, name):
        r = subprocess.run(["python3", f"{pdir}/validator.py"], input=inp,
                           capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            die(f"validator rejected {name}: {r.stderr.strip()[-500:]}")

    # 1. Build official tests.
    tdir = f"{pdir}/tests"
    shutil.rmtree(tdir, ignore_errors=True)
    os.makedirs(f"{tdir}/input")
    os.makedirs(f"{tdir}/output")
    inputs = []
    for line in open(f"{pdir}/testplan.txt"):
        parts = line.split()
        if not parts or parts[0].startswith("#"):
            continue
        if parts[0] == "file":
            inp = open(f"{pdir}/{parts[1]}").read()
        elif parts[0] == "gen":
            inp = gen(parts[1:])
        else:
            die(f"bad testplan line: {line}")
        inputs.append((" ".join(parts), inp))
    if inputs[0][0] != "file sample.txt":
        die("test 00 must be sample.txt")
    if len({inp for _, inp in inputs}) != len(inputs) and any(inp for _, inp in inputs):
        print("  note: some official tests are identical")

    print(f"== {len(inputs)} official tests")
    worst = {"sol.cpp": 0.0, **{k: 0.0 for k in sols}}
    no_input = all(inp == "" for _, inp in inputs)
    for i, (desc, inp) in enumerate(inputs):
        name = f"input{i:02d}.txt"
        hygiene(inp, name, allow_empty=no_input)
        validate(inp, name)
        out, t, st = run([f"{bdir}/sol"], inp, cfg["tl_cpp"])
        if st != "OK":
            die(f"sol.cpp {st} on {name}")
        worst["sol.cpp"] = max(worst["sol.cpp"], t)
        hygiene(out, f"output{i:02d}.txt")
        open(f"{tdir}/input/{name}", "w").write(inp)
        open(f"{tdir}/output/output{i:02d}.txt", "w").write(out)
        for k, (cmd, tl) in sols.items():
            o, t2, st2 = run(cmd, inp, tl)
            if st2 != "OK" or not same(o, out):
                die(f"{k} {st2 if st2 != 'OK' else 'WA'} on {name}")
            worst[k] = max(worst[k], t2)
        print(f"  {name}  {len(inp.encode())/1024:9.1f} KB  sol.cpp {t:.3f}s  [{desc}]")
    limit_of = {"sol.cpp": cfg["tl_cpp"], "sol.c": cfg["tl_c"],
                "Solution.java": cfg["tl_java"], "sol.py": cfg["tl_py"]}
    for k, t in worst.items():
        ok = t <= MARGIN * limit_of[k]
        print(f"   worst time {k:14s} {t:.3f}s  (limit {limit_of[k]}s){'' if ok else '  TOO SLOW'}")
        if not ok:
            die(f"{k} uses more than {int(MARGIN * 100)}% of its time limit")

    # 2. Wrong solutions must fail somewhere.
    for w in wrongs:
        verdict = None
        for i, (_, inp) in enumerate(inputs):
            o, _, st = run([f"{bdir}/{w[:-4]}"], inp, cfg["tl_cpp"])
            exp = open(f"{tdir}/output/output{i:02d}.txt").read()
            if st != "OK" or not same(o, exp):
                verdict = f"{st if st != 'OK' else 'WA'} on input{i:02d}"
                break
        if verdict is None:
            die(f"{w} passes all official tests")
        print(f"== {w}: rejected ({verdict})")

    # 3. Stress test against brute force on small random inputs.
    if os.path.exists(f"{bdir}/brute") and stress > 0:
        for seed in range(1, stress + 1):
            inp = gen(["small", str(seed)])
            validate(inp, f"stress seed {seed}")
            a, _, sa = run([f"{bdir}/sol"], inp, 10)
            b, _, sb = run([f"{bdir}/brute"], inp, 10)
            if sa != "OK" or sb != "OK" or not same(a, b):
                die(f"stress mismatch sol.cpp vs brute on seed {seed}:\n{inp}")
            if seed % 10 == 0:
                for k, (cmd, _) in sols.items():
                    c, _, sc = run(cmd, inp, 30)
                    if sc != "OK" or not same(a, c):
                        die(f"stress mismatch sol.cpp vs {k} on seed {seed}:\n{inp}")
        print(f"== stress: {stress} random small cases agree (all languages every 10th)")

    # 4. Package for HackerRank, then re-open the zip and verify it byte for byte.
    zpath = f"{pdir}/tests.zip"
    expected = {}
    for i in range(len(inputs)):
        for kind in ("input", "output"):
            arc = f"{kind}/{kind}{i:02d}.txt"
            expected[arc] = open(f"{tdir}/{arc}", "rb").read()
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for arc, data in expected.items():
            z.writestr(arc, data)
    with zipfile.ZipFile(zpath) as z:
        if z.testzip() is not None:
            die("tests.zip is corrupt")
        if sorted(z.namelist()) != sorted(expected):
            die("tests.zip has unexpected entries")
        for arc, data in expected.items():
            if z.read(arc) != data:
                die(f"tests.zip entry {arc} differs from tests/")
    print(f"== packaged and verified {zpath} ({os.path.getsize(zpath)/1024:.1f} KB, "
          f"{len(inputs)} test cases)")

    # 5. Lint the HackerRank form.
    errors = challenge.lint(pdir, len(inputs))
    if errors:
        die("challenge.md:\n  " + "\n  ".join(errors))
    print("== challenge.md matches the HackerRank form")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
