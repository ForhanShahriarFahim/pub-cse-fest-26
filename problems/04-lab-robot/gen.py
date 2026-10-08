"""python3 gen.py <mode> <seed> [R C K desk_percent]"""
import random
import sys


def emit(grid, moves):
    print(len(grid), len(grid[0]))
    for row in grid:
        print("".join(row))
    print(len(moves))
    print("".join(moves))


def random_grid(rnd, r, c, pct):
    g = [["#" if rnd.randrange(100) < pct else "." for _ in range(c)] for _ in range(r)]
    sx, sy = rnd.randrange(r), rnd.randrange(c)
    g[sx][sy] = "S"
    return g


def biased_moves(rnd, k):
    """Random walk that keeps a direction for a while, so it reaches walls and edges."""
    moves = []
    while len(moves) < k:
        moves += [rnd.choice("UDLR")] * rnd.randint(1, 12)
    return moves[:k]


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    rnd = random.Random(seed)
    args = [int(a) for a in sys.argv[3:]]
    if mode == "small":
        r, c = rnd.randint(1, 6), rnd.randint(1, 6)
        g = random_grid(rnd, r, c, rnd.choice([0, 20, 40, 70]))
        emit(g, biased_moves(rnd, rnd.randint(1, 25)))
    elif mode == "random":
        r, c, k, pct = args
        emit(random_grid(rnd, r, c, pct), biased_moves(rnd, k))
    elif mode == "one":           # 1x1 lab: every move is blocked
        emit([["S"]], [rnd.choice("UDLR") for _ in range(args[0])])
    elif mode == "boxed":         # robot surrounded by desks
        r, c, k = args
        g = random_grid(rnd, r, c, 30)
        for i in range(r):
            for j in range(c):
                if g[i][j] == "S":
                    for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        if 0 <= i + di < r and 0 <= j + dj < c:
                            g[i + di][j + dj] = "#"
        emit(g, biased_moves(rnd, k))
    elif mode == "snake":         # empty lab, snake walk visits every cell many times
        r, c, k = args
        g = [["."] * c for _ in range(r)]
        g[0][0] = "S"
        lap = []
        for i in range(r):
            lap += ["R" if i % 2 == 0 else "L"] * (c - 1)
            lap.append("D")
        lap += ["U"] * r  # bump into the top edge and come back
        moves = (lap * (k // len(lap) + 1))[:k]
        emit(g, moves)
    elif mode == "line":          # single row or column with a few desks
        r, c, k = args
        g = random_grid(rnd, r, c, 15)
        emit(g, biased_moves(rnd, k))
    else:
        raise SystemExit(f"unknown mode {mode}")


main()
