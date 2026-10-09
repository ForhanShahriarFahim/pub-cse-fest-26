// Sieves only up to 10^5 (misread bound); bigger tickets are never counted.
#include <bits/stdc++.h>
using namespace std;

const int M = 1000000, S = 100000;
bool composite[M + 1];
int cnt[M + 1];

int main() {
    for (int i = 2; (long long)i * i <= S; i++)
        if (!composite[i])
            for (int j = i * i; j <= S; j += i) composite[j] = true;
    for (int i = 1; i <= M; i++) cnt[i] = cnt[i - 1] + (i >= 2 && i <= S && !composite[i]);
    int q;
    scanf("%d", &q);
    while (q--) {
        int l, r;
        scanf("%d %d", &l, &r);
        printf("%d\n", cnt[r] - cnt[l - 1]);
    }
}
