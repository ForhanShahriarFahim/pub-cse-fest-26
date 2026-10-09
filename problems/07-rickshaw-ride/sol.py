import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, x = int(data[0]), int(data[1])
    w = sorted(map(int, data[2:2 + n]))
    l, r, rickshaws = 0, n - 1, 0
    while l <= r:
        if l < r and w[l] + w[r] <= x:
            l += 1
        r -= 1
        rickshaws += 1
    print(rickshaws)


main()
