"""python3 gen.py <mode> <seed> [T]"""
import random
import string
import sys

PRINTABLE = [chr(c) for c in range(33, 127)]


def valid_id(rnd):
    serial = "0000"
    while serial == "0000":
        serial = "".join(rnd.choice(string.digits) for _ in range(4))
    return f"CSE-{rnd.randint(20, 26)}-{serial}"


def mutate(rnd, s):
    """Breaks (or occasionally keeps) one rule of a valid ID."""
    kind = rnd.randrange(13)
    s = list(s)
    if kind == 0:     # lowercase one letter of CSE
        i = rnd.randrange(3)
        s[i] = s[i].lower()
    elif kind == 1:   # wrong department
        s[:3] = list(rnd.choice(["EEE", "BBA", "CSF", "CS1", "CCE", "SCE", "CSEE"]))
    elif kind == 2:   # wrong separator
        s[rnd.choice([3, 6])] = rnd.choice("_/.:+=0")
    elif kind == 3:   # year just outside the range
        y = rnd.choice(["19", "27", "00", "99", "10", "18", "62", "02"])
        s[4:6] = list(y)
    elif kind == 4:   # boundary years (still valid)
        s[4:6] = list(rnd.choice(["20", "26"]))
    elif kind == 5:   # serial 0000
        s[7:] = list("0000")
    elif kind == 6:   # non-digit in year
        if rnd.random() < 0.5:
            s[4:6] = ["1", rnd.choice(":;<=>?@")]   # passes a naive (c - '0') range check
        else:
            s[rnd.choice([4, 5])] = rnd.choice(string.ascii_letters + "-#O")
    elif kind == 7:   # non-digit in serial
        s[rnd.randrange(7, 11)] = rnd.choice(string.ascii_letters + "-#O")
    elif kind == 8:   # extra character at the end or start
        if rnd.random() < 0.5:
            s.append(rnd.choice(string.digits))
        else:
            s.insert(0, rnd.choice("CX-"))
    elif kind == 9:   # missing character
        del s[rnd.randrange(len(s))]
    elif kind == 10:  # random printable character somewhere
        s[rnd.randrange(len(s))] = rnd.choice(PRINTABLE)
    elif kind == 11:  # serial with leading zeros (still valid)
        s[7:] = list("000" + rnd.choice("123456789"))
    # kind 12: unchanged (valid)
    return "".join(s)


def random_junk(rnd):
    return "".join(rnd.choice(PRINTABLE) for _ in range(rnd.randint(1, 20)))


EDGE = [
    "CSE-20-0001", "CSE-26-9999", "CSE-19-1234", "CSE-27-1234", "CSE-23-0000",
    "CSE-23-00001", "CSE-23-001", "CSE-2-1234", "CSE-123-1234", "CSE_23_1234",
    "CSE-23_1234", "CSE+23-1234", "Cse-23-1234", "CSe-23-1234", "cse-23-1234",
    "EEE-23-1234", "CSE-2A-1234", "CSE-A3-1234", "CSE-23-12A4", "CSE-23-O001",
    "CSE--3-1234", "CSE-23--234", "CSE-23-1234-", "-CSE-23-123", "C", "CSE",
    "CSE-", "CSE-23-", "CSECSECSECSECSECSECS", "CSE-22-1000", "CSE-24-0100",
    "CSE-25-0010", "CSE-21-0000", "CSE-00-1234", "CSE-99-1234", "CSE-62-1234",
    "XCSE-23-1234", "CSE-23-1234X", "CSE 23 1234".replace(" ", "-"), "CSE-26-0000",
    "CSE-20-0000", "CSE-2026-001", "1234-23-CSE", "CSE-23-1234".lower().upper(),
    "C5E-23-1234", "CSE-2?-1234", "CSE-23-12!4", "csE-26-9999", "CSE-26-999",
    "CSE-20-10000",
    # non-digits whose ASCII arithmetic still gives a year in 20..26
    "CSE-1:-1234", "CSE-1;-2026", "CSE-1<-0042", "CSE-1=-7777", "CSE-1>-1000",
    "CSE-1?-0001", "CSE-1@-9999",
]


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    t = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    rnd = random.Random(seed)
    if mode == "small":
        t = rnd.randint(1, 10)
    if mode == "edge":
        ids = EDGE
    elif mode in ("small", "random"):
        ids = []
        for _ in range(t):
            r = rnd.random()
            if r < 0.35:
                ids.append(valid_id(rnd))
            elif r < 0.95:
                ids.append(mutate(rnd, valid_id(rnd)))
            else:
                ids.append(random_junk(rnd))
    elif mode == "valid":
        ids = [valid_id(rnd) for _ in range(t)]
    else:
        raise SystemExit(f"unknown mode {mode}")
    print(len(ids))
    print("\n".join(ids))


main()
