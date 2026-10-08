#!/usr/bin/env python3
"""Build, verify and package one problem.

Usage: python3 tools/check.py problems/01-slug [--stress N]

Expects in the problem directory:
  sol.cpp            reference solution (produces the official outputs)
  sol.py             Python solution (must agree with sol.cpp)
  Sol.java           optional Java solution (must agree with sol.cpp)
  brute.cpp          optional slow solution, compared on small random tests
  wrong_*.cpp        solutions that MUST fail at least one official test
  gen.py             `python3 gen.py <mode> <seed> [args...]` prints one input
  validator.py       reads one input on stdin, exits non-zero if invalid
  testplan.txt       one official test per line:
                       file <path>          copy a hand-written input
                       gen <mode> <seed> .. run gen.py with these args
  config.json        optional: {"tl_cpp": 2, "tl_py": 10, "tl_java": 4}
"""
import json
import os
import shutil
import subprocess
import sys
import time
import zipfile

BUILD = ".build"


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
    return a.split() == b.split()


def compile_cpp(src, out):
    r = subprocess.run(["g++", "-O2", "-std=c++17", "-o", out, src],
                       capture_output=True, text=True)
    if r.returncode != 0:
        die(f"compile {src}\n{r.stderr}")


def main():
    pdir = os.path.abspath(sys.argv[1])
    stress = 1000
    if "--stress" in sys.argv:
        stress = int(sys.argv[sys.argv.index("--stress") + 1])
    cfg = {"tl_cpp": 2, "tl_py": 10, "tl_java": 4}
    if os.path.exists(f"{pdir}/config.json"):
        cfg.update(json.load(open(f"{pdir}/config.json")))

    bdir = f"{pdir}/{BUILD}"
    os.makedirs(bdir, exist_ok=True)
    compile_cpp(f"{pdir}/sol.cpp", f"{bdir}/sol")
    sols = {"sol.py": (["python3", f"{pdir}/sol.py"], cfg["tl_py"])}
    if os.path.exists(f"{pdir}/brute.cpp"):
        compile_cpp(f"{pdir}/brute.cpp", f"{bdir}/brute")
    if os.path.exists(f"{pdir}/Sol.java"):
        r = subprocess.run(["javac", "-d", bdir, f"{pdir}/Sol.java"],
                           capture_output=True, text=True)
        if r.returncode != 0:
            die(f"compile Sol.java\n{r.stderr}")
        sols["Sol.java"] = (["java", "-Xss256m", "-cp", bdir, "Sol"], cfg["tl_java"])
    wrongs = sorted(f for f in os.listdir(pdir) if f.startswith("wrong_") and f.endswith(".cpp"))
    for w in wrongs:
        compile_cpp(f"{pdir}/{w}", f"{bdir}/{w[:-4]}")

    def gen(args):
        out, _, st = run(["python3", f"{pdir}/gen.py", *args], None, 120)
        if st != "OK":
            die(f"gen.py {' '.join(args)} -> {st}")
        return out

    def validate(inp, name):
        _, _, st = run(["python3", f"{pdir}/validator.py"], inp, 60)
        if st != "OK":
            r = subprocess.run(["python3", f"{pdir}/validator.py"], input=inp,
                               capture_output=True, text=True)
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

    print(f"== {len(inputs)} official tests")
    worst = {"sol.cpp": 0.0, **{k: 0.0 for k in sols}}
    for i, (desc, inp) in enumerate(inputs):
        name = f"input{i:02d}.txt"
        validate(inp, name)
        out, t, st = run([f"{bdir}/sol"], inp, cfg["tl_cpp"])
        if st != "OK":
            die(f"sol.cpp {st} on {name}")
        worst["sol.cpp"] = max(worst["sol.cpp"], t)
        if not out.endswith("\n"):
            out += "\n"
        open(f"{tdir}/input/{name}", "w").write(inp)
        open(f"{tdir}/output/output{i:02d}.txt", "w").write(out)
        for k, (cmd, tl) in sols.items():
            o, t2, st2 = run(cmd, inp, tl)
            if st2 != "OK" or not same(o, out):
                die(f"{k} {st2 if st2 != 'OK' else 'WA'} on {name}")
            worst[k] = max(worst[k], t2)
        size = len(inp.encode())
        print(f"  {name}  {size/1024:9.1f} KB  sol.cpp {t:.3f}s  [{desc}]")
    for k, t in worst.items():
        print(f"   worst time {k}: {t:.3f}s")

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
        print(f"== stress: {stress} random small cases agree")

    # 4. Package for HackerRank.
    zpath = f"{pdir}/tests.zip"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for i in range(len(inputs)):
            z.write(f"{tdir}/input/input{i:02d}.txt", f"input/input{i:02d}.txt")
            z.write(f"{tdir}/output/output{i:02d}.txt", f"output/output{i:02d}.txt")
    print(f"== packaged {zpath} ({os.path.getsize(zpath)/1024:.1f} KB)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
