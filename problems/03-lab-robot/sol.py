import sys


def main():
    data = sys.stdin.read().split()
    r, c = int(data[0]), int(data[1])
    g = data[2:2 + r]
    moves = data[3 + r]
    x = y = 0
    for i in range(r):
        j = g[i].find("S")
        if j != -1:
            x, y = i, j
    step = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}
    seen = {(x, y)}
    for ch in moves:
        dx, dy = step[ch]
        nx, ny = x + dx, y + dy
        if 0 <= nx < r and 0 <= ny < c and g[nx][ny] != "#":
            x, y = nx, ny
            seen.add((x, y))
    print(x + 1, y + 1)
    print(len(seen))


main()
