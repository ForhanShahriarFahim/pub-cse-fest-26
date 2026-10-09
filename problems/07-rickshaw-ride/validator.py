import re
import sys

INT = r"[1-9][0-9]*"


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    assert len(lines) == 2, "expected exactly 2 lines"
    assert re.fullmatch(f"{INT} {INT}", lines[0]), "bad first line"
    n, x = map(int, lines[0].split())
    assert 1 <= n <= 2 * 10**5, "N out of range"
    assert 1 <= x <= 10**9, "X out of range"
    assert re.fullmatch(" ".join([INT] * n) if n <= 50 else f"{INT}( {INT})*", lines[1]), "bad weights line"
    w = list(map(int, lines[1].split()))
    assert len(w) == n, "wrong number of weights"
    assert all(1 <= v <= x for v in w), "weight out of range"


main()
