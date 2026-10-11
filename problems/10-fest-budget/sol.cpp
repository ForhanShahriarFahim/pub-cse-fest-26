#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, b;
    scanf("%d %d", &n, &b);
    // dp[j] = most fun with total cost at most j, using the activities seen so far
    vector<long long> dp(b + 1, 0);
    for (int i = 0; i < n; i++) {
        int c;
        long long f;
        scanf("%d %lld", &c, &f);
        for (int j = b; j >= c; j--)          // backwards: each activity at most once
            dp[j] = max(dp[j], dp[j - c] + f);
    }
    printf("%lld\n", dp[b]);
    return 0;
}
