"""python3 gen.py <mode> <seed> [args]   -> one input on stdout

Building 1 is always the main gate. Unless a mode says otherwise, the other building
numbers are shuffled and the walkways are printed in random order and direction.
"""
import random
import sys

MAXN, MAXM, MAXK = 10**5, 2 * 10**5, 10


def emit(n, edges, clues, rnd, shuffle=True):
    assert 2 <= n <= MAXN and 1 <= len(edges) <= MAXM and 1 <= len(clues) <= MAXK
    seen = set()
    for u, v in edges:
        assert 1 <= u <= n and 1 <= v <= n and u != v
        key = (min(u, v), max(u, v))
        assert key not in seen
        seen.add(key)
    prev = 1
    for c in clues:
        assert 1 <= c <= n and c != prev
        prev = c
    edges = list(edges)
    if shuffle:
        rnd.shuffle(edges)
        edges = [(u, v) if rnd.random() < 0.5 else (v, u) for u, v in edges]
    out = [f"{n} {len(edges)}"]
    out += [f"{u} {v}" for u, v in edges]
    out += [str(len(clues)), " ".join(map(str, clues))]
    print("\n".join(out))


def relabel(n, edges, clues, rnd, keep=1):
    """Shuffle building numbers, keeping building `keep` as building 1 (the gate)."""
    others = [i for i in range(1, n + 1) if i != keep]
    new = list(range(2, n + 1))
    rnd.shuffle(new)
    lab = {keep: 1, **dict(zip(others, new))}
    return [(lab[u], lab[v]) for u, v in edges], [lab[c] for c in clues]


def pick_clues(rnd, k, pool):
    clues, prev = [], 1
    for _ in range(k):
        c = rnd.choice(pool)
        while c == prev:
            c = rnd.choice(pool)
        clues.append(c)
        prev = c
    return clues


