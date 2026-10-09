# 07 · Rickshaw Ride (Easy: sorting, greedy)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Rickshaw Ride
~~~

## Description
~~~
Find the minimum number of rickshaws needed to take every student to Satmatha after PUB CSE Fest-26.
~~~

## Problem Statement
~~~markdown
The prize-giving ceremony of **PUB CSE Fest-26** ends late in the evening, and
**N** students need to get from the campus to Satmatha. A long line of rickshaws
is waiting at the campus gate.

A rickshaw can carry **one or two** students, and the total weight of the students
on it must **not exceed X** kilograms. The i-th student weighs **wᵢ** kilograms.
Every student is light enough to ride alone (wᵢ ≤ X).

Every student must ride exactly one rickshaw. What is the **minimum number of
rickshaws** needed to take all **N** students to Satmatha?
~~~

## Input Format
~~~markdown
The first line contains two space-separated integers **N** and **X**: the number of
students and the weight limit of a rickshaw in kilograms.

The second line contains **N** space-separated integers: the weights of the students
in kilograms, **w₁, w₂, ..., wₙ**.
~~~

## Constraints
~~~markdown
- 1 ≤ N ≤ 2 × 10⁵
- 1 ≤ X ≤ 10⁹
- 1 ≤ wᵢ ≤ X
~~~

## Output Format
~~~markdown
Print one integer: the minimum number of rickshaws needed.
~~~

## Tags
~~~
Greedy, Sorting, Two Pointers
~~~

## Test Cases tab
- Upload `tests.zip` (18 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
A rickshaw can carry at most 150 kg.

- The 100 kg student can share only with the 50 kg student, because
  100 + 50 = 150 is allowed but 100 + 60 = 160 is too heavy.
- The 90 kg student can then share only with the 60 kg student (90 + 60 = 150).
- The 75 kg and 80 kg students cannot share (75 + 80 = 155 > 150), so each of
  them rides alone.

So 4 rickshaws are enough: {100, 50}, {90, 60}, {80} and {75}.

Three rickshaws are not enough. Six students in three rickshaws means every
rickshaw carries two, but as shown above, 100 must ride with 50 and 90 must ride
with 60, which leaves 75 and 80 together, and that is too heavy.
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: keep HackerRank's defaults (C/C++ 2 s, Java 8 4 s, Python 3 longer).
  The reference solutions in every language finish each test in under 0.3 s.
  An O(N²) solution takes more than 5 s on the largest tests.
- Scoring: binary (all or nothing)
