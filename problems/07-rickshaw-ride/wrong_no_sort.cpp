// Two pointers on the input order, without sorting first.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    vector<long long> w(n);
    for (auto &v : w) scanf("%lld", &v);
    int l = 0, r = n - 1, ans = 0;
    while (l <= r) {
        if (l < r && w[l] + w[r] <= x) l++;
        r--;
        ans++;
    }
    printf("%d\n", ans);
}
