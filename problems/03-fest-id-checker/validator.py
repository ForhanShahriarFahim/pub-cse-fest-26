import re
import sys


def main():
    data = sys.stdin.read()
    assert data.endswith("\n"), "missing final newline"
    lines = data[:-1].split("\n")
    assert re.fullmatch(r"[1-9][0-9]*", lines[0]), "bad T line"
    t = int(lines[0])
    assert 1 <= t <= 1000, "T out of range"
    assert len(lines) == t + 1, "wrong number of lines"
    for line in lines[1:]:
        # 1..20 printable ASCII characters, no spaces
        assert re.fullmatch(r"[!-~]{1,20}", line), f"bad ID line: {line!r}"


main()
