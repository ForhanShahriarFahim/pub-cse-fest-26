// Mistake: keeps counting wrong submissions after the first AC.
#include <bits/stdc++.h>
using namespace std;

int main() {
    int t, p, n;
    cin >> t >> p >> n;
    // acTime[team][problem] = minute of the first AC, or -1 if not solved yet
    vector<vector<int>> acTime(t + 1, vector<int>(p, -1));
    vector<vector<int>> rejected(t + 1, vector<int>(p, 0));
    for (int i = 0; i < n; i++) {
        int minute, team;
        char prob;
        string verdict;
        cin >> minute >> team >> prob >> verdict;
        int j = prob - 'A';
        if (acTime[team][j] != -1 && verdict == "AC") continue;
        if (acTime[team][j] != -1) { rejected[team][j]++; continue; }
        if (verdict == "AC") acTime[team][j] = minute;
        else if (verdict != "CE") rejected[team][j]++;
    }
    vector<int> solved(t + 1, 0), penalty(t + 1, 0);
    for (int i = 1; i <= t; i++) {
        for (int j = 0; j < p; j++) {
            if (acTime[i][j] == -1) continue;
            solved[i]++;
            penalty[i] += acTime[i][j] + 20 * rejected[i][j];
        }
        cout << solved[i] << " " << penalty[i] << "\n";
    }
    int best = 1;
    for (int i = 2; i <= t; i++)
        if (solved[i] > solved[best] || (solved[i] == solved[best] && penalty[i] < penalty[best]))
            best = i;
    cout << best << "\n";
}
