"""python3 gen.py <mode> <seed> [Q] [a] [b]   -> one input on stdout"""
import random
import sys

M = 10**6
MAXQ = 10**5


def primes_upto(n):
    s = bytearray([1]) * (n + 1)
    s[0] = s[1] = 0
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]:
            s[i * i::i] = bytes(len(range(i * i, n + 1, i)))
    return [i for i in range(n + 1) if s[i]]


def emit(qs):
    assert 1 <= len(qs) <= MAXQ
    assert all(1 <= l <= r <= M for l, r in qs)
    print(len(qs))
    print("\n".join(f"{l} {r}" for l, r in qs))


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    q = int(sys.argv[3]) if len(sys.argv) > 3 else MAXQ
    rnd = random.Random(seed)

    def rand_range(lo=1, hi=M):
        a, b = rnd.randint(lo, hi), rnd.randint(lo, hi)
        return (min(a, b), max(a, b))

    if mode == "small":
        # stress test against brute.cpp
        q = rnd.randint(1, 10)
        hi = rnd.choice([10, 50, 200, 2000])
        qs = [rand_range(1, hi) for _ in range(q)]
    elif mode == "fixed":
        # hand-picked corner bundles
        qs = [(1, 1), (1, 2), (2, 2), (2, 3), (3, 3), (4, 4), (1, 3), (4, 6),
              (1, M), (M, M), (M - 16, M), (M - 17, M), (999983, 999983), (999982, 999982),
              (2, M), (3, M), (1, M - 1), (500000, 500000), (1, 100), (1, 1000),
              (1, 10000), (1, 100000), (99991, 100003), (100000, 100002),
              (10201, 10201), (10403, 10403), (49, 49), (97 * 97, 97 * 97),
              (997 * 997, 997 * 997), (991 * 997, 991 * 997), (370261, 370373)]
    elif mode == "singles":
        # one ticket per bundle: every number from a to b gets its own query
        a, b = int(sys.argv[4]), int(sys.argv[5])
        qs = [(i, i) for i in range(a, b + 1)]
    elif mode == "full":
        qs = [(1, M)] * q
    elif mode == "random":
        qs = [rand_range() for _ in range(q)]
    elif mode == "short":
        # short bundles (length 1..100) anywhere
        qs = []
        for _ in range(q):
            l = rnd.randint(1, M)
            qs.append((l, min(M, l + rnd.randint(0, 99))))
    elif mode == "prefix":
        # every bundle starts at ticket 1 or 2
        qs = [(rnd.choice([1, 2]), rnd.randint(1, M)) for _ in range(q)]
        qs = [(min(l, r), max(l, r)) for l, r in qs]
    elif mode == "primeends":
        # both ends are primes, or one more / one less than a prime
        ps = primes_upto(M)
        qs = []
        for _ in range(q):
            i, j = sorted((rnd.randrange(len(ps)), rnd.randrange(len(ps))))
            l, r = ps[i] + rnd.choice([0, 0, 1]), ps[j] - rnd.choice([0, 0, 1])
            if l > r:
                l, r = ps[i], ps[i]
            qs.append((l, r))
    elif mode == "gaps":
        # inside a prime gap (answer 0) or from one prime to the next (answer 2)
        ps = primes_upto(M)
        big = sorted(range(len(ps) - 1), key=lambda k: ps[k + 1] - ps[k], reverse=True)[:2000]
        qs = []
        for _ in range(q):
            k = rnd.choice(big)
            if rnd.random() < 0.5:
                qs.append((ps[k] + 1, ps[k + 1] - 1))
            else:
                qs.append((ps[k], ps[k + 1]))
        qs.append((492114, 492226))   # the longest prime gap below 10^6 (113 numbers, no prime)
    elif mode == "top":
        # bundles near the end of the ticket range
        qs = [rand_range(M - 2000, M) for _ in range(q)]
    elif mode == "squares":
        # products of two primes around 100..1000, as single tickets and short bundles
        ps = [p for p in primes_upto(1000) if p > 50]
        qs = []
        for _ in range(q):
            n = rnd.choice(ps) * rnd.choice(ps)
            qs.append((n, n) if rnd.random() < 0.7 else (n - rnd.randint(0, 3), n + rnd.randint(0, 3)))
    else:
        raise SystemExit(f"unknown mode {mode}")
    emit(qs)


main()
