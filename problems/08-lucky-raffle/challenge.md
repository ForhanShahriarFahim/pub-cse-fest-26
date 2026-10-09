# 08 · Lucky Raffle (Medium: number theory, sieve)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Lucky Raffle
~~~

## Description
~~~
Count the prime-numbered winning tickets in each raffle bundle bought at PUB CSE Fest-26.
~~~

## Problem Statement
~~~markdown
**PUB CSE Fest-26** has a raffle draw! The raffle tickets are numbered from
**1** to **1000000** (10⁶). The organizing committee loves mathematics, so they
announced a simple rule:

> A ticket **wins a prize** if its number is a **prime number**.

A prime number is an integer greater than 1 whose only positive divisors are 1
and itself. For example, 2, 3, 5, 7 and 11 are prime, but 1, 4, 9 and 15 are not.

**Q** students each bought one bundle of tickets. A bundle contains every ticket
numbered from **L** to **R**, with both **L** and **R** included.

For every student, find how many winning tickets are in their bundle.
~~~

## Input Format
~~~markdown
The first line contains an integer **Q**, the number of students.

Each of the next **Q** lines contains two space-separated integers **L** and **R**:
the first and the last ticket number in that student's bundle.
~~~

## Constraints
~~~markdown
- 1 ≤ Q ≤ 10⁵
- 1 ≤ L ≤ R ≤ 10⁶
~~~

## Output Format
~~~markdown
For each student, in the order of the input, print one line with the number of
winning tickets in their bundle.
~~~

## Tags
~~~
Math, Number Theory, Sieve of Eratosthenes, Prefix Sum
~~~

## Test Cases tab
- Upload `tests.zip` (14 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
- **Student 1** has tickets 1 to 10. The primes are 2, 3, 5 and 7, so the answer is 4.
- **Student 2** has tickets 11 to 20. The primes are 11, 13, 17 and 19, so the answer
  is 4. Ticket 11 counts, because both ends of a bundle are included.
- **Student 3** has only ticket 1, and 1 is not prime, so the answer is 0.
- **Student 4** has tickets 24 to 28. None of them is prime: 24 = 2 × 12,
  25 = 5 × 5, 26 = 2 × 13, 27 = 3 × 9 and 28 = 2 × 14. The answer is 0.
- **Student 5** has only ticket 13, which is prime, so the answer is 1.
- **Student 6** has tickets 1 to 100, and there are 25 primes among them.
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: keep HackerRank's defaults (C/C++ 2 s, Java 8 4 s, Python 3 longer).
  The reference solutions in every language finish each test in under 0.2 s.
  Checking every ticket of every bundle takes more than 15 s on the largest tests.
- Scoring: binary (all or nothing)
