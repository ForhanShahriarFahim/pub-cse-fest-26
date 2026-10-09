import re
import sys


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    assert re.fullmatch(r"[1-9][0-9]*", lines[0]), "bad T line"
    t = int(lines[0])
    assert 1 <= t <= 100, "T out of range"
    assert len(lines) == t + 1, "wrong number of lines"
    for s in lines[1:]:
        assert 5 <= len(s) <= 1000, f"length {len(s)} out of range"
        assert all(32 <= ord(c) <= 126 for c in s), "non-printable character"
        assert not s.startswith(" ") and not s.endswith(" "), "leading/trailing space"
        assert "  " not in s, "two spaces in a row"
        # The original ends with "Coder", so the last five characters are one shifted copy of it.
        tail = s[-5:]
        assert re.fullmatch(r"[A-Z][a-z]{4}", tail), f"bad signature {tail!r}"
        shifts = {(ord(a.lower()) - ord(b.lower())) % 26 for a, b in zip(tail, "Coder")}
        assert len(shifts) == 1, f"signature {tail!r} is not a shifted 'Coder'"


main()
