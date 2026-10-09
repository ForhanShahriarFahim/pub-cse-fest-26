// Mistake: never stops at the first AC, so a second AC counts the problem (and its time) twice.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int t, p, n;
    cin >> t >> p >> n;
    vector<vector<int>> rejected(t + 1, vector<int>(p, 0));
    vector<int> solved(t + 1, 0), penalty(t + 1, 0);
    for (int i = 0; i < n; i++) {
        int minute, team;
        char prob;
        string verdict;
        cin >> minute >> team >> prob >> verdict;
        int j = prob - 'A';
        if (verdict == "AC") { solved[team]++; penalty[team] += minute + 20 * rejected[team][j]; }
        else if (verdict != "CE") rejected[team][j]++;
    }
    for (int i = 1; i <= t; i++) cout << solved[i] << " " << penalty[i] << "\n";
    int best = 1;
    for (int i = 2; i <= t; i++)
        if (solved[i] > solved[best] || (solved[i] == solved[best] && penalty[i] < penalty[best]))
            best = i;
    cout << best << "\n";
}
