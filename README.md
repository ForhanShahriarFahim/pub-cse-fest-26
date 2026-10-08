# PUB CSE Fest-26 Programming Contest

ICPC-preliminary-style contest on HackerRank: teams of 3 (each with one 1st-year
student), about 15–20 teams, 2.5 hours, onsite in PUB labs, no internet or AI.
Languages: C, C++, Java, Python.

## Problem lineup (by difficulty)

| # | Tier | Topic | Type | Status |
|---|------|-------|------|--------|
| 01 | Giveaway | Arithmetic, ceiling division, `long long` | Custom | Approved ([Fest T-Shirts](problems/01-fest-tshirts)) |
| 02 | Giveaway | Basic strings and conditionals | Custom | Drafted ([Fest ID Checker](problems/02-fest-id-checker)) |
| 03 | Easy | Basic implementation and simulation | Custom | — |
| 04 | Easy | Sorting + greedy | Classic | — |
| 05 | Easy–Medium | Prefix sums or frequency counting | Custom | — |
| 06 | Medium | Number theory (GCD or sieve) | Classic | — |
| 07 | Medium | Grid BFS on a PUB campus map | Custom | — |
| 08 | Medium | Binary search on the answer | Classic | — |
| 09 | Medium–Hard | DP with a twist | Classic | — |
| 10 | Hard | Dijkstra with extra state, or DSU | Custom | — |

Contest order: the two giveaways first, then the rest shuffled.

## Checking a problem

```
python3 tools/check.py problems/01-fest-tshirts
```

This builds the official tests and validates every input. It cross-checks the C++,
Python and Java solutions, makes sure every `wrong_*.cpp` is rejected, stress-tests
against a brute-force solution, and writes `tests.zip` for HackerRank.
