import re
import string
import sys

VERDICTS = {"AC", "WA", "TLE", "RE", "CE"}


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    m = re.fullmatch(r"([1-9][0-9]*) ([1-9][0-9]*) (0|[1-9][0-9]*)", lines[0])
    assert m, "bad first line"
    t, p, n = int(m[1]), int(m[2]), int(m[3])
    assert 1 <= t <= 100, "T out of range"
    assert 1 <= p <= 26, "P out of range"
    assert 0 <= n <= 10**5, "N out of range"
    assert len(lines) == n + 1, "wrong number of lines"
    letters = string.ascii_uppercase[:p]
    last = 0
    for line in lines[1:]:
        m = re.fullmatch(r"(0|[1-9][0-9]*) ([1-9][0-9]*) ([A-Z]) (AC|WA|TLE|RE|CE)", line)
        assert m, f"bad submission line {line!r}"
        minute, team, prob = int(m[1]), int(m[2]), m[3]
        assert 0 <= minute <= 300, "time out of range"
        assert minute >= last, "times must be non-decreasing"
        last = minute
        assert 1 <= team <= t, "team out of range"
        assert prob in letters, "problem letter out of range"


main()
