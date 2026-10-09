import re
import sys

INT = r"[1-9][0-9]*"


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    assert re.fullmatch(f"{INT} {INT}", lines[0]), "bad first line"
    n, m = map(int, lines[0].split())
    assert 2 <= n <= 10**5, "N out of range"
    assert 1 <= m <= 2 * 10**5, "M out of range"
    assert len(lines) == m + 3, "wrong number of lines"
    pat = re.compile(f"{INT} {INT}")
    seen = set()
    for line in lines[1:m + 1]:
        assert pat.fullmatch(line), f"bad walkway line: {line!r}"
        u, v = map(int, line.split())
        assert 1 <= u <= n and 1 <= v <= n, "building out of range"
        assert u != v, "walkway to itself"
        key = (min(u, v), max(u, v))
        assert key not in seen, "two walkways join the same pair"
        seen.add(key)
    assert re.fullmatch(INT, lines[m + 1]), "bad K line"
    k = int(lines[m + 1])
    assert 1 <= k <= 10, "K out of range"
    assert re.fullmatch(" ".join([INT] * k), lines[m + 2]), "bad clue line"
    clues = list(map(int, lines[m + 2].split()))
    prev = 1
    for c in clues:
        assert 1 <= c <= n, "clue out of range"
        assert c != prev, "clue equals the previous position"
        prev = c


main()
