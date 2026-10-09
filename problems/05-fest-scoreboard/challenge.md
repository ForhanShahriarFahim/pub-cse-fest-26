# 05 · Fest Scoreboard (Easy: implementation)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Fest Scoreboard
~~~

## Description
~~~
Rebuild the ICPC scoreboard of PUB CSE Fest-26 from the submission log and find the winner.
~~~

## Problem Statement
~~~markdown
Ten minutes before the end of **PUB CSE Fest-26**, the scoreboard screen crashed!
Luckily, the judges still have the submission log. Help them rebuild the scoreboard.

There are **T** teams, numbered 1 to T, and **P** problems, labelled with the first
P uppercase letters (`A`, `B`, `C`, ...). The log lists **N** submissions in the
order they were judged. Each submission has the minute it was made, the team, the
problem and the verdict, which is one of:

- `AC`: accepted
- `WA` (wrong answer), `TLE` (time limit exceeded), `RE` (runtime error): **rejected**
- `CE`: compile error

The scoreboard follows these ICPC rules:

1. A team **solves** a problem with its **first** `AC` on that problem. Every later
   submission by that team on that problem is ignored.
2. The **penalty** for a solved problem is the minute of that first `AC`, plus
   **20** minutes for every **rejected** submission (`WA`, `TLE` or `RE`) the team
   made on that problem **before** that `AC`.
3. A `CE` submission never adds penalty.
4. Rejected submissions on a problem that the team **never solves** add no penalty.

A team's **total penalty** is the sum of the penalties of the problems it solved.

The **winner** is the team that solved the most problems. If several teams solved
the same number of problems, the one with the smaller total penalty wins. If they
are still tied, the team with the smaller team number wins.

For every team, find the number of problems it solved and its total penalty, and
then find the winner.
~~~

## Input Format
~~~markdown
- The first line contains three integers **T**, **P** and **N**.
- Each of the next **N** lines describes one submission with four values separated
  by spaces: the **minute**, the **team** number, the **problem** letter and the
  **verdict**.

The submissions are given in the order they were judged.
~~~

## Constraints
~~~markdown
- 1 ≤ T ≤ 100
- 1 ≤ P ≤ 26
- 0 ≤ N ≤ 10⁵
- 0 ≤ minute ≤ 300, and the minutes never decrease from one line to the next
  (several submissions can share the same minute)
- 1 ≤ team ≤ T
- The problem letter is one of the first P uppercase letters.
- The verdict is one of `AC`, `WA`, `TLE`, `RE`, `CE`.
~~~

## Output Format
~~~markdown
Print **T + 1** lines:

- Line i (for i = 1 to T): two integers, the number of problems team i solved and
  its total penalty.
- The last line: the team number of the winner.
~~~

## Tags
~~~
Implementation, Simulation, Arrays
~~~

## Test Cases tab
- Upload `tests.zip` (12 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
- **Team 1:** on problem A, one `WA` (minute 5) and then `AC` at minute 12, so
  12 + 20 = 32. The `WA` at minute 40 comes after the `AC`, so it is ignored.
  On problem B, one `TLE` and then `AC` at minute 58, so 58 + 20 = 78.
  Team 1 solved **2** problems with penalty 32 + 78 = **110**.
- **Team 2:** on problem A, the `CE` adds nothing and the `AC` is at minute 20, so 20.
  On problem C, one `WA` and then `AC` at minute 52, so 52 + 20 = 72.
  Team 2 solved **2** problems with penalty 20 + 72 = **92**.
- **Team 3:** one `WA` on problem B but never solved it, so **0** problems and
  penalty **0**.

Teams 1 and 2 both solved 2 problems, and team 2 has the smaller penalty
(92 < 110), so the winner is team **2**.
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: keep HackerRank's defaults (C/C++ 2 s, Java 8 4 s, Python 3 longer).
  The reference solutions in every language finish each test in under 0.3 s.
- Scoring: binary (all or nothing)
