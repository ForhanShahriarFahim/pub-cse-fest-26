// Mistake: ceil() on a float loses precision for large values.
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d", &t);
    while (t--) {
        long long n, v, j, k, c; scanf("%lld %lld %lld %lld %lld", &n, &v, &j, &k, &c);
        long long people = 3 * n + v + j;
        long long packs = (long long)ceil((float)people / (float)k);
        printf("%lld %lld\n", packs, packs * c);
    }
}
