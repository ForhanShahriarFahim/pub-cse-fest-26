// 2D DP that forgets the option of skipping an activity it can afford.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, b;
    scanf("%d %d", &n, &b);
    vector<vector<long long>> dp(n + 1, vector<long long>(b + 1, 0));
    for (int i = 1; i <= n; i++) {
        int c;
        long long f;
        scanf("%d %lld", &c, &f);
        for (int j = 0; j <= b; j++)
            dp[i][j] = (j >= c) ? dp[i - 1][j - c] + f : dp[i - 1][j];
    }
    printf("%lld\n", dp[n][b]);
}
