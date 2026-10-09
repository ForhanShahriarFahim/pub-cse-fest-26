// Ignores the weights: two students per rickshaw, ceil(N / 2).
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    printf("%d\n", (n + 1) / 2);
}
