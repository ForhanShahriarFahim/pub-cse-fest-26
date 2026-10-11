// Greedy: takes activities in order of most fun first while the money lasts.
#include <bits/stdc++.h>
using namespace std;

struct Act { long long c, f; };

int main() {
    int n;
    long long b;
    scanf("%d %lld", &n, &b);
    vector<Act> a(n);
    for (auto &x : a) scanf("%lld %lld", &x.c, &x.f);
    sort(a.begin(), a.end(), [](const Act &a, const Act &b) { return a.f > b.f; });
    long long fun = 0;
    for (auto &x : a)
        if (x.c <= b) { b -= x.c; fun += x.f; }
    printf("%lld\n", fun);
}
