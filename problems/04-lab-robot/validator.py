import re
import sys


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    m = re.fullmatch(r"([1-9][0-9]*) ([1-9][0-9]*)", lines[0])
    assert m, "bad first line"
    r, c = int(m[1]), int(m[2])
    assert 1 <= r <= 100 and 1 <= c <= 100, "R or C out of range"
    assert len(lines) == r + 3, "wrong number of lines"
    grid = lines[1:1 + r]
    for row in grid:
        assert re.fullmatch(r"[.#S]{%d}" % c, row), f"bad grid row {row!r}"
    assert sum(row.count("S") for row in grid) == 1, "need exactly one S"
    assert re.fullmatch(r"[1-9][0-9]*", lines[1 + r]), "bad K line"
    k = int(lines[1 + r])
    assert 1 <= k <= 10**5, "K out of range"
    assert re.fullmatch(r"[UDLR]{%d}" % k, lines[2 + r]), "bad command string"


main()
