#include <stdio.h>
#include <string.h>

int acTime[101][26], rejected[101][26], solved[101], penalty[101];

int main(void) {
    int t, p, n;
    scanf("%d %d %d", &t, &p, &n);
    memset(acTime, -1, sizeof acTime);
    for (int i = 0; i < n; i++) {
        int minute, team;
        char prob, verdict[8];
        scanf("%d %d %c %7s", &minute, &team, &prob, verdict);
        int j = prob - 'A';
        if (acTime[team][j] != -1) continue;
        if (strcmp(verdict, "AC") == 0) acTime[team][j] = minute;
        else if (strcmp(verdict, "CE") != 0) rejected[team][j]++;
    }
    for (int i = 1; i <= t; i++) {
        for (int j = 0; j < p; j++) {
            if (acTime[i][j] == -1) continue;
            solved[i]++;
            penalty[i] += acTime[i][j] + 20 * rejected[i][j];
        }
        printf("%d %d\n", solved[i], penalty[i]);
    }
    int best = 1;
    for (int i = 2; i <= t; i++)
        if (solved[i] > solved[best] || (solved[i] == solved[best] && penalty[i] < penalty[best]))
            best = i;
    printf("%d\n", best);
    return 0;
}
