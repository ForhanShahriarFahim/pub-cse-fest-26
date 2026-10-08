// Mistake: counts each team as one person.
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d", &t);
    while (t--) {
        long long n, v, j, k, c; scanf("%lld %lld %lld %lld %lld", &n, &v, &j, &k, &c);
        long long people = n + v + j;
        long long packs = (people + k - 1) / k;
        printf("%lld %lld\n", packs, packs * c);
    }
}
