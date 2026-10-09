// Correct sieve, but walks from L to R for every query: O(Q * 10^6), TLE.
#include <bits/stdc++.h>
using namespace std;

const int M = 1000000;
bool composite[M + 1];
int cnt[M + 1];   // cnt[i] = number of primes in 1..i

int main() {
    for (int i = 2; (long long)i * i <= M; i++)
        if (!composite[i])
            for (int j = i * i; j <= M; j += i) composite[j] = true;
    for (int i = 1; i <= M; i++) cnt[i] = cnt[i - 1] + (i >= 2 && !composite[i]);
    int q;
    scanf("%d", &q);
    while (q--) {
        int l, r;
        scanf("%d %d", &l, &r);
        int c = 0;
        for (int x = l; x <= r; x++) c += (x >= 2 && !composite[x]);
        printf("%d\n", c);
    }
    return 0;
}
