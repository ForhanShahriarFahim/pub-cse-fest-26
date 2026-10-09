// Stores the weights in a set, so students with equal weights are lost.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    set<long long> s;
    for (int i = 0; i < n; i++) { long long v; scanf("%lld", &v); s.insert(v); }
    vector<long long> w(s.begin(), s.end());
    int l = 0, r = (int)w.size() - 1, ans = 0;
    while (l <= r) {
        if (l < r && w[l] + w[r] <= x) l++;
        r--;
        ans++;
    }
    printf("%d\n", ans);
}
