"""python3 gen.py <mode> <seed> [N] [hi]   -> one input on stdout (hi = largest X)

Every mode prints "N X" and then the N weights in a shuffled (or stated) order.
"""
import random
import sys

MAXN = 2 * 10**5
MAXX = 10**9


def emit(x, w):
    assert 1 <= len(w) <= MAXN and 1 <= x <= MAXX and all(1 <= v <= x for v in w)
    print(len(w), x)
    print(*w)


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    n = int(sys.argv[3]) if len(sys.argv) > 3 else MAXN
    hi = int(sys.argv[4]) if len(sys.argv) > 4 else MAXX   # largest X for most modes
    rnd = random.Random(seed)

    if mode == "small":
        # stress test against brute.cpp (exhaustive search, so N stays tiny)
        n = rnd.randint(1, 8)
        x = rnd.choice([rnd.randint(1, 20), rnd.randint(1, 10**9)])
        lo = rnd.choice([1, max(1, x // 3), max(1, x // 2)])
        w = [rnd.randint(lo, x) for _ in range(n)]
    elif mode == "single":
        # one student, rides alone
        x = rnd.randint(1, MAXX)
        w = [rnd.randint(1, x)]
    elif mode == "pairfit":
        # two students whose weights add up to exactly X: one rickshaw
        x = rnd.randint(2, MAXX)
        a = rnd.randint(1, x - 1)
        w = [a, x - a]
    elif mode == "pairnofit":
        # two students whose weights add up to X + 1: two rickshaws
        x = rnd.randint(1, MAXX)
        a = rnd.randint(1, x)
        w = [a, x + 1 - a]
    elif mode == "random":
        # uniform weights, X close to hi
        x = rnd.randint(max(1, hi // 2), hi)
        w = [rnd.randint(1, x) for _ in range(n)]
    elif mode == "realistic":
        # rickshaw limit 120..200 kg, students 35..120 kg: lots of equal weights
        x = rnd.randint(120, 200)
        w = [rnd.randint(35, min(120, x)) for _ in range(n)]
    elif mode == "allx":
        # everybody weighs exactly X: everybody rides alone
        x = hi
        w = [x] * n
    elif mode == "half":
        # everybody weighs exactly X / 2: every pair fits exactly
        x = 2 * rnd.randint(1, MAXX // 2)
        w = [x // 2] * n
    elif mode == "ones":
        # tiny students, huge limit
        x = MAXX
        w = [1] * n
    elif mode == "nearhalf":
        # X odd; weights X//2 and X//2 + 1. Two "big" ones do not fit together.
        x = 2 * rnd.randint(MAXX // 4, MAXX // 2 - 1) + 1
        big = rnd.randint(0, n)
        w = [x // 2 + 1] * big + [x // 2] * (n - big)
        rnd.shuffle(w)
    elif mode == "exact":
        # pairs whose weights add up to exactly X (kills "< X"), plus one spare
        x = rnd.randint(2, hi)
        w = []
        while len(w) + 2 <= n - 1:
            a = rnd.randint(1, x - 1)
            w += [a, x - a]
        w.append(rnd.randint(1, x))
        rnd.shuffle(w)
    elif mode == "antiadj":
        # light a_i pair only with heavy X - a_i; light+light also fits, so pairing
        # neighbours wastes the light students and leaves every heavy one alone
        x = hi
        k = n // 2
        light = [rnd.randint(1, x // 4) for _ in range(k)]
        w = light + [x - a for a in light]
        if len(w) < n:
            w.append(rnd.randint(1, x))
        rnd.shuffle(w)
    elif mode == "antilight":
        # some students are so heavy they always ride alone; everyone else pairs up
        x = hi
        gap = x // 1000
        heavy = n // 4
        w = [rnd.randint(x - gap, x) for _ in range(heavy)]
        w += [rnd.randint(gap + 1, x // 2) for _ in range(n - heavy)]
        rnd.shuffle(w)
    elif mode == "heavy":
        # everyone weighs more than X / 2: nobody can share (O(N^2) scans time out)
        x = rnd.randint(hi // 2, hi)
        w = [rnd.randint(x // 2 + 1, x) for _ in range(n)]
    elif mode in ("sorted", "reversed"):
        x = rnd.randint(hi // 2, hi)
        w = sorted((rnd.randint(1, x) for _ in range(n)), reverse=(mode == "reversed"))
    else:
        raise SystemExit(f"unknown mode {mode}")
    emit(x, w)


main()
