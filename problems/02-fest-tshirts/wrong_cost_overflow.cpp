// Mistake: packs fits in long long, but cost is multiplied in int.
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d", &t);
    while (t--) {
        long long n, v, j, k; int c;
        scanf("%lld %lld %lld %lld %d", &n, &v, &j, &k, &c);
        long long people = 3 * n + v + j;
        int packs = (people + k - 1) / k;
        long long cost = packs * c;
        printf("%d %lld\n", packs, cost);
    }
}
