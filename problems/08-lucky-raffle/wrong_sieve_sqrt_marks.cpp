// Sieve only crosses out multiples of primes below 100 (outer loop bound too small),
// so composites like 101 * 103 = 10403 stay "prime".
#include <bits/stdc++.h>
using namespace std;

const int M = 1000000;
bool composite[M + 1];
int cnt[M + 1];

int main() {
    for (int i = 2; i < 100; i++)
        if (!composite[i])
            for (int j = i * i; j <= M; j += i) composite[j] = true;
    for (int i = 1; i <= M; i++) cnt[i] = cnt[i - 1] + (i >= 2 && !composite[i]);
    int q;
    scanf("%d", &q);
    while (q--) {
        int l, r;
        scanf("%d %d", &l, &r);
        printf("%d\n", cnt[r] - cnt[l - 1]);
    }
}
