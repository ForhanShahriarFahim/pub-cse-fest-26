#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n, b;
    scanf("%d %d", &n, &b);
    long long *dp = calloc(b + 1, sizeof(long long));
    for (int i = 0; i < n; i++) {
        int c;
        long long f;
        scanf("%d %lld", &c, &f);
        for (int j = b; j >= c; j--)
            if (dp[j - c] + f > dp[j]) dp[j] = dp[j - c] + f;
    }
    printf("%lld\n", dp[b]);
    free(dp);
    return 0;
}
