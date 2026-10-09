# Editorial: Lucky Raffle (Medium)

**Why the simple way is too slow.** Checking every ticket of every bundle means up to
Q × 10⁶ = 10¹¹ tickets, even before testing whether each one is prime. We need to do
the work for all tickets **once**, and then answer each student in O(1).

**Step 1: Sieve of Eratosthenes.** Mark which numbers up to 10⁶ are prime. Start by
assuming every number from 2 is prime. For each prime p (up to √10⁶ = 1000), cross out
p², p² + p, p² + 2p, ... Smaller multiples of p were already crossed out by
smaller primes. Whatever is never crossed out is prime.

**Step 2: Prefix counts.** Let `cnt[i]` = how many primes are in 1..i:
`cnt[i] = cnt[i - 1] + (1 if i is prime else 0)`, with `cnt[0] = 0`.

**Step 3: Answer each bundle.** The primes in L..R are the primes in 1..R minus the
primes in 1..L−1:

```
answer = cnt[R] - cnt[L - 1]
```

```
composite[0..10^6] = false
for i = 2 while i * i <= 10^6:
    if not composite[i]:
        for j = i * i to 10^6 step i:  composite[j] = true
for i = 1 to 10^6:
    cnt[i] = cnt[i - 1] + (1 if i >= 2 and not composite[i] else 0)
for each query (L, R):  print cnt[R] - cnt[L - 1]
```

**Traps (each one is caught by the official tests):**

| Mistake | Why it fails |
|---|---|
| Counting 1 as prime | 1 has only one divisor. Sample student 3. |
| Forgetting 2 (only checking odd numbers) | 2 is the only even prime. Sample student 1. |
| `cnt[R] - cnt[L]` | Ticket L is never counted. Sample students 2 and 5. |
| `cnt[R - 1] - cnt[L - 1]` | Ticket R is never counted. Sample student 5. |
| Trial division with `d * d < n` | Squares of primes (4, 9, 25, ...) look prime. Use `d * d <= n`. |
| `for (int i = 2; i <= 10^6; i++)` with `j = i * i` in `int` | `i * i` overflows once i > 46340, and the program crashes. Stop the outer loop at `i * i <= 10^6`. |
| Outer sieve loop stopping too early | Composites like 101 × 103 = 10403 stay "prime". |
| Sieving only up to 10⁵ | Misreading the bound: tickets above 10⁵ are never counted. |
| Walking from L to R for every student | Up to 10¹¹ steps. Time limit exceeded. |

**Arrays:** a `bool` array and an `int` array of size 10⁶ + 1 take about 5 MB, which
is fine. In C/C++, declare them **globally** (or `static`), not inside `main`, so
that they do not overflow the stack.

**Complexity:** O(M log log M) for the sieve and O(M) for the prefix counts, where
M = 10⁶. After that, each student takes O(1), so O(M log log M + Q) overall.
