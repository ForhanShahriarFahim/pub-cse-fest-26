# Editorial: Rickshaw Ride (Easy)

**Idea.** Sort the weights. Look at the **heaviest** student who has no rickshaw yet.

- If they fit together with the **lightest** remaining student, put both on one rickshaw.
- Otherwise the heaviest student cannot share with anybody (everyone else is at least
  as heavy as the lightest), so they ride alone.

Either way one rickshaw leaves, and we repeat with the remaining students. This is
the *two pointers* technique: `l` starts at the lightest, `r` at the heaviest.

```
sort(w)
l = 0, r = N - 1, answer = 0
while l <= r:
    if l < r and w[l] + w[r] <= X:   l = l + 1     # lightest joins the heaviest
    r = r - 1                                      # heaviest leaves
    answer = answer + 1
```

**Why is this optimal?** Let H be the heaviest and L the lightest student, with
H + L ≤ X, and take any best seating.

- If H and L already ride together, we are done.
- If H rides with Y and L rides with Z, swap Y and L: H + L ≤ X, and
  Y + Z ≤ Y + H ≤ X (since Z ≤ H). The number of rickshaws does not change.
- If one of them rides alone, move the other's partner (if any) to ride alone and
  seat H with L. The count does not get bigger.

So some best seating puts H with L, and the same argument repeats on the rest.

**Traps (each one is caught by the official tests):**

| Mistake | Why it fails |
|---|---|
| Not sorting first | The two pointers only make sense on sorted weights. |
| Pairing neighbours after sorting, (w₀, w₁), (w₂, w₃), ... | It wastes light students on each other. Sample: it gives 5 instead of 4. |
| Pairing the two heaviest if they fit | Same problem from the other side. Sample: 5. |
| `w[l] + w[r] < X` | A pair weighing exactly X is allowed (Sample: 100 + 50 = 150). |
| `while (l < r)` | The last student left in the middle never gets a rickshaw. Sample: 3. |
| Sending the *lightest* alone when the pair does not fit | The heaviest is the one who cannot share; the lightest might still share with someone else. |
| Answer = ⌈N / 2⌉ | It ignores the weights. |
| Storing the weights in a `set` | Students with equal weights disappear. |
| For each student, scanning all others for a partner | It is O(N²), which is about 2 × 10¹⁰ steps for N = 2 × 10⁵. Time limit exceeded. |

**Integer size:** a pair weighs at most 2 × 10⁹, which still fits in a 32-bit `int`
(its limit is about 2.147 × 10⁹), but only just. Using `long long` (C/C++) or `long`
(Java) for the weights is the safe habit.

**Fast input:** N can be 2 × 10⁵. Use `scanf`, `BufferedReader` (Java), or
`sys.stdin.buffer.read().split()` (Python).

**Complexity:** O(N log N) for sorting, then O(N) for the two pointers.
