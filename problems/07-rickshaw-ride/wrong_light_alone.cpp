// When the lightest and heaviest do not fit, sends the LIGHTEST alone (wrong pointer).
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    vector<long long> w(n);
    for (auto &v : w) scanf("%lld", &v);
    sort(w.begin(), w.end());
    int l = 0, r = n - 1, ans = 0;
    while (l <= r) {
        if (l < r && w[l] + w[r] <= x) { l++; r--; }
        else l++;
        ans++;
    }
    printf("%d\n", ans);
}
