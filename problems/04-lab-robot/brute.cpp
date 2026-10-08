// Records the whole path, then counts distinct cells by sorting. Small inputs only.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> g(r);
    for (auto &row : g) cin >> row;
    int k;
    string m;
    cin >> k >> m;
    pair<int, int> p;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (g[i][j] == 'S') p = {i, j};
    vector<pair<int, int>> path = {p};
    for (char ch : m) {
        pair<int, int> q = p;
        if (ch == 'U') q.first -= 1;
        if (ch == 'D') q.first += 1;
        if (ch == 'L') q.second -= 1;
        if (ch == 'R') q.second += 1;
        bool inside = q.first >= 0 && q.first < r && q.second >= 0 && q.second < c;
        if (inside && g[q.first][q.second] != '#') p = q;
        path.push_back(p);
    }
    sort(path.begin(), path.end());
    path.erase(unique(path.begin(), path.end()), path.end());
    cout << p.first + 1 << " " << p.second + 1 << "\n" << path.size() << "\n";
}
