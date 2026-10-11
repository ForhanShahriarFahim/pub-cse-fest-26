// Tries every subset by recursion: 2^N choices, TLE for N = 100.
#include <bits/stdc++.h>
using namespace std;

int n;
vector<long long> c, f;

long long go(int i, long long left) {
    if (i == n) return 0;
    long long best = go(i + 1, left);
    if (c[i] <= left) best = max(best, f[i] + go(i + 1, left - c[i]));
    return best;
}

int main() {
    long long b;
    scanf("%d %lld", &n, &b);
    c.resize(n); f.resize(n);
    for (int i = 0; i < n; i++) scanf("%lld %lld", &c[i], &f[i]);
    printf("%lld\n", go(0, b));
}
