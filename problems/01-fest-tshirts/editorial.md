# Editorial: Fest T-Shirts (Giveaway)

**Idea.** The number of people is P = 3N + V + J. We need the smallest number of
packs `x` with `x * K >= P`, which is the ceiling of P / K. The answer is
`x` and `x * C`.

**Integer ceiling without floating point:** `x = (P + K - 1) / K`.

**Traps (each one is caught by the official tests):**

| Mistake | Why it fails |
|---|---|
| Using `int` | P can be up to 5·10⁹, and the cost up to 5·10¹⁸. Use `long long` (C/C++) or `long` (Java). It still fits, since 5·10¹⁸ < 9.22·10¹⁸. |
| Computing `packs * C` in `int` | Even 3 packs × 10⁹ taka overflows 32-bit. |
| `P / K` (floor) | It buys too few packs when K does not divide P. |
| `P / K + 1` | It buys one pack too many when K divides P (Sample 3). |
| `ceil((float)P / K)` | `float` has only 24 bits of precision. `double` happens to be exact here, but integer arithmetic is the safe habit. |
| Forgetting that a team has 3 members | Sample 1 already catches this. |

**Complexity:** O(1) per scenario, O(T) overall.
