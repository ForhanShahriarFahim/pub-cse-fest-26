// Loops while l < r, so the last student left in the middle never gets a rickshaw.
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
    while (l < r) {
        if (w[l] + w[r] <= x) l++;
        r--;
        ans++;
    }
    printf("%d\n", ans);
}
