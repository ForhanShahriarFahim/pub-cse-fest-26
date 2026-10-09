# 06 · Love Letter (Easy: strings, Caesar cipher)

Copy each block into the matching field of **HackerRank → Manage Challenges → Create Challenge**.

## Challenge Name
~~~
Love Letter
~~~

## Description
~~~
Find the secret key and decrypt the love letters of a shy PUB CSE student.
~~~

## Problem Statement
Before you paste: put the cursor on the `![...]` line, click the **image** button
in the editor toolbar, and upload `alphabet.png` from this folder. Then delete the
placeholder line.
~~~markdown
Every evening during **PUB CSE Fest-26**, a shy student drops a secret love letter
into the notice box of the CSE department. The whole department wants to know who
the lucky one is, but every letter is **encrypted**!

To encrypt a letter, the student picks a secret key **K** (0 ≤ K ≤ 25) and replaces
every English letter with the letter that comes **K places later** in the alphabet,
going around from `z` back to `a` (and from `Z` back to `A`):

- Uppercase letters stay uppercase, and lowercase letters stay lowercase.
- Every other character (spaces, digits, punctuation) stays **unchanged**.

For example, with K = 3, `a` becomes `d`, `x` becomes `a`, `C` becomes `F`, and
`I love C++ <3` becomes `L oryh F++ <3`.

![How a shift with K = 3 works](UPLOAD alphabet.png HERE)

The key can be **different for every letter**, and nobody knows it. But the student
always signs off the same way: the **last five characters** of every original
letter are exactly `Coder`.

Decrypt every letter and find out who they are written to!
~~~

## Input Format
~~~markdown
The first line contains an integer **T**, the number of letters.

Each of the next **T** lines contains one encrypted letter **S**.

Each letter contains spaces, so read the whole line at once.
~~~

## Constraints
~~~markdown
- 1 ≤ T ≤ 100
- 5 ≤ length of S ≤ 1000
- S consists of printable ASCII characters. It does not start or end with a space,
  and it never has two spaces in a row.
- The original letter ends with `Coder`.
~~~

## Output Format
~~~markdown
For each letter, print the decrypted (original) letter on its own line.
~~~

## Tags
~~~
Strings, Implementation, Cryptography
~~~

## Test Cases tab
- Upload `tests.zip` (8 test cases).
- Mark **test case 0** as **Sample**.
- Explanation for test case 0:
~~~markdown
The first letter ends with `Frghu`. The original ends with `Coder`, and `C` → `F`
is 3 places, so **K = 3**. Moving every letter 3 places back gives
`My dearest C++, you compile my heart ... Yours forever, Coder`.
Notice that `C++`, the comma and the full stop keep their symbols.

The second letter ends with `Mynob`. `C` → `M` is 10 places, so K = 10.

The third letter ends with `Bncdq`. `C` → `B` goes around the end of the
alphabet: C, D, ..., Z, A, B is 25 places, so K = 25.

So the shy student's love letters were written to programming itself!
~~~

## Settings
- Languages: C, C++, Java, Python 3
- Time and memory limit: keep HackerRank's defaults (C/C++ 2 s, Java 8 4 s, Python 3 longer).
  The reference solutions in every language finish each test in under 0.3 s.
- Scoring: binary (all or nothing)
