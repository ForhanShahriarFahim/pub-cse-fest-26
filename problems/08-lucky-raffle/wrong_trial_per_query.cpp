// Checks every ticket of every bundle by trial division up to sqrt: far too slow (TLE).
#include <bits/stdc++.h>
using namespace std;

bool prime(int n) {
    if (n < 2) return false;
    for (int d = 2; (long long)d * d <= n; d++)
        if (n % d == 0) return false;
    return true;
}

int main() {
    int q;
    scanf("%d", &q);
    while (q--) {
        int l, r, c = 0;
        scanf("%d %d", &l, &r);
        for (int x = l; x <= r; x++) c += prime(x);
        printf("%d\n", c);
    }
}
