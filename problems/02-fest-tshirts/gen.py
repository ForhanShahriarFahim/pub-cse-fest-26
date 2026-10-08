"""python3 gen.py <mode> <seed> [T]"""
import random
import sys

MX = 10**9


def emit(cases):
    print(len(cases))
    for case in cases:
        print(*case)


def edge_cases():
    cases = [
        (1, 0, 0, 1, 1),              # smallest input
        (1, 0, 0, 3, 7),              # one team, exactly one pack
        (1, 0, 0, 4, 7),              # pack larger than needed
        (1, 0, 0, 2, 7),              # 3 people, packs of 2 -> 2 packs
        (1, 1, 0, 2, 5),              # 4 people, divisible
        (5, 0, 0, MX, MX),            # one huge pack
        (MX, 0, 0, 1, 1),             # 3e9 people: overflows int
        (MX, MX, MX, 1, MX),          # largest possible cost 5e18
        (MX, MX, MX, MX, MX),         # 5 packs
        (MX, MX, MX - 1, MX, 1),      # 5e9 - 1 people -> 5 packs
        (MX, MX, MX, MX - 1, 3),      # just above a multiple
        (715827883, 0, 0, 1, 1),      # 3n just above 2^31
        (1, 0, 0, 1, MX),             # 3 packs * 1e9 overflows int cost
        (333333333, 1, 0, 1000000000, MX),  # exactly 1e9 people
        (2, 3, 1, 5, 120),            # 10 people, divisible
        (17, 6, 4, 61, 999999937),
    ]
    return cases


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    t = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    rnd = random.Random(seed)
    if mode == "small":
        t = rnd.randint(1, 10)
        emit([(rnd.randint(1, 20), rnd.randint(0, 20), rnd.randint(0, 20),
               rnd.randint(1, 15), rnd.randint(1, 100)) for _ in range(t)])
    elif mode == "edge":
        emit(edge_cases())
    elif mode == "random":
        # mixed magnitudes so some cases are small and some are huge
        def val(lo):
            return rnd.randint(lo, 10 ** rnd.randint(1, 9))
        emit([(val(1), val(0), val(0), val(1), val(1)) for _ in range(t)])
    elif mode == "big":
        emit([(rnd.randint(MX // 2, MX), rnd.randint(MX // 2, MX), rnd.randint(MX // 2, MX),
               rnd.randint(1, 1000), rnd.randint(MX // 2, MX)) for _ in range(t)])
    elif mode == "divisible":
        # people is an exact multiple of k (or one away from it): catches people/k + 1
        cases = []
        for _ in range(t):
            k = rnd.randint(1, 10**5)
            packs = rnd.randint(1, 10**4)
            target = k * packs + rnd.choice([0, 0, 0, -1, 1])
            n = max(1, target // 3 - rnd.randint(0, min(target // 3 - 1, 1000)) if target >= 6 else 1)
            rest = max(0, target - 3 * n)
            v = rnd.randint(0, rest)
            cases.append((n, v, rest - v, k, rnd.randint(1, MX)))
        emit(cases)
    elif mode == "floatkill":
        # large people with small k: float ceil is off, int overflows
        cases = []
        for _ in range(t):
            n, v, j = rnd.randint(MX // 2, MX), rnd.randint(0, MX), rnd.randint(0, MX)
            people = 3 * n + v + j
            k = rnd.randint(1, 50)
            if rnd.random() < 0.5:   # make k divide people
                v = max(0, v - people % k)
            cases.append((n, v, j, k, rnd.randint(1, MX)))
        emit(cases)
    elif mode == "max":
        emit([(MX, MX, MX, 1, MX)] * t)
    else:
        raise SystemExit(f"unknown mode {mode}")


main()
