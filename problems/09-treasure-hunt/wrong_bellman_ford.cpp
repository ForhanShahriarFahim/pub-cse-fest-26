// Bellman-Ford for every leg (relax all walkways until nothing changes): O(N * M), TLE.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    vector<int> eu(m), ev(m);
    for (int i = 0; i < m; i++) scanf("%d %d", &eu[i], &ev[i]);
    int k;
    scanf("%d", &k);
    const int INF = INT_MAX / 2;
    long long total = 0;
    int at = 1;
    bool ok = true;
    for (int i = 0; i < k; i++) {
        int c;
        scanf("%d", &c);
        if (!ok) continue;
        vector<int> d(n + 1, INF);
        d[at] = 0;
        for (bool changed = true; changed; ) {
            changed = false;
            for (int e = 0; e < m; e++) {
                int u = eu[e], v = ev[e];
                if (d[u] + 1 < d[v]) { d[v] = d[u] + 1; changed = true; }
                if (d[v] + 1 < d[u]) { d[u] = d[v] + 1; changed = true; }
            }
        }
        if (d[c] >= INF) ok = false;
        else total += d[c];
        at = c;
    }
    printf("%lld\n", ok ? total : -1LL);
}
