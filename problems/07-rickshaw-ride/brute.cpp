// Tries every way to seat the students (alone or in pairs). Only for small N.
#include <bits/stdc++.h>
using namespace std;

int n;
long long x;
vector<long long> w;
vector<bool> used;

int best(int i) {
    while (i < n && used[i]) i++;
    if (i == n) return 0;
    used[i] = true;
    int res = 1 + best(i + 1);                       // student i rides alone
    for (int j = i + 1; j < n; j++)
        if (!used[j] && w[i] + w[j] <= x) {          // student i rides with j
            used[j] = true;
            res = min(res, 1 + best(i + 1));
            used[j] = false;
        }
    used[i] = false;
    return res;
}

int main() {
    cin >> n >> x;
    w.resize(n);
    used.assign(n, false);
    for (auto &v : w) cin >> v;
    cout << best(0) << "\n";
}
