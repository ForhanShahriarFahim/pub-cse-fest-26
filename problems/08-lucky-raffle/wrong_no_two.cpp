// Forgets that 2 is prime (treats every even number as composite).
#include <bits/stdc++.h>
using namespace std;

const int M = 1000000;
bool composite[M + 1];
int cnt[M + 1];   // cnt[i] = number of primes in 1..i

int main() {
    for (int i = 2; (long long)i * i <= M; i++)
        if (!composite[i])
            for (int j = i * i; j <= M; j += i) composite[j] = true;
    for (int i = 1; i <= M; i++) cnt[i] = cnt[i - 1] + (i >= 3 && i % 2 == 1 && !composite[i]);
    int q;
    scanf("%d", &q);
    while (q--) {
        int l, r;
        scanf("%d %d", &l, &r);
        printf("%d\n", cnt[r] - cnt[l - 1]);
    }
    return 0;
}
