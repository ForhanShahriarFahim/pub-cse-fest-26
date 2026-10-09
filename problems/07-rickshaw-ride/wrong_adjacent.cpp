// Sorts, then pairs neighbours from the lightest end: (w0,w1), (w2,w3), ...
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    vector<long long> w(n);
    for (auto &v : w) scanf("%lld", &v);
    sort(w.begin(), w.end());
    int ans = 0;
    for (int i = 0; i < n; ) {
        if (i + 1 < n && w[i] + w[i + 1] <= x) i += 2;
        else i += 1;
        ans++;
    }
    printf("%d\n", ans);
}
