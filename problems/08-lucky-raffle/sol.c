#include <stdio.h>

#define M 1000000
static char composite[M + 1];
static int cnt[M + 1];

int main(void) {
    for (long long i = 2; i * i <= M; i++)
        if (!composite[i])
            for (long long j = i * i; j <= M; j += i) composite[j] = 1;
    for (int i = 1; i <= M; i++) cnt[i] = cnt[i - 1] + (i >= 2 && !composite[i]);
    int q;
    scanf("%d", &q);
    while (q--) {
        int l, r;
        scanf("%d %d", &l, &r);
        printf("%d\n", cnt[r] - cnt[l - 1]);
    }
    return 0;
}
