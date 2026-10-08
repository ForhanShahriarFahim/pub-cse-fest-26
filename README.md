# PUB CSE Fest-26 Programming Contest

ICPC-preliminary-style contest on HackerRank: teams of 3 (each with one 1st-year
student), about 15–20 teams, 2.5 hours, onsite in PUB labs, no internet or AI.
Languages: C, C++, Java, Python.

## Problem index

Each problem folder has:
- **HackerRank form** (`challenge.md`): copy-paste blocks in the same order as *Manage Challenges → Create Challenge*.
- **Editorial** (`editorial.md`).
- **Test cases** (`tests.zip`): ready to upload, in `input/inputNN.txt` + `output/outputNN.txt` format.

| # | Problem | Tier · Topic | HackerRank form | Editorial | Test cases | Status |
|---|---------|--------------|-----------------|-----------|------------|--------|
| 01 | Welcome to Fest-26 | Giveaway · printing | [challenge](problems/01-welcome/challenge.md) | [editorial](problems/01-welcome/editorial.md) | [tests.zip](problems/01-welcome/tests.zip) (2) | Drafted |
| 02 | Fest T-Shirts | Giveaway · arithmetic, `long long` | [challenge](problems/02-fest-tshirts/challenge.md) | [editorial](problems/02-fest-tshirts/editorial.md) | [tests.zip](problems/02-fest-tshirts/tests.zip) (8) | Approved |
| 03 | Fest ID Checker | Giveaway · strings, conditionals | [challenge](problems/03-fest-id-checker/challenge.md) | [editorial](problems/03-fest-id-checker/editorial.md) | [tests.zip](problems/03-fest-id-checker/tests.zip) (6) | Approved |
| 04 | Lab Robot | Easy · implementation, grid simulation | [challenge](problems/04-lab-robot/challenge.md) | [editorial](problems/04-lab-robot/editorial.md) | [tests.zip](problems/04-lab-robot/tests.zip) (13) + [image](problems/04-lab-robot/sample.png) | Drafted |
| 05 | Mini ICPC Scoreboard | Easy · implementation | — | — | — | Next |
| 06 | — | Easy · sorting + greedy (classic) | — | — | — | Planned |
| 07 | — | Easy–Medium · prefix sums or frequency counting | — | — | — | Planned |
| 08 | — | Medium · number theory, GCD or sieve (classic) | — | — | — | Planned |
| 09 | — | Medium · BFS on a campus-buildings graph | — | — | — | Planned |
| 10 | — | Medium · binary search on the answer (classic) | — | — | — | Planned |
| 11 | — | Medium–Hard · DP with a twist (classic) | — | — | — | Planned |
| 12 | — | Hard · Dijkstra with extra state, or DSU | — | — | — | Planned |

Contest order: the giveaways first, then the rest shuffled. Final contest letters are
assigned at the end.

## HackerRank setup checklist (per challenge)

1. Create Challenge: paste each block from `challenge.md` into the field with the same name.
2. Test Cases tab: upload `tests.zip`, mark test case 0 as **Sample**, and paste the
   explanation. If your editor has no Explanation box, add it at the end of the Problem Statement.
3. Images: use the editor's image button to upload the PNG from the problem folder.
4. Languages: C, C++, Java, Python 3. Scoring: binary (all or nothing).

## Checking a problem

```
python3 tools/check.py problems/02-fest-tshirts
```

This builds the official tests and validates every input. It cross-checks the C++,
Python and Java solutions, makes sure every `wrong_*.cpp` is rejected, stress-tests
against a brute-force solution, and writes `tests.zip`.
