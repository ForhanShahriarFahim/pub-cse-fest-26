# 04 · Lab Robot (Easy: implementation)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Lab Robot
~~~

## Description
~~~
Simulate a robot walking through the contest lab and count the cells it visits.
~~~

## Problem Statement
Before you paste: put the cursor on the `![...]` line, click the **image** button
in the editor toolbar, and upload `sample.png` from this folder. Then delete the
placeholder line.
~~~markdown
During PUB CSE Fest-26, the robotics club lends the contest hall a small robot
named **Robu**, which carries water bottles to the teams.

The contest lab is a grid of **N** rows and **M** columns. Rows are numbered
1 to N from **top** to **bottom**, and columns 1 to M from **left** to
**right**. Each cell is one of:

- `.`: free floor
- `#`: a computer desk, which Robu cannot enter
- `S`: free floor where Robu starts (there is exactly one `S`)

Robu receives a string of **K** commands, one character each:
`U` (up one row), `D` (down one row), `L` (left one column), `R` (right one column).

Robu executes the commands **in order**. If a command would move it **outside the
lab** or **into a desk**, Robu ignores that command and stays where it is, then
continues with the next command.

After all commands are done, report:

1. Robu's final position (row and column), and
2. how many **different** cells Robu has stood on, **including the starting cell**.

The picture below shows Robu's walk for Sample Input 0. **S** is the start and
**E** is where Robu ends. The orange line is the path, the shaded cells are the
visited cells, and a red ✕ marks an ignored command.

![Robu's walk in Sample Input 0](UPLOAD sample.png HERE)
~~~

## Input Format
~~~markdown
- The first line contains two integers **N** and **M**.
- Each of the next **N** lines contains a string of **M** characters describing
  one row of the lab, from row 1 to row N.
- The next line contains an integer **K**.
- The last line contains a string of **K** characters, the commands.
~~~

## Constraints
~~~markdown
- 1 ≤ N, M ≤ 100
- Each grid character is `.`, `#` or `S`, and there is exactly one `S`.
- 1 ≤ K ≤ 10⁵
- Each command is `U`, `D`, `L` or `R`.
~~~

## Output Format
~~~markdown
Print two lines:

- The first line contains two integers: Robu's final row and column.
- The second line contains one integer: the number of different cells Robu has stood on.
~~~

## Tags
~~~
Implementation, Simulation, Grid
~~~

## Test Cases tab
- Upload `tests.zip` (13 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
Robu starts at (1, 1).

- `U` is ignored, because it would leave the lab.
- `R R` moves it to (1, 3). The next `R` is ignored, because (1, 4) is a desk.
- `D D` moves it to (3, 3), and `R R` to (3, 5).
- `U` moves it to (2, 5), and `D D` moves it back through (3, 5) to (4, 5).
- The final `L` is ignored, because (4, 4) is a desk.

Robu ends at row 4, column 5. The cells it stood on are (1,1), (1,2), (1,3),
(2,3), (3,3), (3,4), (3,5), (2,5) and (4,5). That is **9** different cells;
(3, 5) was visited twice but is counted once.
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: keep HackerRank's defaults (C/C++ 2 s, Java 8 4 s, Python 3 longer).
  The reference solutions in every language finish each test in under 0.3 s.
- Scoring: binary (all or nothing)
