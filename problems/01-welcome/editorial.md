# Editorial: Welcome to CSE Fest-26 (Giveaway)

**Idea.** Print the two lines. No input needs to be read.

```c
printf("Welcome to PUB CSE Fest-26!\n");
printf("Code. Compete. Celebrate.\n");
```

The same program in each language is in `sol.c`, `sol.cpp`, `Solution.java` and `sol.py`.

**Traps (each one is caught by the official tests):**

| Mistake | Wrong output |
|---|---|
| Both sentences on one line | `Welcome to PUB CSE Fest-26! Code. Compete. Celebrate.` |
| Missing `!` | `Welcome to PUB CSE Fest-26` |
| Wrong capitalisation | `welcome to pub cse fest-26!` |
| `2026` instead of `26` | `Welcome to PUB CSE Fest-2026!` |
| Submitting the template's `Hello, World!` | `Hello, World!` |
| Only the first line | (second line missing) |
| Dropping the full stops | `Code Compete Celebrate` |

**Complexity:** O(1).
