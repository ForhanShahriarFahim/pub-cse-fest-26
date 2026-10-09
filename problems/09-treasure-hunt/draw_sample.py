"""Draws sample.svg and sample.png from sample.txt.

Usage: python3 draw_sample.py   (needs node + playwright for the PNG; see tools/svg2png.js)

The campus map of the sample: buildings, walkways, the main gate, the clue tags, and
one shortest route for every leg (found by BFS on sample.txt, so it cannot drift).
"""
import math
import os
import subprocess
from collections import deque
from html import escape

HERE = os.path.dirname(os.path.abspath(__file__))

INK, MUTED, LINE, WALK = "#1f2638", "#5d6578", "#c9d0dd", "#aab3c5"
GATE, TAG, TAG_BG = "#178a4c", "#8a5a00", "#fff1c9"
LEGS = ["#2457c5", "#d9730d", "#8e44ad"]          # leg 1, 2, 3
SANS = "Inter, 'DejaVu Sans', sans-serif"

R_NODE = 22
CX, CY, RAD = 330, 205, 150
# Hexagon 1..6 around the centre, building 7 inside, building 8 off to the side.
POS = {i: (CX + RAD * math.cos(math.radians(180 - 60 * (i - 1))),
           CY - RAD * math.sin(math.radians(180 - 60 * (i - 1)))) for i in range(1, 7)}
POS[7] = (CX + 40, CY)
POS[8] = (CX + 270, CY)
TAG_AT = {"below": (0, 44), "above": (0, -44), "left": (-62, 0)}


def read_sample():
    tok = open(os.path.join(HERE, "sample.txt")).read().split()
    n, m = int(tok[0]), int(tok[1])
    edges = [(int(tok[2 + 2 * i]), int(tok[3 + 2 * i])) for i in range(m)]
    k = int(tok[2 + 2 * m])
    clues = [int(x) for x in tok[3 + 2 * m:3 + 2 * m + k]]
    return n, edges, clues


def bfs_path(n, adj, s, t):
    par = [0] * (n + 1)
    seen = [False] * (n + 1)
    seen[s] = True
    q = deque([s])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if not seen[v]:
                seen[v], par[v] = True, u
                q.append(v)
    assert seen[t]
    path = [t]
    while path[-1] != s:
        path.append(par[path[-1]])
    return path[::-1]


def text(x, y, s, size=13, color=INK, weight=400, anchor="start"):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{SANS}" font-size="{size}" font-weight="{weight}" '
            f'fill="{color}" text-anchor="{anchor}" dominant-baseline="central">{escape(s)}</text>')


def arrow(x1, y1, x2, y2, color, width=3.2):
    ang = math.atan2(y2 - y1, x2 - x1)
    hx, hy = x2 - 11 * math.cos(ang), y2 - 11 * math.sin(ang)
    p1 = (hx + 5.5 * math.sin(ang), hy - 5.5 * math.cos(ang))
    p2 = (hx - 5.5 * math.sin(ang), hy + 5.5 * math.cos(ang))
    return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{hx:.1f}" y2="{hy:.1f}" stroke="{color}" '
            f'stroke-width="{width}" stroke-linecap="round"/>'
            f'<polygon points="{x2:.1f},{y2:.1f} {p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}" fill="{color}"/>')


