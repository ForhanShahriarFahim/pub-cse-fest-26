# Editorial: Fest ID Checker (Giveaway)

**Idea.** Read each ID as a string and check the five rules one by one, in the
order they are written. Check the **length first**, because every other rule
uses fixed positions (indices 0 to 10 in 0-based indexing).

```
length == 11
s[0..2] == "CSE"
s[3] == '-' and s[6] == '-'
s[4], s[5], s[7], s[8], s[9], s[10] are all digits
20 <= (s[4]-'0')*10 + (s[5]-'0') <= 26
s[7..10] != "0000"
```

**Traps (each one is caught by the official tests):**

| Mistake | Example that catches it |
|---|---|
| Not checking that the length is exactly 11 | `CSE-22-12345` (sample) |
| Comparing `CSE` case-insensitively | `cse-26-1042` (sample) |
| Off-by-one on the year range (`<` vs `<=`) | `CSE-19-...`, `CSE-26-...` |
| Forgetting the `0000` rule | `CSE-24-0000` (sample) |
| Not checking the hyphens | `CSE_23_1234` |
| Checking digits only in the serial, not in the year | `CSE-1:-1234`: `':' - '0'` is 10, so the "year" becomes 20 and passes the range check |
| Reading characters past the end of a short string | `C`, `CSE-` (in C/C++ this is undefined behaviour; check the length first) |

**Complexity:** O(|S|) per ID.
