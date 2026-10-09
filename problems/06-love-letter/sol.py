def decrypt(s):
    k = (ord(s[-5]) - ord("C")) % 26
    out = []
    for ch in s:
        if "a" <= ch <= "z":
            out.append(chr((ord(ch) - 97 - k) % 26 + 97))
        elif "A" <= ch <= "Z":
            out.append(chr((ord(ch) - 65 - k) % 26 + 65))
        else:
            out.append(ch)
    return "".join(out)


t = int(input())
for _ in range(t):
    print(decrypt(input()))
