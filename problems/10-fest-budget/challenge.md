# 10 · Fest Budget (Medium-Hard: dynamic programming, 0/1 knapsack)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Fest Budget
~~~

## Description
~~~
Choose fest activities within the budget to make PUB CSE Fest-26 as much fun as possible.
~~~

## Problem Statement
~~~markdown
The organizing committee of **PUB CSE Fest-26** has a budget of **B** taka for the
fun activities of the fest.

Students have suggested **N** activities: a photo booth, a gaming zone, a quiz
show, a cultural night, and many more. The i-th activity costs **cᵢ** taka and
brings **fᵢ** fun points.

The committee may choose any group of activities, but:

- each activity can be chosen **at most once**, and
- the total cost of the chosen activities must **not exceed B** taka (spending
  less than B is fine).

What is the **maximum total fun** the committee can get? Choosing no activity at
all gives 0 fun.
~~~

## Input Format
~~~markdown
The first line contains two space-separated integers **N** and **B**: the number
of activities and the budget in taka.

Each of the next **N** lines contains two space-separated integers **cᵢ** and
**fᵢ**: the cost and the fun of one activity.
~~~

## Constraints
~~~markdown
- 1 ≤ N ≤ 100
- 1 ≤ B ≤ 5 × 10⁴
- 1 ≤ cᵢ ≤ 10⁵ (an activity may cost more than the whole budget)
- 1 ≤ fᵢ ≤ 10⁹
~~~

## Output Format
~~~markdown
Print one integer: the maximum total fun within the budget.
~~~

## Tags
~~~
Dynamic Programming, Knapsack
~~~

## Test Cases tab
- Upload `tests.zip` (16 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
The budget is 10 taka. The activities are (cost, fun): (6, 30), (5, 24), (5, 23),
(1, 3) and (12, 100).

- The last activity costs 12 taka, which is more than the whole budget, so it
  can never be chosen.
- Choosing the two activities that cost 5 taka spends exactly 10 taka and gives
  24 + 23 = **47** fun. This is the best possible.
- Starting with the activity of cost 6 looks tempting, because it gives the most
  fun per taka (5 points per taka). But then only 4 taka are left, which buys
  only the activity of cost 1: 30 + 3 = 33 fun.
- The activity (5, 24) cannot be chosen twice, so 24 + 24 = 48 is not allowed.
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: keep HackerRank's defaults (C/C++ 2 s, Java 8 4 s, Python 3 longer).
  The reference solutions finish each test in under 0.1 s (C, C++, Java) and 0.6 s (Python).
  A plain nested-loop Python DP takes at most 1.4 s. Trying every subset times out.
- Scoring: binary (all or nothing)
