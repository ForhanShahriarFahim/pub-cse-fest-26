// Buys packs one at a time until everyone has a shirt. Only for small inputs.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, v, j, k, c;
        cin >> n >> v >> j >> k >> c;
        long long people = 0;
        for (int i = 0; i < n; i++) people += 3;
        for (int i = 0; i < v; i++) people++;
        for (int i = 0; i < j; i++) people++;
        long long packs = 0, shirts = 0, cost = 0;
        while (shirts < people) {
            packs++;
            shirts += k;
            cost += c;
        }
        cout << packs << " " << cost << "\n";
    }
}
