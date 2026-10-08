# Editorial: Lab Robot (Easy, implementation)

**Idea.** Simulate the commands exactly as written.

1. Find the `S` cell; that is the current position `(x, y)` (0-based in code).
2. Keep a boolean array `seen[R][C]`. Mark the start as seen and set `count = 1`.
3. For each command, compute the target cell `(nx, ny)`.
   - If it is outside the grid or a `#`, skip the command (`continue`, **not** `break`).
   - Otherwise move there. If the cell was not seen before, mark it and increase `count`.
4. Print `x+1 y+1` and `count`.

**Traps (each one is caught by the official tests):**

| Mistake | Effect |
|---|---|
| Counting every move instead of distinct cells | Revisited cells are counted twice. |
| Not counting the starting cell | The answer is too small by 1. |
| Letting Robu walk through desks | The path changes. |
| `break` on the first blocked command | Later commands are lost. |
| Printing 0-based coordinates | The position is off by one. |
| Swapping `U` and `D` | Row 1 is the **top** row, so `U` decreases the row number. |
| Printing column before row | The output order is wrong. |
| Indexing `grid[nx][ny]` before the bounds check | A crash, or garbage, at the border. |

**Complexity:** O(R·C + K) time and O(R·C) memory.