def draw():
    n, edges, clues = read_sample()
    assert n == 8 and set(POS) == set(range(1, n + 1)), "layout is made for the sample"
    adj = [[] for _ in range(n + 1)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    legs, at = [], 1
    for c in clues:
        legs.append(bfs_path(n, adj, at, c))
        at = c
    out = []

    # Walkways.
    for u, v in edges:
        (x1, y1), (x2, y2) = POS[u], POS[v]
        out.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{WALK}" stroke-width="2"/>')

    # Route arrows; a walkway used by two legs gets two lanes.
    use = {}
    for path in legs:
        for a, b in zip(path, path[1:]):
            use[frozenset((a, b))] = use.get(frozenset((a, b)), 0) + 1
    lane = {}
    for li, path in enumerate(legs):
        for a, b in zip(path, path[1:]):
            (x1, y1), (x2, y2) = POS[a], POS[b]
            L = math.hypot(x2 - x1, y2 - y1)
            dx, dy = (x2 - x1) / L, (y2 - y1) / L
            key = frozenset((a, b))
            off = 0
            if use[key] > 1:
                off = 7 if lane.get(key) is None else -7
                lane[key] = 1
                # same physical side for both directions: flip with travel direction
                off = off if a < b else -off
            ox, oy = -dy * off, dx * off
            trim = R_NODE + 5
            out.append(arrow(x1 + dx * trim + ox, y1 + dy * trim + oy,
                             x2 - dx * trim + ox, y2 - dy * trim + oy, LEGS[li]))

    # Buildings.
    for v, (x, y) in POS.items():
        if v == 1:
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R_NODE}" fill="{GATE}"/>')
            out.append(text(x, y + 1, str(v), 16, "#ffffff", 700, "middle"))
            out.append(text(x - R_NODE - 10, y, "Main gate", 13, GATE, 700, "end"))
        elif not adj[v]:
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R_NODE}" fill="#ffffff" stroke="{MUTED}" '
                       f'stroke-width="2" stroke-dasharray="5 4"/>')
            out.append(text(x, y + 1, str(v), 16, MUTED, 700, "middle"))
            out.append(text(x, y + R_NODE + 16, "no walkways", 12, MUTED, 500, "middle"))
        else:
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{R_NODE}" fill="#ffffff" stroke="{INK}" stroke-width="2"/>')
            out.append(text(x, y + 1, str(v), 16, INK, 700, "middle"))

    # Clue tags.
    where = {5: "below", 2: "above", 7: "left"}
    for i, c in enumerate(clues, 1):
        x, y = POS[c]
        tx, ty = TAG_AT[where.get(c, "above")]
        x, y = x + tx, y + ty
        out.append(f'<rect x="{x - 30:.1f}" y="{y - 12:.1f}" width="60" height="24" rx="12" '
                   f'fill="{TAG_BG}" stroke="{TAG}" stroke-width="1.5"/>')
        out.append(text(x, y + 1, f"Clue {i}", 12, TAG, 700, "middle"))

    # Legend: one line per leg, then the total.
    ly = CY + RAD + 70
    total = 0
    for i, path in enumerate(legs):
        y = ly + i * 26
        d = len(path) - 1
        total += d
        start = "the gate" if i == 0 else f"clue {i}"
        out.append(f'<line x1="40" y1="{y}" x2="70" y2="{y}" stroke="{LEGS[i]}" stroke-width="3.2" stroke-linecap="round"/>')
        out.append(text(82, y, f"Leg {i + 1}: {start} to clue {i + 1}", 13, INK, 600))
        route = " → ".join(map(str, path))
        out.append(text(300, y, f"{route}", 13, INK))
        out.append(text(560, y, f"{d} walkway{'s' if d != 1 else ''}", 13, LEGS[i], 700, "end"))
    ty = ly + len(legs) * 26 + 8
    out.append(f'<line x1="40" y1="{ty - 6}" x2="560" y2="{ty - 6}" stroke="{LINE}" stroke-width="1"/>')
    sums = " + ".join(str(len(p) - 1) for p in legs)
    out.append(text(40, ty + 12, "Total", 14, INK, 700))
    out.append(text(560, ty + 12, f"{sums} = {total} walkways", 14, INK, 700, "end"))

    width, height = 660, ty + 36
    label = (f"Sample campus: 8 buildings, the gate is building 1, building 8 has no walkways. "
             f"Clues are in buildings {', '.join(map(str, clues))}; the shortest walk is {sums} = {total} walkways.")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height:.0f}" width="{width}" '
            f'height="{height:.0f}" role="img" aria-label="{escape(label)}">'
            f'<rect width="100%" height="100%" fill="#ffffff"/>' + "".join(out) + "</svg>")


def main():
    svg_path = os.path.join(HERE, "sample.svg")
    open(svg_path, "w").write(draw())
    tool = os.path.join(HERE, "..", "..", "tools", "svg2png.js")
    subprocess.run(["node", tool, svg_path, os.path.join(HERE, "sample.png"), "2"], check=True)


if __name__ == "__main__":
    main()
