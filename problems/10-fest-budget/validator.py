import re
import sys

INT = r"[1-9][0-9]*"


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    assert re.fullmatch(f"{INT} {INT}", lines[0]), "bad first line"
    n, b = map(int, lines[0].split())
    assert 1 <= n <= 100, "N out of range"
    assert 1 <= b <= 5 * 10**4, "B out of range"
    assert len(lines) == n + 1, "wrong number of lines"
    for line in lines[1:]:
        assert re.fullmatch(f"{INT} {INT}", line), f"bad line: {line!r}"
        c, f = map(int, line.split())
        assert 1 <= c <= 10**5, "cost out of range"
        assert 1 <= f <= 10**9, "fun out of range"


main()
