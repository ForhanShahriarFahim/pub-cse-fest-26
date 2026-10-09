import sys


def main():
    data = sys.stdin.read().split()
    t, p, n = int(data[0]), int(data[1]), int(data[2])
    ac_time = [[-1] * p for _ in range(t + 1)]
    rejected = [[0] * p for _ in range(t + 1)]
    pos = 3
    for _ in range(n):
        minute, team, prob, verdict = int(data[pos]), int(data[pos + 1]), data[pos + 2], data[pos + 3]
        pos += 4
        j = ord(prob) - ord("A")
        if ac_time[team][j] != -1:
            continue
        if verdict == "AC":
            ac_time[team][j] = minute
        elif verdict != "CE":
            rejected[team][j] += 1
    out, best, best_key = [], 1, None
    for i in range(1, t + 1):
        solved = penalty = 0
        for j in range(p):
            if ac_time[i][j] != -1:
                solved += 1
                penalty += ac_time[i][j] + 20 * rejected[i][j]
        out.append(f"{solved} {penalty}")
        key = (-solved, penalty)
        if best_key is None or key < best_key:
            best, best_key = i, key
    out.append(str(best))
    print("\n".join(out))


main()
