// Mistake: everything in 32-bit int.
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t; scanf("%d", &t);
    while (t--) {
        int n, v, j, k, c; scanf("%d %d %d %d %d", &n, &v, &j, &k, &c);
        int people = 3 * n + v + j;
        int packs = (people + k - 1) / k;
        printf("%d %d\n", packs, packs * c);
    }
}
