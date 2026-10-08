// Mistake: stops reading commands at the first blocked move.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> g(r);
    int x = 0, y = 0;
    for (int i = 0; i < r; i++) {
        cin >> g[i];
        for (int j = 0; j < c; j++)
            if (g[i][j] == 'S') x = i, y = j;
    }
    int k;
    string m;
    cin >> k >> m;
    vector<vector<bool>> seen(r, vector<bool>(c, false));
    seen[x][y] = true;
    int distinct = 1;
    for (char ch : m) {
        int nx = x, ny = y;
        if (ch == 'U') nx--;
        else if (ch == 'D') nx++;
        else if (ch == 'L') ny--;
        else ny++;
        if (nx < 0 || nx >= r || ny < 0 || ny >= c || g[nx][ny] == '#') break;
        x = nx, y = ny;
        if (!seen[x][y]) seen[x][y] = true, distinct++;
    }
    cout << x + 1 << " " << y + 1 << "\n" << distinct << "\n";
}
