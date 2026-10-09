import re
import sys

INT = r"[1-9][0-9]*"


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    assert re.fullmatch(INT, lines[0]), "bad Q line"
    q = int(lines[0])
    assert 1 <= q <= 10**5, "Q out of range"
    assert len(lines) == q + 1, "wrong number of lines"
    pat = re.compile(f"{INT} {INT}")
    for line in lines[1:]:
        assert pat.fullmatch(line), f"bad line: {line!r}"
        l, r = map(int, line.split())
        assert 1 <= l <= r <= 10**6, f"bad range: {line!r}"


main()
