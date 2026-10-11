// Tries every subset of activities. Only for small N.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long b;
    cin >> n >> b;
    vector<long long> c(n), f(n);
    for (int i = 0; i < n; i++) cin >> c[i] >> f[i];
    long long best = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        long long cost = 0, fun = 0;
        for (int i = 0; i < n; i++)
            if (mask >> i & 1) { cost += c[i]; fun += f[i]; }
        if (cost <= b) best = max(best, fun);
    }
    cout << best << "\n";
}
