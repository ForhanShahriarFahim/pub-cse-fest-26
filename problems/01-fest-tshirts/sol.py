import sys

def main():
    data = sys.stdin.buffer.read().split()
    t = int(data[0])
    out = []
    for i in range(t):
        n, v, j, k, c = map(int, data[1 + 5 * i: 6 + 5 * i])
        people = 3 * n + v + j
        packs = (people + k - 1) // k
        out.append(f"{packs} {packs * c}")
    print("\n".join(out))

main()
