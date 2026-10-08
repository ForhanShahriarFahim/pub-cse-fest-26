def valid(s):
    if len(s) != 11:
        return False
    if s[:3] != "CSE" or s[3] != "-" or s[6] != "-":
        return False
    year, serial = s[4:6], s[7:]
    if not (year + serial).isdigit():
        return False
    if not 20 <= int(year) <= 26:
        return False
    return serial != "0000"


t = int(input())
for _ in range(t):
    print("VALID" if valid(input().strip()) else "INVALID")
