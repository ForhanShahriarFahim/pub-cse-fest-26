// Re-reads the whole log for every (team, problem) pair and sorts the teams. Small inputs only.
#include <bits/stdc++.h>
using namespace std;

struct Sub { int minute, team; char prob; string verdict; };

int main() {
    int t, p, n;
    cin >> t >> p >> n;
    vector<Sub> log(n);
    for (auto &s : log) cin >> s.minute >> s.team >> s.prob >> s.verdict;
    vector<tuple<int, int, int>> rank;  // (-solved, penalty, team)
    for (int team = 1; team <= t; team++) {
        int solved = 0, penalty = 0;
        for (int j = 0; j < p; j++) {
            int wrong = 0;
            for (auto &s : log) {
                if (s.team != team || s.prob != 'A' + j) continue;
                if (s.verdict == "AC") { solved++; penalty += s.minute + 20 * wrong; break; }
                if (s.verdict == "WA" || s.verdict == "TLE" || s.verdict == "RE") wrong++;
            }
        }
        cout << solved << " " << penalty << "\n";
        rank.push_back({-solved, penalty, team});
    }
    sort(rank.begin(), rank.end());
    cout << get<2>(rank[0]) << "\n";
}
