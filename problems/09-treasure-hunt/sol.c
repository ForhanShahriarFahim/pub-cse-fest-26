#include <stdio.h>
#include <stdlib.h>

static int n, m;
static int *head, *nxt, *to, *dist, *que;

/* Fewest walkways from s to t (BFS), or -1 if t cannot be reached. */
static int bfs(int s, int t) {
    for (int i = 1; i <= n; i++) dist[i] = -1;
    int qh = 0, qt = 0;
    dist[s] = 0;
    que[qt++] = s;
    while (qh < qt) {
        int u = que[qh++];
        if (u == t) return dist[u];
        for (int e = head[u]; e != -1; e = nxt[e]) {
            int v = to[e];
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                que[qt++] = v;
            }
        }
    }
    return -1;
}

int main(void) {
    scanf("%d %d", &n, &m);
    head = malloc(sizeof(int) * (n + 1));
    dist = malloc(sizeof(int) * (n + 1));
    que = malloc(sizeof(int) * (n + 1));
    nxt = malloc(sizeof(int) * 2 * m);
    to = malloc(sizeof(int) * 2 * m);
    for (int i = 1; i <= n; i++) head[i] = -1;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        to[2 * i] = v; nxt[2 * i] = head[u]; head[u] = 2 * i;
        to[2 * i + 1] = u; nxt[2 * i + 1] = head[v]; head[v] = 2 * i + 1;
    }
    int k;
    scanf("%d", &k);
    long long total = 0;
    int at = 1, ok = 1;
    for (int i = 0; i < k; i++) {
        int c;
        scanf("%d", &c);
        if (!ok) continue;
        int d = bfs(at, c);
        if (d == -1) ok = 0;
        else total += d;
        at = c;
    }
    printf("%lld\n", ok ? total : -1LL);
    return 0;
}
