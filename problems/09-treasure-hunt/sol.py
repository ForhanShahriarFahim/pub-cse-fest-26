import sys
from collections import deque


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    pos = 2
    for _ in range(m):
        u, v = int(data[pos]), int(data[pos + 1])
        pos += 2
        adj[u].append(v)
        adj[v].append(u)
    k = int(data[pos])
    clues = [int(x) for x in data[pos + 1:pos + 1 + k]]

    def bfs(s, t):
        """Fewest walkways from s to t, or -1 if t cannot be reached."""
        dist = [-1] * (n + 1)
        dist[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            if u == t:
                return dist[u]
            du = dist[u] + 1
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = du
                    q.append(v)
        return -1

    total, at = 0, 1   # the team starts at the main gate
    for c in clues:
        d = bfs(at, c)
        if d == -1:
            print(-1)
            return
        total += d
        at = c
    print(total)


main()
