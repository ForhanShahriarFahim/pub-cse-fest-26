# Editorial: Fest Treasure Hunt (Medium)

**Idea.** The legs are independent. The team walks gate → c₁, then c₁ → c₂, ...,
then cₖ₋₁ → cₖ, and the best total is the sum of the shortest distance of each leg.
If any leg is impossible, the answer is -1.

Every walkway has the same "length" (one walkway), so the shortest distance from
one building to another is found with **Breadth-First Search (BFS)**. BFS visits
buildings in order of distance: first the start (distance 0), then all its
neighbours (distance 1), then their unvisited neighbours (distance 2), and so on.
The first time BFS reaches a building, that is its shortest distance.

Run one BFS per leg, which is at most K = 10 BFS runs.

```
total = 0, at = 1
for each clue c:
    d = BFS(at, c)            # -1 if c is never reached
    if d == -1: print -1 and stop
    total += d
    at = c
print total

BFS(s, t):
    dist[1..N] = -1           # fresh for EVERY leg
    dist[s] = 0, queue = [s]
    while queue not empty:
        u = pop front
        if u == t: return dist[u]
        for every neighbour v of u:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                push v
    return -1
```

**Storing the campus:** use an adjacency list (`vector<int> adj[N + 1]` in C++,
`ArrayList` in Java, a list of lists in Python). Add every walkway **twice**:
`adj[u].push_back(v)` and `adj[v].push_back(u)`. An N × N matrix would need
10¹⁰ cells and does not fit in memory.

**Traps (each one is caught by the official tests):**

| Mistake | Why it fails |
|---|---|
| Not resetting `dist` / `visited` before each BFS | The second leg thinks most buildings are already visited. Sample: wrong answer. |
| Adding each walkway in one direction only | Walkways go both ways. Sample: wrong answer. |
| Measuring every clue from the gate | Each leg starts at the previous clue, not at the gate. Sample: 6 instead of 7. |
| Only walking from the gate to the last clue | The clues must be collected in order. Sample: 3. |
| Starting at clue 1 | The walk from the gate to clue 1 counts too. Sample: 5. |
| Ignoring an unreachable clue, or adding -1 to the total | The answer must be -1 as soon as one clue cannot be reached. |
| DFS instead of BFS | The first path DFS finds is not always the shortest. Sample: its first leg is 1 → 2 → 3 → 4 → 5 (4 walkways), and its total is 13. |
| Trying every path with recursion | Exponentially many paths. Time limit exceeded. |
| Bellman-Ford (relax all walkways until nothing changes) | O(N · M) per leg; it takes about a minute on a long line of buildings. |

**Size of the answer:** each leg is at most N − 1 walkways, so the total is below
10 × 10⁵ = 10⁶, which fits in an `int`.

**Complexity:** each BFS is O(N + M), so the whole solution is O(K · (N + M)),
about 3 × 10⁶ steps at most.
