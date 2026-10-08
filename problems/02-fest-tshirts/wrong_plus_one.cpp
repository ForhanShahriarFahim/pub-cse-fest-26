// Mistake: people / k + 1, which is wrong when k divides people.
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d", &t);
    while (t--) {
        long long n, v, j, k, c; scanf("%lld %lld %lld %lld %lld", &n, &v, &j, &k, &c);
        long long packs = (3 * n + v + j) / k + 1;
        printf("%lld %lld\n", packs, packs * c);
    }
}
