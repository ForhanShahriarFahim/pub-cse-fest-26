// Skips an unreachable clue (adds nothing) instead of printing -1.
#include <bits/stdc++.h>
using namespace std;

int n, m;
vector<vector<int>> adj;

// Fewest walkways from s to t (BFS), or -1 if t cannot be reached.
int bfs(int s, int t) {
    vector<int> dist(n + 1, -1);
    queue<int> q;
    dist[s] = 0;
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        if (u == t) return dist[u];
        for (int v : adj[u])
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
    }
    return -1;
}

int main() {
    scanf("%d %d", &n, &m);
    adj.assign(n + 1, {});
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    int k;
    scanf("%d", &k);
    long long total = 0;
    int at = 1;   // the team starts at the main gate
    bool ok = true;
    for (int i = 0; i < k; i++) {
        int c;
        scanf("%d", &c);
        if (!ok) continue;
        int d = bfs(at, c);
        if (d != -1) total += d;
        at = c;
    }
    printf("%lld\n", ok ? total : -1LL);
    return 0;
}
