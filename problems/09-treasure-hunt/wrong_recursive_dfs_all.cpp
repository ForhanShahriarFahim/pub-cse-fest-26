// Tries every simple path with recursion and keeps the shortest: exponential, TLE.
#include <bits/stdc++.h>
using namespace std;

int n, m, best;
vector<vector<int>> adj;
vector<char> on_path;

void go(int u, int t, int len) {
    if (len >= best) return;
    if (u == t) { best = len; return; }
    on_path[u] = 1;
    for (int v : adj[u])
        if (!on_path[v]) go(v, t, len + 1);
    on_path[u] = 0;
}

int main() {
    scanf("%d %d", &n, &m);
    adj.assign(n + 1, {});
    on_path.assign(n + 1, 0);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    int k;
    scanf("%d", &k);
    long long total = 0;
    int at = 1;
    bool ok = true;
    for (int i = 0; i < k; i++) {
        int c;
        scanf("%d", &c);
        if (!ok) continue;
        best = INT_MAX;
        go(at, c, 0);
        if (best == INT_MAX) ok = false;
        else total += best;
        at = c;
    }
    printf("%lld\n", ok ? total : -1LL);
}
