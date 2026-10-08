import re
import sys

INT = r"(0|[1-9][0-9]*)"


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    assert re.fullmatch(INT, lines[0]), "bad T line"
    t = int(lines[0])
    assert 1 <= t <= 10**4, "T out of range"
    assert len(lines) == t + 1, "wrong number of lines"
    for line in lines[1:]:
        assert re.fullmatch(" ".join([INT] * 5), line), f"bad line: {line!r}"
        n, v, j, k, c = map(int, line.split())
        assert 1 <= n <= 10**9
        assert 0 <= v <= 10**9
        assert 0 <= j <= 10**9
        assert 1 <= k <= 10**9
        assert 1 <= c <= 10**9


main()
