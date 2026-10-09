// Floyd-Warshall on all pairs, then add up the legs. Only for small N.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    const int INF = 1e9;
    vector<vector<int>> d(n + 1, vector<int>(n + 1, INF));
    for (int i = 1; i <= n; i++) d[i][i] = 0;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        d[u][v] = d[v][u] = 1;
    }
    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
    int k;
    cin >> k;
    long long total = 0;
    int at = 1;
    bool ok = true;
    for (int i = 0; i < k; i++) {
        int c;
        cin >> c;
        if (d[at][c] >= INF) ok = false;
        else total += d[at][c];
        at = c;
    }
    cout << (ok ? total : -1) << "\n";
}
