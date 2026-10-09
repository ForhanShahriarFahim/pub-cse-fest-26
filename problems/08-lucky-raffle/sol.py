import sys
from itertools import accumulate

M = 10**6


def main():
    is_prime = bytearray([1]) * (M + 1)
    is_prime[0] = is_prime[1] = 0
    i = 2
    while i * i <= M:
        if is_prime[i]:
            is_prime[i * i::i] = bytes(len(range(i * i, M + 1, i)))
        i += 1
    cnt = list(accumulate(is_prime))   # cnt[i] = number of primes in 0..i

    data = sys.stdin.buffer.read().split()
    q = int(data[0])
    out = []
    for k in range(q):
        l, r = int(data[1 + 2 * k]), int(data[2 + 2 * k])
        out.append(cnt[r] - cnt[l - 1])
    print("\n".join(map(str, out)))


main()
