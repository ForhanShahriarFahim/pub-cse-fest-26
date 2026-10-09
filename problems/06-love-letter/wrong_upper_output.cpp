// Mistake: prints the message in uppercase.
#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    int t = stoi(line);
    while (t--) {
        string s;
        getline(cin, s);
        int n = s.size();
        // The original letter ends with "Coder", so its 5th-last character was 'C'.
        int k = (s[n - 5] - 'C' + 26) % 26;
        for (char &c : s) {
            if (c >= 'a' && c <= 'z') c = (c - 'a' - k + 26) % 26 + 'a';
            else if (c >= 'A' && c <= 'Z') c = (c - 'A' - k + 26) % 26 + 'A';
        }
        for (char &c : s) c = toupper(c);
        cout << s << "\n";
    }
}
