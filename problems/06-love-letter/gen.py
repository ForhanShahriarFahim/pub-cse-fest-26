"""python3 gen.py <mode> <seed> [T]"""
import random
import string
import sys

from encrypt import encrypt

GREETINGS = ["Dear C++,", "My dearest Java,", "Sweet Python,", "Dear Debugger,", "My lovely Linux,",
             "Dear Binary Search,", "My sweet DP,", "Hey Recursion,", "Dear printf(),", "My dear Git,",
             "Dearest Segment Tree,", "Hello Vim :)", "Dear int main(),"]
BODIES = ["you are the base case of my happiness.", "every time you give me Accepted, my heart compiles!",
          "without you my life is a segmentation fault.", "I would wait O(n^2) years for you.",
          "you are my favourite #include <heart>.", "our love has no Time Limit.",
          "you complete me like a semicolon;", "I debug all night for one smile from you :)",
          "you are 100% of my 0/1 knapsack.", "my love for you grows like 2^n.",
          "even my compiler knows [you] are the one.", "you are the only key in my map<string, int>.",
          "I'd never return -1 on us.", "let's stay together till the end of the contest (5:00:00)!",
          "you made my WA turn into AC <3", "x = x + 1 every day I think of you.",
          "my_heart_rate++ whenever you appear.", "{ you } are the {braces} of my code ~ forever |"]
CLOSINGS = ["Yours forever,", "Love,", "Always yours,", "With 3000 hugs,", "XOXO,", "Your", "Truly,",
            "Still debugging my feelings,", "P.S. I love you more than CF rating!"]
SIGN = "Coder"
PRINTABLE = [chr(c) for c in range(33, 127)]


def love_letter(rnd, target_len=None):
    parts = [rnd.choice(GREETINGS)]
    parts += rnd.sample(BODIES, rnd.randint(1, 3))
    if target_len:
        while sum(len(p) + 1 for p in parts) < target_len - 40:
            parts.append(rnd.choice(BODIES))
    parts += [rnd.choice(CLOSINGS), SIGN]
    msg = " ".join(parts)
    if target_len and len(msg) > target_len:
        msg = msg[len(msg) - target_len:].lstrip()
        if not msg.startswith(tuple(string.ascii_letters)):
            msg = "x" + msg.lstrip(" ")[1:]
    return msg


def junk(rnd, length):
    """Random printable text (single spaces only) followed by the signature."""
    words, total = [], 0
    while total < length - 6:
        w = "".join(rnd.choice(PRINTABLE) for _ in range(rnd.randint(1, 8)))
        words.append(w)
        total += len(w) + 1
    return (" ".join(words) + " " + SIGN).lstrip()[-length:].lstrip() if words else SIGN


def emit(pairs):
    print(len(pairs))
    for msg, k in pairs:
        print(encrypt(msg, k))


def main():
    mode, seed = sys.argv[1], int(sys.argv[2])
    t = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    rnd = random.Random(seed)
    if mode == "small":
        t = rnd.randint(1, 5)
        pairs = []
        for _ in range(t):
            msg = love_letter(rnd) if rnd.random() < 0.6 else junk(rnd, rnd.randint(5, 30))
            pairs.append((msg, rnd.randint(0, 25)))
        emit(pairs)
    elif mode == "keys":          # one letter for every key 0..25
        emit([(love_letter(rnd), k) for k in range(26)])
    elif mode == "letters":
        emit([(love_letter(rnd), rnd.randint(0, 25)) for _ in range(t)])
    elif mode == "symbols":       # [ \ ] ^ _ ` { | } ~ digits and friends next to letters
        emit([(junk(rnd, rnd.randint(20, 200)), rnd.randint(1, 25)) for _ in range(t)])
    elif mode == "minimal":       # just the signature, or almost
        msgs = ["Coder", "I Coder", "<3 Coder", "z Coder", "Zz Coder", "A+ Coder"]
        emit([(m, rnd.randint(0, 25)) for m in msgs] + [("Coder", 0), ("Coder", 25)])
    elif mode == "max":
        emit([(love_letter(rnd, 1000) if i % 2 else junk(rnd, 1000), rnd.randint(0, 25)) for i in range(t)])
    else:
        raise SystemExit(f"unknown mode {mode}")


main()
