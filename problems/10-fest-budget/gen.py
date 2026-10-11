"""python3 gen.py <mode> <seed> [N] [B]   -> one input on stdout"""
import random
import sys

MAXN, MAXB, MAXC, MAXF = 100, 5 * 10**4, 10**5, 10**9


def emit(b, items):
    assert 1 <= len(items) <= MAXN and 1 <= b <= MAXB
    assert all(1 <= c <= MAXC and 1 <= f <= MAXF for c, f in items)
    print(len(items), b)
    print("\n".join(f"{c} {f}" for c, f in items))


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    n = int(sys.argv[3]) if len(sys.argv) > 3 else MAXN
    b = int(sys.argv[4]) if len(sys.argv) > 4 else MAXB
    rnd = random.Random(seed)

    if mode == "small":
        # stress test against brute.cpp (all subsets)
        n = rnd.randint(1, 12)
        b = rnd.randint(1, 40)
        items = [(rnd.randint(1, 30), rnd.randint(1, rnd.choice([10, 100, MAXF]))) for _ in range(n)]
    elif mode == "single":
        # one activity; it fits (extra=0) or costs more than the budget (extra=1)
        extra = n
        b = rnd.randint(1, MAXB)
        items = [(b + 1 if extra else rnd.randint(1, b), rnd.randint(1, MAXF))]
    elif mode == "random":
        # costs up to the budget, fun anywhere
        items = [(rnd.randint(1, b), rnd.randint(1, MAXF)) for _ in range(n)]
    elif mode == "allfit":
        # everything fits: the answer is the sum of all fun (about 10^11, needs 64 bits)
        items = [(rnd.randint(1, b // n), rnd.randint(MAXF - 1000, MAXF)) for _ in range(n)]
    elif mode == "halves":
        # costs a bit below / above B / 2: which pair fits matters
        items = [(rnd.randint(b // 2 - 50, b // 2 + 50), rnd.randint(MAXF // 2, MAXF)) for _ in range(n)]
    elif mode == "pricey":
        # most activities cost more than the whole budget
        items = [(rnd.randint(b + 1, MAXC), MAXF) if rnd.random() < 0.7 else
                 (rnd.randint(1, b), rnd.randint(1, MAXF)) for _ in range(n)]
    elif mode == "even":
        # every cost is even and B is odd: the best plan never spends exactly B
        b = b - 1 if b % 2 == 0 else b
        items = [(2 * rnd.randint(1, b // 4), rnd.randint(1, MAXF)) for _ in range(n)]
    elif mode == "ratio":
        # one activity with the best fun-per-taka ratio blocks two better ones
        items = []
        for _ in range(n // 3):
            k = rnd.randint(100, 1000)
            items.append((k + 1, (k + 1) * 10 + 9))
            items.append((k, k * 10))
            items.append((k, k * 10))
        b = sum(c for c, _ in items) // 3 * 2
        b = min(b, MAXB)
        items = [(c, f) for c, f in items]
        rnd.shuffle(items)
    elif mode == "cheapstar":
        # one cheap activity with huge fun: picking it twice is the forward-loop bug
        items = [(1, MAXF)] + [(rnd.randint(b // 4, b), rnd.randint(1, MAXF // 10)) for _ in range(n - 1)]
        rnd.shuffle(items)
    elif mode == "smallvals":
        items = [(rnd.randint(1, 50), rnd.randint(1, 100)) for _ in range(n)]
    elif mode == "sameratio":
        # fun is exactly 7 x cost for everyone: greedy by ratio has no guidance
        items = [(c, 7 * c) for c in (rnd.randint(b // 10, b // 2) for _ in range(n))]
    else:
        raise SystemExit(f"unknown mode {mode}")
    emit(b, items)


main()
