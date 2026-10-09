# Editorial: Fest Scoreboard (Easy, implementation)

**Idea.** Keep two small tables indexed by `[team][problem]`:

- `acTime[team][prob]`: the minute of the first `AC`, or -1 while unsolved.
- `rejected[team][prob]`: the number of `WA`/`TLE`/`RE` before that first `AC`.

Process the log in order:

```
if acTime[team][prob] != -1: skip              # already solved, ignore
else if verdict == AC:  acTime[team][prob] = minute
else if verdict != CE:  rejected[team][prob] += 1
```

Then, for each team, add up `acTime + 20 * rejected` over its solved problems.
Find the winner with one scan: switch to team i only if it solved **more**, or the
**same** number with a **strictly smaller** penalty. Starting from team 1 and using a
strict `<` keeps the smaller team number on a full tie.

**Traps (each one is caught by the official tests):**

| Mistake | Why it is wrong |
|---|---|
| Counting `WA` after the first `AC` | Rule 1: later submissions are ignored. |
| Counting `CE` as rejected | Rule 3. |
| Adding 20 per wrong try on unsolved problems | Rule 4. |
| A second `AC` counts the problem again | Only the first `AC` solves it. |
| Adding 20 once instead of 20 × (number of tries) | Rule 2. |
| One wrong-try counter per team instead of per problem | Tries on problem A must not affect problem B. |
| Using the time of the first submission instead of the `AC` time | Rule 2. |
| `<=` in the winner check | On a full tie the **smaller** team number must win. |
| Ignoring penalty when picking the winner | Equal solves are broken by penalty. |

**Complexity:** O(N + T·P) time, O(T·P) memory. The penalty is at most about 2·10⁶, so `int` is enough.
