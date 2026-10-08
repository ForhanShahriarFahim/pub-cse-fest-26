// Mistake: forgets that serial 0000 is invalid.
#include <bits/stdc++.h>
using namespace std;

bool valid(const string &s) {
    if (s.size() != 11) return false;
    if (s.substr(0, 3) != "CSE") return false;
    if (s[3] != '-' || s[6] != '-') return false;
    for (int i : {4, 5, 7, 8, 9, 10})
        if (!isdigit((unsigned char)s[i])) return false;
    int year = (s[4] - '0') * 10 + (s[5] - '0');
    if (year < 20 || year > 26) return false;
    
    return true;
}

int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        cout << (valid(s) ? "VALID" : "INVALID") << "\n";
    }
}
