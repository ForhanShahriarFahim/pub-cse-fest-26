// Tries all 26 keys and keeps the one whose decryption ends with "Coder". Small inputs only.
#include <bits/stdc++.h>
using namespace std;

string shiftBack(string s, int k) {
    for (char &c : s) {
        if (islower((unsigned char)c)) c = 'a' + (c - 'a' + 26 - k) % 26;
        else if (isupper((unsigned char)c)) c = 'A' + (c - 'A' + 26 - k) % 26;
    }
    return s;
}

int main() {
    string line;
    getline(cin, line);
    int t = stoi(line);
    while (t--) {
        getline(cin, line);
        for (int k = 0; k < 26; k++) {
            string d = shiftBack(line, k);
            if (d.size() >= 5 && d.substr(d.size() - 5) == "Coder") { cout << d << "\n"; break; }
        }
    }
}
