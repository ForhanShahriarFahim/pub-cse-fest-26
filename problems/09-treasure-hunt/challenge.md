# 09 · Fest Treasure Hunt (Medium: graphs, BFS)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Fest Treasure Hunt
~~~

## Description
~~~
Collect every clue of the PUB CSE Fest-26 treasure hunt in order, walking as few campus walkways as possible.
~~~

## Problem Statement
Before you paste: put the cursor on the `![...]` line, click the **image** button
in the editor toolbar, and upload `sample.png` from this folder. Then delete the
placeholder line.
~~~markdown
**PUB CSE Fest-26** ends with a campus **treasure hunt**!

The campus has **N** buildings, numbered from 1 to **N**. Building **1** is the
**main gate**, where every team starts. There are **M** walkways. Each walkway
joins two different buildings and can be walked in **both directions**. Some
buildings may not be connected to the rest of the campus at all.

The organizers have hidden **K** clues: clue 1 is in building **c₁**, clue 2 is in
building **c₂**, and so on. A team must collect the clues **in order**. It starts at
the main gate, walks to the building of clue 1, then from there to the building of
clue 2, and so on, until it reaches the building of clue **K**. On the way, a team
may pass through any building any number of times.

Find the **minimum total number of walkways** a team must walk to collect all **K**
clues in order. If some clue cannot be reached at all, print **-1**.

The picture below shows the campus of Sample Input 0 and one shortest way to
collect its three clues.

![The campus of Sample Input 0](UPLOAD sample.png HERE)
~~~

## Input Format
~~~markdown
The first line contains two space-separated integers **N** and **M**: the number of
buildings and the number of walkways.

Each of the next **M** lines contains two space-separated integers **u** and **v**,
meaning there is a walkway between building **u** and building **v**.

The next line contains an integer **K**, the number of clues.

The last line contains **K** space-separated integers **c₁, c₂, ..., cₖ**: the
buildings of the clues, in the order they must be collected.
~~~

## Constraints
~~~markdown
- 2 ≤ N ≤ 10⁵
- 1 ≤ M ≤ 2 × 10⁵
- 1 ≤ u, v ≤ N and u ≠ v
- No two walkways join the same pair of buildings.
- 1 ≤ K ≤ 10
- 1 ≤ cᵢ ≤ N
- c₁ ≠ 1, and two consecutive clues are never in the same building.
~~~

## Output Format
~~~markdown
Print one integer: the minimum total number of walkways the team must walk, or
**-1** if some clue cannot be reached.
~~~

## Tags
~~~
Graph Theory, BFS, Shortest Path
~~~

## Test Cases tab
- Upload `tests.zip` (19 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
The clues are in buildings 5, 2 and 7, in that order.

- **Gate → clue 1:** from building 1 to building 5, the shortest way is
  1 → 6 → 5, which is **2** walkways. Going 1 → 2 → 3 → 4 → 5 would take 4.
- **Clue 1 → clue 2:** from building 5 to building 2 takes **3** walkways, for
  example 5 → 4 → 3 → 2. (5 → 6 → 1 → 2 and 5 → 7 → 3 → 2 are also 3.)
- **Clue 2 → clue 3:** from building 2 to building 7, the shortest way is
  2 → 3 → 7, which is **2** walkways.

The total is 2 + 3 + 2 = **7**.

Building 8 has no walkways, so nobody can reach it. No clue is there, so it does
not matter in this sample, but if a clue were in building 8, the answer would be -1.
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: keep HackerRank's defaults (C/C++ 2 s, Java 8 4 s, Python 3 longer).
  The reference solutions finish each test in under 0.25 s (C, C++, Java) and 0.7 s (Python).
  Bellman-Ford and "try every path" solutions take more than 50 s on the largest tests.
- Scoring: binary (all or nothing)
