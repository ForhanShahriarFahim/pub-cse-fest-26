// Uses DFS: the first path it finds is not always the shortest.
#include <bits/stdc++.h>
using namespace std;

int n, m;
vector<vector<int>> adj;

int dfs_len(int s, int t) {
    vector<int> depth(n + 1, -1);
    vector<size_t> it(n + 1, 0);
    vector<int> st = {s};
    depth[s] = 0;
    while (!st.empty()) {
        int u = st.back();
        if (u == t) return depth[u];
        if (it[u] < adj[u].size()) {
            int v = adj[u][it[u]++];
            if (depth[v] == -1) { depth[v] = depth[u] + 1; st.push_back(v); }
        } else {
            st.pop_back();
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
    int at = 1;
    bool ok = true;
    for (int i = 0; i < k; i++) {
        int c;
        scanf("%d", &c);
        if (!ok) continue;
        int d = dfs_len(at, c);
        if (d == -1) ok = false;
        else total += d;
        at = c;
    }
    printf("%lld\n", ok ? total : -1LL);
}