def random_connected(rnd, n, m, nodes=None):
    """Random spanning tree on `nodes` plus extra random walkways (m edges in total)."""
    nodes = nodes or list(range(1, n + 1))
    order = nodes[:]
    rnd.shuffle(order)
    edges, seen = [], set()
    for i in range(1, len(order)):
        u, v = order[i], order[rnd.randrange(i)]
        edges.append((u, v))
        seen.add((min(u, v), max(u, v)))
    while len(edges) < m:
        u, v = rnd.choice(nodes), rnd.choice(nodes)
        key = (min(u, v), max(u, v))
        if u != v and key not in seen:
            seen.add(key)
            edges.append((u, v))
    return edges


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    a = [int(x) for x in sys.argv[3:]]
    rnd = random.Random(seed)

    if mode == "small":
        # stress test against brute.cpp; often disconnected
        n = rnd.randint(2, 8)
        pairs = [(u, v) for u in range(1, n + 1) for v in range(u + 1, n + 1)]
        edges = rnd.sample(pairs, rnd.randint(1, len(pairs)))
        clues = pick_clues(rnd, rnd.randint(1, 5), list(range(1, n + 1)))
        emit(n, edges, clues, rnd)
    elif mode == "tiny":
        # N = 2: one walkway, one clue
        emit(2, [(1, 2)], [2], rnd)
    elif mode == "tinyfar":
        # building 3 is cut off from the gate
        emit(3, [(1, 2)], [3], rnd)
    elif mode == "random":
        n, m, k = a
        edges = random_connected(rnd, n, m)
        clues = pick_clues(rnd, k, list(range(1, n + 1)))
        emit(n, edges, clues, rnd)
    elif mode == "path":
        # one long line of buildings, gate at one end; clues bounce between the ends
        n, k = a
        edges = [(i, i + 1) for i in range(1, n)]
        clues = [n if i % 2 == 0 else 2 for i in range(k)]
        edges, clues = relabel(n, edges, clues, rnd)
        emit(n, edges, clues, rnd)
    elif mode == "grid":
        # r x c grid of buildings; the gate is a random cell
        r, c, k = a
        idx = lambda i, j: i * c + j + 1
        edges = []
        for i in range(r):
            for j in range(c):
                if i + 1 < r:
                    edges.append((idx(i, j), idx(i + 1, j)))
                if j + 1 < c:
                    edges.append((idx(i, j), idx(i, j + 1)))
        n = r * c
        gate = rnd.randint(1, n)
        corners = [idx(0, 0), idx(0, c - 1), idx(r - 1, 0), idx(r - 1, c - 1)]
        clues = pick_clues(rnd, k, [x for x in corners if x != gate] + [rnd.randint(1, n) for _ in range(4)])
        clues = [x for x in clues]
        # make sure no clue is the gate itself before relabelling
        clues = [x if x != gate else (x % n) + 1 for x in clues]
        fixed, prev = [], gate
        for x in clues:
            if x == prev:
                x = (x % n) + 1
                if x == gate:
                    x = (x % n) + 1
            fixed.append(x)
            prev = x
        edges, clues = relabel(n, edges, fixed, rnd, keep=gate)
        emit(n, edges, clues, rnd)
    elif mode == "star":
        # every building is joined to one hub; hub is the gate or a random building
        n, k, hub_is_gate = a
        hub = 1 if hub_is_gate else 2
        edges = [(hub, i) for i in range(1, n + 1) if i != hub]
        clues = pick_clues(rnd, k, list(range(2, n + 1)))
        edges, clues = relabel(n, edges, clues, rnd)
        emit(n, edges, clues, rnd)
    elif mode == "cycle":
        # one big ring; the clues sit at roughly opposite points
        n, k = a
        edges = [(i, i % n + 1) for i in range(1, n + 1)]
        clues, prev = [], 1
        for i in range(k):
            target = (prev - 1 + n // 2 + rnd.randint(-5, 5)) % n + 1
            if target == prev:
                target = prev % n + 1
            clues.append(target)
            prev = target
        edges, clues = relabel(n, edges, clues, rnd)
        emit(n, edges, clues, rnd)
    elif mode == "twocomp":
        # two separate parts of the campus; clue number `bad` (1-based) is in the far part
        n, m, k, bad = a
        half = n // 2
        near, far = list(range(1, half + 1)), list(range(half + 1, n + 1))
        edges = random_connected(rnd, half, m // 2, near) + random_connected(rnd, n - half, m - m // 2, far)
        clues, prev = [], 1
        for i in range(1, k + 1):
            pool = far if i == bad else near
            c = rnd.choice(pool)
            while c == prev:
                c = rnd.choice(pool)
            clues.append(c)
            prev = c
        edges, clues = relabel(n, edges, clues, rnd)
        emit(n, edges, clues, rnd)
    elif mode == "lonelygate":
        # the gate has no walkways at all
        n, m, k = a
        edges = random_connected(rnd, n - 1, m, list(range(2, n + 1)))
        clues = pick_clues(rnd, k, list(range(2, n + 1)))
        edges, clues = relabel(n, edges, clues, rnd)
        emit(n, edges, clues, rnd)
    elif mode == "dense":
        # few buildings, almost every pair joined
        n, m, k = a
        pairs = [(u, v) for u in range(1, n + 1) for v in range(u + 1, n + 1)]
        edges = rnd.sample(pairs, m)
        clues = pick_clues(rnd, k, list(range(1, n + 1)))
        emit(n, edges, clues, rnd)
    elif mode == "caterpillar":
        # a long spine with short legs: deep tree, unique paths
        n, k = a
        spine = n // 2
        edges = [(i, i + 1) for i in range(1, spine)]
        for v in range(spine + 1, n + 1):
            edges.append((v, rnd.randint(1, spine)))
        leaves = list(range(spine + 1, n + 1))
        clues = pick_clues(rnd, k, leaves[:50] + leaves[-50:] + [spine])
        edges, clues = relabel(n, edges, clues, rnd)
        emit(n, edges, clues, rnd)
    elif mode == "ladder":
        # two long rails with rungs: many equal shortest paths, DFS wanders far
        n, k = a
        half = n // 2
        edges = [(i, i + 1) for i in range(1, half)] + [(half + i, half + i + 1) for i in range(1, half)]
        edges += [(i, half + i) for i in range(1, half + 1, 7)]
        nn = 2 * half
        clues = [half if i % 2 == 0 else 2 * half for i in range(k)]
        clues = [c if c != 1 else 2 for c in clues]
        prev, fixed = 1, []
        for c in clues:
            fixed.append(c if c != prev else c - 1)
            prev = fixed[-1]
        edges, clues = relabel(nn, edges, fixed, rnd)
        emit(nn, edges, clues, rnd)
    else:
        raise SystemExit(f"unknown mode {mode}")


main()
