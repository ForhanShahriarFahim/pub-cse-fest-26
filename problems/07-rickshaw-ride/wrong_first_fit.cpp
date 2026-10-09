// Takes students in input order; each joins the first half-full rickshaw that fits.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    long long x;
    scanf("%d %lld", &n, &x);
    vector<long long> w(n);
    for (auto &v : w) scanf("%lld", &v);
    vector<long long> single;          // rickshaws that still have one free seat
    vector<bool> open;
    int ans = 0;
    for (int i = 0; i < n; i++) {
        bool seated = false;
        for (size_t j = 0; j < single.size(); j++)
            if (open[j] && single[j] + w[i] <= x) { open[j] = false; seated = true; break; }
        if (!seated) { single.push_back(w[i]); open.push_back(true); ans++; }
    }
    printf("%d\n", ans);
}
