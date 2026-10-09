// Precomputes with trial division but stops at d * d < n, so 4, 9, 25, 49, ... look prime.
#include <bits/stdc++.h>
using namespace std;

const int M = 1000000;
int cnt[M + 1];

bool prime(int n) {
    if (n < 2) return false;
    for (int d = 2; d * d < n; d++)
        if (n % d == 0) return false;
    return true;
}

int main() {
    for (int i = 1; i <= M; i++) cnt[i] = cnt[i - 1] + prime(i);
    int q;
    scanf("%d", &q);
    while (q--) {
        int l, r;
        scanf("%d %d", &l, &r);
        printf("%d\n", cnt[r] - cnt[l - 1]);
    }
}
