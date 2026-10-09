#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    vector<long long> w(n);
    for (auto &v : w) scanf("%lld", &v);
    sort(w.begin(), w.end());
    // The heaviest student (r) rides with the lightest (l) if they fit, otherwise alone.
    int l = 0, r = n - 1, rickshaws = 0;
    while (l <= r) {
        if (l < r && w[l] + w[r] <= x) l++;
        r--;
        rickshaws++;
    }
    printf("%d\n", rickshaws);
    return 0;
}
