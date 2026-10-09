# Editorial: Love Letter (Easy, strings)

**Finding the key.** The original string ends with `Coder`, so the 5th character
from the end was a `C` before encryption. If it is now the character `c`, the key is

```
K = (c - 'C' + 26) % 26
```

(Trying all 26 keys and keeping the one that turns the last five characters into
`Coder` also works and is just as fast.)

**Decrypting.** Move every letter K places back, wrapping around the alphabet, and
leave everything else alone:

```
if 'a' <= ch <= 'z':  ch = (ch - 'a' - K + 26) % 26 + 'a'
if 'A' <= ch <= 'Z':  ch = (ch - 'A' - K + 26) % 26 + 'A'
```

**Reading the input.** Each string contains spaces, so read whole lines:
`getline` in C++ (after reading T, skip the rest of that first line), `fgets` in C,
`BufferedReader.readLine()` in Java, `input()` in Python.

**Traps (each one is caught by the official tests):**

| Mistake | Effect |
|---|---|
| Shifting forward instead of backward | It encrypts again instead of decrypting. |
| Subtracting K without wrapping | `a` - 3 becomes `^`, not `x`. |
| Decrypting only lowercase letters | `C++` stays `F++`. |
| Printing in all uppercase | The case must be kept. |
| Treating the symbols between `Z` and `a` in ASCII (`[`, `\`, `]`, `^`, `_` and the backtick) as letters | Those symbols must not change. |
| Shifting digits too | Digits must not change. |
| Using the first string's key for every string | Each string has its own key. |
| Computing the key as `'C' - c` | The wrong sign: it shifts the wrong way. |
| Taking the key from the first character | Only the signature `Coder` is known. |
| `cin >> T` followed by `getline` without skipping the newline | The first string read is empty. |

**Complexity:** O(total length of all strings).
