// Independent check with a regular expression.
#include <bits/stdc++.h>
using namespace std;

int main() {
    regex pat("CSE-2[0-6]-(?!0000)[0-9]{4}");
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        cout << (regex_match(s, pat) ? "VALID" : "INVALID") << "\n";
    }
}
