# 02 · Fest T-Shirts (Giveaway: arithmetic)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Fest T-Shirts
~~~

## Description
~~~
Find how many packs of T-shirts the PUB CSE Fest committee must buy, and the total cost.
~~~

## Problem Statement
~~~markdown
PUB CSE Fest-26 is just around the corner! The organizing committee of
PUB CSE has promised that **everyone** involved in the programming contest
will get one fest T-shirt.

This year there are **N** teams, and every team has exactly **3** members.
There are also **V** volunteers and **J** judges. Each contestant, volunteer and
judge gets exactly one T-shirt.

The supplier does not sell single T-shirts. T-shirts come only in packs of
**K**, and each pack costs **C** taka. The committee wants to buy the **minimum
number of packs** so that there is at least one T-shirt for every person
(leftover T-shirts are fine).

For each scenario, find the number of packs the committee must buy and the
total cost in taka.
~~~

## Input Format
~~~markdown
The first line contains an integer **T**, the number of scenarios.

Each of the next **T** lines contains five space-separated integers **N V J K C**.
~~~

## Constraints
~~~markdown
- 1 ≤ T ≤ 10⁴
- 1 ≤ N ≤ 10⁹
- 0 ≤ V, J ≤ 10⁹
- 1 ≤ K ≤ 10⁹
- 1 ≤ C ≤ 10⁹
~~~

## Output Format
~~~markdown
For each scenario, print one line with two space-separated integers: the minimum
number of packs and the total cost in taka.
~~~

## Tags
~~~
Math, Implementation, Giveaway
~~~

## Test Cases tab
- Upload `tests.zip` (8 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
- **Scenario 1:** 2 teams have 6 contestants. With 3 volunteers and 2 judges,
  11 people need T-shirts. Two packs of 5 give only 10 T-shirts, so 3 packs are
  needed, costing 3 × 120 = 360 taka.
- **Scenario 2:** 10 teams have 30 contestants, and there are no volunteers or
  judges. Four packs of 7 give only 28 T-shirts, so 5 packs are needed, costing
  5 × 450 = 2250 taka.
- **Scenario 3:** 3 + 1 + 1 = 5 people, and one pack of 5 is exactly enough.
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: keep HackerRank's defaults (C/C++ 2 s, Java 8 4 s, Python 3 longer).
  The reference solutions in every language finish each test in under 0.3 s.
- Scoring: binary (all or nothing)
