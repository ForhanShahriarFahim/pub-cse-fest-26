// Correct greedy (heaviest rides with the heaviest partner that fits) but O(N^2): TLE.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    vector<long long> w(n);
    for (auto &v : w) scanf("%lld", &v);
    sort(w.begin(), w.end());
    vector<char> used(n, 0);
    int ans = 0;
    for (int i = n - 1; i >= 0; i--) {
        if (used[i]) continue;
        used[i] = 1;
        for (int j = i - 1; j >= 0; j--)
            if (!used[j] && w[i] + w[j] <= x) { used[j] = 1; break; }
        ans++;
    }
    printf("%d\n", ans);
}
