# Fest T-Shirts

**Difficulty:** Giveaway &nbsp;|&nbsp; **Time limit:** HackerRank default &nbsp;|&nbsp; **Scoring:** Binary

## Problem Statement

PUB CSE Fest-26 is just around the corner! The organizing committee of
Pundra University of Science & Technology has promised that **everyone** involved
in the programming contest will get one fest T-shirt.

This year there are **N** teams, and every team has exactly **3** members.
There are also **V** volunteers and **J** judges. Each contestant, volunteer and
judge gets exactly one T-shirt.

The supplier does not sell single T-shirts. T-shirts come only in packs of
**K**, and each pack costs **C** taka. The committee wants to buy the **minimum
number of packs** so that there is at least one T-shirt for every person
(leftover T-shirts are fine).

For each scenario, find the number of packs the committee must buy and the
total cost in taka.

## Input Format

The first line contains an integer **T**, the number of scenarios.

Each of the next **T** lines contains five space-separated integers
**N V J K C**.

## Constraints

- 1 ≤ T ≤ 10<sup>4</sup>
- 1 ≤ N ≤ 10<sup>9</sup>
- 0 ≤ V, J ≤ 10<sup>9</sup>
- 1 ≤ K ≤ 10<sup>9</sup>
- 1 ≤ C ≤ 10<sup>9</sup>

## Output Format

For each scenario, print one line with two space-separated integers: the minimum
number of packs and the total cost in taka.

## Sample Input 0

```
3
2 3 2 5 120
10 0 0 7 450
1 1 1 5 1000
```

## Sample Output 0

```
3 360
5 2250
1 1000
```

## Explanation 0

- **Scenario 1:** 2 teams have 6 contestants. With 3 volunteers and 2 judges,
  11 people need T-shirts. Two packs of 5 give only 10 T-shirts, so 3 packs are
  needed, costing 3 × 120 = 360 taka.
- **Scenario 2:** 30 contestants. Four packs of 7 give only 28 T-shirts, so 5
  packs are needed, costing 5 × 450 = 2250 taka.
- **Scenario 3:** 3 + 1 + 1 = 5 people, and one pack of 5 is exactly enough.
