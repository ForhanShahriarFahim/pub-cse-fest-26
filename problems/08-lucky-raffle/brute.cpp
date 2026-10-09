// Checks every ticket of every bundle by trial division. Only for small inputs.
#include <bits/stdc++.h>
using namespace std;

bool prime(int n) {
    if (n < 2) return false;
    for (int d = 2; d < n; d++)
        if (n % d == 0) return false;
    return true;
}

int main() {
    int q;
    cin >> q;
    while (q--) {
        int l, r, c = 0;
        cin >> l >> r;
        for (int x = l; x <= r; x++) c += prime(x);
        cout << c << "\n";
    }
}
