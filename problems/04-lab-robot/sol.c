#include <stdio.h>

char g[100][105];
char m[100005];
int seen[100][100];

int main(void) {
    int r, c, k, x = 0, y = 0;
    scanf("%d %d", &r, &c);
    for (int i = 0; i < r; i++) {
        scanf("%104s", g[i]);
        for (int j = 0; j < c; j++)
            if (g[i][j] == 'S') { x = i; y = j; }
    }
    scanf("%d %100004s", &k, m);
    seen[x][y] = 1;
    int distinct = 1;
    for (int i = 0; i < k; i++) {
        int nx = x, ny = y;
        if (m[i] == 'U') nx--;
        else if (m[i] == 'D') nx++;
        else if (m[i] == 'L') ny--;
        else ny++;
        if (nx < 0 || nx >= r || ny < 0 || ny >= c || g[nx][ny] == '#') continue;
        x = nx; y = ny;
        if (!seen[x][y]) { seen[x][y] = 1; distinct++; }
    }
    printf("%d %d\n%d\n", x + 1, y + 1, distinct);
    return 0;
}
