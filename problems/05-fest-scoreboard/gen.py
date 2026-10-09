"""python3 gen.py <mode> <seed> [T P N]"""
import random
import string
import sys

REJECT = ["WA", "TLE", "RE"]


def emit(t, p, subs):
    subs.sort(key=lambda s: s[0])          # stable: same-minute order is kept
    print(t, p, len(subs))
    for minute, team, prob, verdict in subs:
        print(minute, team, prob, verdict)


def letters(p):
    return string.ascii_uppercase[:p]


def random_log(rnd, t, p, n, ce_weight=1):
    weights = [3, 4, 1, 1, ce_weight]
    return [(rnd.randint(0, 300), rnd.randint(1, t), rnd.choice(letters(p)),
             rnd.choices(["AC", "WA", "TLE", "RE", "CE"], weights)[0]) for _ in range(n)]


def realistic_log(rnd, t, p, n):
    """Teams of different strength attempt problems; some keep submitting after AC."""
    subs = []
    skill = {team: rnd.random() for team in range(1, t + 1)}
    while len(subs) < n:
        team = rnd.randint(1, t)
        prob = rnd.choice(letters(p))
        minute = rnd.randint(0, 280)
        tries = rnd.randint(1, 6)
        for _ in range(tries):
            if len(subs) >= n:
                break
            ok = rnd.random() < 0.25 + 0.6 * skill[team]
            verdict = "AC" if ok else rnd.choices(REJECT + ["CE"], [5, 2, 2, 1])[0]
            subs.append((min(minute, 300), team, prob, verdict))
            minute += rnd.randint(0, 25)
            if ok and rnd.random() < 0.6:
                break       # usually stop after AC; sometimes resubmit (must be ignored)
    return subs[:n]


def edge_log():
    t, p = 6, 4
    subs = [
        (0, 1, "A", "AC"),                     # AC at minute 0
        (0, 2, "A", "CE"), (0, 2, "A", "CE"), (1, 2, "A", "AC"),   # CE never counts
        (3, 3, "B", "WA"), (3, 3, "B", "AC"),  # same minute, judged in order
        (10, 1, "A", "WA"), (11, 1, "A", "AC"),  # after AC: ignored
        (50, 4, "C", "WA"), (60, 4, "C", "TLE"), (70, 4, "C", "RE"), (80, 4, "C", "AC"),
        (90, 5, "D", "WA"), (95, 5, "D", "WA"),  # never solved: no penalty
        (100, 3, "C", "CE"), (120, 3, "C", "WA"), (130, 3, "C", "AC"),
        (299, 6, "A", "WA"), (300, 6, "A", "AC"),  # last minute
        (300, 6, "B", "AC"),
    ]
    return t, p, subs


def tie_log(rnd, t, p):
    """Several teams with the exact same results, so the smaller team number must win."""
    base = []
    minute = 0
    for prob in letters(p)[:min(p, 4)]:
        minute += rnd.randint(5, 40)
        wrong = rnd.randint(0, 2)
        base += [(minute - 1, prob, "WA")] * wrong + [(minute, prob, "AC")]
    tied = sorted(rnd.sample(range(1, t + 1), min(t, 4)))
    subs = []
    for team in tied:
        for minute, prob, verdict in base:
            subs.append((minute, team, prob, verdict))
    # Other teams: one fewer solve, or the same solves with more penalty.
    for team in range(1, t + 1):
        if team in tied:
            continue
        if rnd.random() < 0.5:
            for minute, prob, verdict in base[:-1]:
                subs.append((minute, team, prob, verdict))
        else:
            for minute, prob, verdict in base:
                subs.append((min(300, minute + 1), team, prob, verdict))
    return subs


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    rnd = random.Random(seed)
    args = [int(a) for a in sys.argv[3:]]
    if mode == "small":
        t, p = rnd.randint(1, 4), rnd.randint(1, 4)
        if rnd.random() < 0.3:
            emit(t, p, tie_log(rnd, t, p))
        else:
            emit(t, p, random_log(rnd, t, p, rnd.randint(0, 14)))
    elif mode == "empty":
        t, p = args
        emit(t, p, [])
    elif mode == "edge":
        t, p, subs = edge_log()
        emit(t, p, subs)
    elif mode == "random":
        t, p, n = args
        emit(t, p, random_log(rnd, t, p, n))
    elif mode == "realistic":
        t, p, n = args
        emit(t, p, realistic_log(rnd, t, p, n))
    elif mode == "ce":
        t, p, n = args
        emit(t, p, random_log(rnd, t, p, n, ce_weight=8))
    elif mode == "tie":
        t, p = args
        emit(t, p, tie_log(rnd, t, p))
    elif mode == "nosolve":     # nobody solves anything: everyone 0 0, team 1 wins
        t, p, n = args
        emit(t, p, [(rnd.randint(0, 300), rnd.randint(1, t), rnd.choice(letters(p)),
                     rnd.choice(REJECT + ["CE"])) for _ in range(n)])
    else:
        raise SystemExit(f"unknown mode {mode}")


main()
