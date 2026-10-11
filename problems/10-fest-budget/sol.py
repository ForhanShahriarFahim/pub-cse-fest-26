import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, b = int(data[0]), int(data[1])
    dp = [0] * (b + 1)   # dp[j] = most fun with total cost at most j
    for i in range(n):
        c, f = int(data[2 + 2 * i]), int(data[3 + 2 * i])
        if c > b:
            continue
        # new dp[j] for j >= c uses the OLD dp[j - c], so each activity is used at most once
        dp[c:] = [x if x >= y + f else y + f for x, y in zip(dp[c:], dp)]
    print(dp[b])


main()
