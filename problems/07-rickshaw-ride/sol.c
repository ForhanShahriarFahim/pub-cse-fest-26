#include <stdio.h>
#include <stdlib.h>

static int cmp(const void *a, const void *b) {
    long long x = *(const long long *)a, y = *(const long long *)b;
    return (x > y) - (x < y);
}

int main(void) {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    long long *w = malloc(sizeof(long long) * n);
    for (int i = 0; i < n; i++) scanf("%lld", &w[i]);
    qsort(w, n, sizeof(long long), cmp);
    int l = 0, r = n - 1, rickshaws = 0;
    while (l <= r) {
        if (l < r && w[l] + w[r] <= x) l++;
        r--;
        rickshaws++;
    }
    printf("%d\n", rickshaws);
    free(w);
    return 0;
}
