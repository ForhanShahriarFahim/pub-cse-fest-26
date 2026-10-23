# PUB CSE Fest-26 Programming Contest

ICPC-preliminary-style contest on HackerRank: teams of 3 (each with one 1st-year
student), about 15–20 teams, 2.5 hours, onsite in PUB labs, no internet or AI.
Languages: C, C++, Java, Python.

## Problem index

**Fastest way to set up HackerRank:** open the [Setter Desk](https://claude.ai/artifact/JZv37yopiRX5wVkJzKDxRo)
(`setter-desk.html`, a private claude.ai page). It has a Copy button for every form field of every problem, the
sample preview, the test list, the pictures and the editorials. Rebuild it with
`python3 tools/build_desk.py` after `tools/check.py` passes.

Each problem folder has:
- **HackerRank form** (`challenge.md`): copy-paste blocks in the same order as *Manage Challenges → Create Challenge*.
- **Editorial** (`editorial.md`).
- **Test cases** (`tests.zip`): ready to upload, in `input/inputNN.txt` + `output/outputNN.txt` format.

| # | Problem | Tier · Topic | HackerRank form | Editorial | Test cases | Status |
|---|---------|--------------|-----------------|-----------|------------|--------|
| 01 | Welcome to CSE Fest-26 | Giveaway · printing | [challenge](problems/01-welcome/challenge.md) | [editorial](problems/01-welcome/editorial.md) | [tests.zip](problems/01-welcome/tests.zip) (2) | Approved |
| 02 | Fest T-Shirts | Giveaway · arithmetic, `long long` | [challenge](problems/02-fest-tshirts/challenge.md) | [editorial](problems/02-fest-tshirts/editorial.md) | [tests.zip](problems/02-fest-tshirts/tests.zip) (8) | Approved |
| 03 | Fest ID Checker | Giveaway · strings, conditionals | [challenge](problems/03-fest-id-checker/challenge.md) | [editorial](problems/03-fest-id-checker/editorial.md) | [tests.zip](problems/03-fest-id-checker/tests.zip) (6) | Approved |
| 04 | Lab Robot | Easy · implementation, grid simulation | [challenge](problems/04-lab-robot/challenge.md) | [editorial](problems/04-lab-robot/editorial.md) | [tests.zip](problems/04-lab-robot/tests.zip) (13) + [image](problems/04-lab-robot/sample.png) | Approved |
| 05 | Fest Scoreboard | Easy · implementation (ICPC rules) | [challenge](problems/05-fest-scoreboard/challenge.md) | [editorial](problems/05-fest-scoreboard/editorial.md) | [tests.zip](problems/05-fest-scoreboard/tests.zip) (12) | Approved |
| 06 | Love Letter | Easy · strings, Caesar cipher (for fun) | [challenge](problems/06-love-letter/challenge.md) | [editorial](problems/06-love-letter/editorial.md) | [tests.zip](problems/06-love-letter/tests.zip) (8) + [image](problems/06-love-letter/alphabet.png) | Approved |
| 07 | Rickshaw Ride | Easy · sorting, greedy, two pointers (classic) | [challenge](problems/07-rickshaw-ride/challenge.md) | [editorial](problems/07-rickshaw-ride/editorial.md) | [tests.zip](problems/07-rickshaw-ride/tests.zip) (18) | Approved |
| 08 | Lucky Raffle | Medium · number theory, sieve, prefix counts (classic) | [challenge](problems/08-lucky-raffle/challenge.md) | [editorial](problems/08-lucky-raffle/editorial.md) | [tests.zip](problems/08-lucky-raffle/tests.zip) (14) | Approved |
| 09 | Fest Treasure Hunt | Medium · graphs, BFS shortest path | [challenge](problems/09-treasure-hunt/challenge.md) | [editorial](problems/09-treasure-hunt/editorial.md) | [tests.zip](problems/09-treasure-hunt/tests.zip) (19) + [image](problems/09-treasure-hunt/sample.png) | Approved |
| 10 | Fest Budget | Medium–Hard · DP, 0/1 knapsack (classic) | [challenge](problems/10-fest-budget/challenge.md) | [editorial](problems/10-fest-budget/editorial.md) | [tests.zip](problems/10-fest-budget/tests.zip) (16) | Drafted |
| 11 | — | Hard · Dijkstra with extra state, or DSU | — | — | — | Planned |

Contest page setup (name, dates, description, rules): see [CONTEST.md](CONTEST.md).

Printed problem set for the contestants (Word, one problem per page, page numbers):
[contest/PUB-CSE-Fest-26-Problem-Set.docx](contest/PUB-CSE-Fest-26-Problem-Set.docx).
Rebuild it with `python3 tools/build_print.py` (needs `pip install python-docx`).

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
