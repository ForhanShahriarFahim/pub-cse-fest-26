# Editorial: Fest Budget (Medium-Hard)

This is the classic **0/1 knapsack** problem: the budget is the knapsack, an
activity's cost is its weight, and its fun is its value.

**Why the simple ideas fail.**

- *Greedy* (take the most fun, or the best fun per taka, or the cheapest first)
  is wrong. In the sample, the best fun per taka is the activity (6, 30), but
  taking it leaves 4 taka and gives only 33, while the two 5-taka activities give 47.
- *Trying every group* means 2¹⁰⁰ groups. That never finishes.

**DP idea.** Let `dp[j]` = the most fun we can get with total cost **at most j**,
using the activities considered so far. Before any activity, `dp[j] = 0` for every j.

For an activity (c, f), for every budget j ≥ c we either skip it (`dp[j]` stays) or
take it (`dp[j - c] + f`, the best for the remaining money plus this activity):

```
dp[0..B] = 0
for each activity (c, f):
    for j = B down to c:                 # DOWN, so each activity is used at most once
        dp[j] = max(dp[j], dp[j - c] + f)
print dp[B]
```

**Why the loop must go down.** When j goes from B down to c, `dp[j - c]` still holds
the value from *before* this activity, so the activity is counted at most once.
Going **up** would let `dp[j - c]` already include this same activity, so it could
be taken twice, three times, and so on. In the sample, that gives 48 (24 + 24).

The same idea with a 2D table also works: `dp[i][j]` = best using the first i
activities with budget j, and `dp[i][j] = max(dp[i-1][j], dp[i-1][j-c] + f)`.

**Traps (each one is caught by the official tests):**

| Mistake | Why it fails |
|---|---|
| Greedy by fun per taka, by fun, or by lowest cost | Sample: 33 instead of 47 (or less). |
| Inner loop going up (`j = c .. B`) | Uses the same activity many times. Sample: 48. |
| `dp[i][j] = dp[i-1][j-c] + f` without the `max` with skipping | Forces taking every affordable activity. |
| `int` for the fun | The total can be 100 × 10⁹ = 10¹¹. Use `long long` (C/C++) or `long` (Java). |
| `dp[j]` = most fun spending **exactly** j taka, then printing `dp[B]` | The best plan may spend less than B. |
| Treating the budget as strict (`< B`) | Spending exactly B taka is allowed (Sample: 5 + 5 = 10). |
| Trying every subset | 2¹⁰⁰ subsets. Time limit exceeded. |

Activities that cost more than B are simply never taken: the loop `j = B down to c`
does not run for them.

**Complexity:** O(N · B) time, at most 100 × 5 × 10⁴ = 5 × 10⁶ steps, and O(B) memory.
