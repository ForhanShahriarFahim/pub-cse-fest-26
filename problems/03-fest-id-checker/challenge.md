# 03 · Fest ID Checker (Giveaway: strings and conditionals)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Fest ID Checker
~~~

## Description
~~~
Check whether each contestant ID follows the PUB CSE Fest-26 format CSE-YY-NNNN.
~~~

## Problem Statement
~~~markdown
Every contestant at PUB CSE Fest-26 wears an ID card. Some students typed
their IDs carelessly in the registration form, so the volunteers at the entry
desk need a program to check them.

A **valid** ID has the form `CSE-YY-NNNN` and follows **all** of these rules:

1. It is exactly **11** characters long.
2. The first three characters are `CSE`, in **uppercase**.
3. The 4th and the 7th characters are both a hyphen `-`.
4. `YY` (the 5th and 6th characters) are two digits, and together they form the
   batch year, which must be between **20** and **26** (inclusive).
5. `NNNN` (the 8th to 11th characters) are four digits, and they are **not** `0000`.

Any ID that breaks at least one rule is **invalid**.
~~~

## Input Format
~~~markdown
The first line contains an integer **T**, the number of IDs.

Each of the next **T** lines contains one ID string **S**.
~~~

## Constraints
~~~markdown
- 1 ≤ T ≤ 1000
- 1 ≤ length of S ≤ 20
- S consists of printable ASCII characters and contains **no spaces**.
~~~

## Output Format
~~~markdown
For each ID, print `VALID` if it follows all the rules, otherwise print `INVALID`.
Print each answer on its own line.
~~~

## Tags
~~~
Strings, Implementation, Giveaway
~~~

## Test Cases tab
- Upload `tests.zip` (6 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
- `CSE-26-1042` follows all five rules.
- `cse-26-1042` is invalid because `CSE` must be uppercase (rule 2).
- `CSE-19-0420` is invalid because batch 19 is outside 20 to 26 (rule 4).
- `CSE-24-0000` is invalid because the last four digits are `0000` (rule 5).
- `CSE-22-12345` has 12 characters (rule 1).
- `CSE-20-0001` is valid: batch 20 is allowed, and `0001` is not `0000`.
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: HackerRank default
- Scoring: binary (all or nothing)
