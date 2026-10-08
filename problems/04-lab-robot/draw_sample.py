"""Draws sample.svg and sample.png from sample.txt.

Usage: python3 draw_sample.py   (needs node + playwright for the PNG; see tools/svg2png.js)

Left: the lab grid. Every successful command is one arrow, an ignored command is a
red cross on the edge or desk Robu bumped into, and each visited cell carries the
order in which it was first reached. Right: the same walk as a step table with a
running count of different cells. Everything is computed from sample.txt.
"""
import os
import shutil
import subprocess
from html import escape

HERE = os.path.dirname(os.path.abspath(__file__))

# Palette (light only: the picture sits on HackerRank's white statement page).
INK, MUTED, LINE = "#1f2638", "#5d6578", "#c9d0dd"
FREE, VISITED, DESK, DESK_INK = "#ffffff", "#fff1c9", "#3f4759", "#a3adc2"
MOVE, BAD, START, BADGE = "#2457c5", "#d23a2f", "#178a4c", "#9a6b08"
HEAD_BG, ZEBRA = "#eef1f7", "#f7f8fb"
SANS = "Inter, 'DejaVu Sans', sans-serif"
MONO = "'DejaVu Sans Mono', monospace"

CELL = 56
GX, GY = 42, 44                 # grid origin (room for row / column numbers)

STEP = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}
WORD = {"U": "up", "D": "down", "L": "left", "R": "right"}


def simulate(grid, moves):
    n, m = len(grid), len(grid[0])
    pos = next((i, row.index("S")) for i, row in enumerate(grid) if "S" in row)
    order = {pos: 1}
    trace = [("", "starts at S", pos, 1, "start")]
    arrows, bumps = [], []
    for k, ch in enumerate(moves, 1):
        di, dj = STEP[ch]
        nxt = (pos[0] + di, pos[1] + dj)
        if not (0 <= nxt[0] < n and 0 <= nxt[1] < m):
            bumps.append((pos, ch))
            trace.append((ch, "ignored: edge of lab", pos, len(order), "bad"))
            continue
        if grid[nxt[0]][nxt[1]] == "#":
            bumps.append((pos, ch))
            trace.append((ch, f"ignored: desk at ({nxt[0] + 1},{nxt[1] + 1})", pos, len(order), "bad"))
            continue
        arrows.append((pos, nxt))
        pos = nxt
        if pos in order:
            trace.append((ch, f"moves {WORD[ch]} (seen before)", pos, len(order), "old"))
        else:
            order[pos] = len(order) + 1
            trace.append((ch, f"moves {WORD[ch]}, new cell", pos, len(order), "new"))
    return order, trace, arrows, bumps, pos


def center(cell):
    i, j = cell
    return GX + j * CELL + CELL / 2, GY + i * CELL + CELL / 2


def arrow(x1, y1, x2, y2, color, width=3.2):
    """Line with a solid triangular head ending exactly at (x2, y2)."""
    dx, dy = x2 - x1, y2 - y1
    length = (dx * dx + dy * dy) ** 0.5
    ux, uy = dx / length, dy / length
    head, half = 10, 5
    bx, by = x2 - ux * head, y2 - uy * head
    px, py = -uy * half, ux * half
    return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{bx:.1f}" y2="{by:.1f}" stroke="{color}" '
            f'stroke-width="{width}" stroke-linecap="round"/>'
            f'<polygon points="{x2:.1f},{y2:.1f} {bx + px:.1f},{by + py:.1f} {bx - px:.1f},{by - py:.1f}" fill="{color}"/>')


def cross(x, y, color, s=6):
    return (f'<g stroke="{color}" stroke-width="3" stroke-linecap="round">'
            f'<line x1="{x - s}" y1="{y - s}" x2="{x + s}" y2="{y + s}"/>'
            f'<line x1="{x - s}" y1="{y + s}" x2="{x + s}" y2="{y - s}"/></g>')


def text(x, y, s, size=12, color=INK, weight=400, anchor="start", family=SANS):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{color}" text-anchor="{anchor}" dominant-baseline="central">{escape(s)}</text>')


def draw(grid, moves):
    n, m = len(grid), len(grid[0])
    order, trace, arrows, bumps, end = simulate(grid, moves)
    start = next(iter(order))
    gw, gh = m * CELL, n * CELL
    out = []

    # Row and column numbers.
    for j in range(m):
        out.append(text(GX + j * CELL + CELL / 2, GY - 22, str(j + 1), 13, MUTED, 500, "middle"))
    for i in range(n):
        out.append(text(GX - 18, GY + i * CELL + CELL / 2, str(i + 1), 13, MUTED, 500, "middle"))

    # Cells.
    for i in range(n):
        for j in range(m):
            x, y = GX + j * CELL, GY + i * CELL
            if grid[i][j] == "#":
                out.append(f'<rect x="{x}" y="{y}" width="{CELL}" height="{CELL}" fill="{DESK}" stroke="#ffffff" stroke-width="1.5"/>')
                out.append(text(x + CELL / 2, y + CELL / 2 + 1, "#", 18, DESK_INK, 700, "middle", MONO))
            else:
                fill = VISITED if (i, j) in order else FREE
                out.append(f'<rect x="{x}" y="{y}" width="{CELL}" height="{CELL}" fill="{fill}" stroke="{LINE}" stroke-width="1"/>')
    out.append(f'<rect x="{GX}" y="{GY}" width="{gw}" height="{gh}" fill="none" stroke="{INK}" stroke-width="2"/>')

    # Visit-order badges (top-left corner of each visited cell).
    for (i, j), k in order.items():
        bx, by = GX + j * CELL + 9.5, GY + i * CELL + 9.5
        out.append(f'<circle cx="{bx}" cy="{by}" r="7.5" fill="{BADGE}"/>')
        out.append(text(bx, by + 0.5, str(k), 10, "#ffffff", 700, "middle"))

    # Moves: one arrow per successful command. An edge walked in both directions
    # gets two lanes, each shifted to the right-hand side of its direction.
    undirected = {}
    for a, b in arrows:
        undirected[frozenset((a, b))] = undirected.get(frozenset((a, b)), 0) + 1
    for a, b in arrows:
        (x1, y1), (x2, y2) = center(a), center(b)
        dx, dy = (x2 - x1) / CELL, (y2 - y1) / CELL
        off = 6 if undirected[frozenset((a, b))] > 1 else 0
        ox, oy = -dy * off, dx * off
        trim_a = 17 if a in (start, end) else 3
        trim_b = 18 if b in (start, end) else 5
        out.append(arrow(x1 + dx * trim_a + ox, y1 + dy * trim_a + oy,
                         x2 - dx * trim_b + ox, y2 - dy * trim_b + oy, MOVE))

    # Ignored commands: a dashed stub from Robu to the edge / desk it bumped into.
    for cell, ch in bumps:
        cx, cy = center(cell)
        di, dj = STEP[ch]
        trim = 17 if cell in (start, end) else 6
        sx, sy = cx + dj * trim, cy + di * trim
        ex, ey = cx + dj * CELL / 2, cy + di * CELL / 2
        out.append(f'<line x1="{sx}" y1="{sy}" x2="{ex}" y2="{ey}" stroke="{BAD}" stroke-width="2.4" stroke-dasharray="3 3"/>')
        out.append(cross(ex, ey, BAD))

    # Start and end markers.
    sx, sy = center(start)
    out.append(f'<circle cx="{sx}" cy="{sy}" r="14" fill="{START}"/>')
    out.append(text(sx, sy + 0.5, "S", 14, "#ffffff", 700, "middle"))
    ex, ey = center(end)
    out.append(f'<circle cx="{ex}" cy="{ey}" r="14" fill="{MOVE}"/>')
    out.append(text(ex, ey + 0.5, "E", 14, "#ffffff", 700, "middle"))

    # Step table, top-aligned with the grid and exactly as tall.
    tx = GX + gw + 36
    cols = [("Step", 44, "middle"), ("Cmd", 42, "middle"), ("What happens", 190, "start"),
            ("Position", 76, "middle"), ("Cells", 52, "middle")]
    tw = sum(c[1] for c in cols)
    head = 26
    row_h = (gh - head) / len(trace)
    out.append(f'<rect x="{tx}" y="{GY}" width="{tw}" height="{head}" fill="{HEAD_BG}"/>')
    x = tx
    for name, w, anchor in cols:
        ax = x + w / 2 if anchor == "middle" else x + 8
        out.append(text(ax, GY + head / 2, name, 12.5, MUTED, 600, anchor))
        x += w
    for r, (ch, what, pos, cnt, kind) in enumerate(trace):
        y = GY + head + r * row_h
        if r % 2 == 1:
            out.append(f'<rect x="{tx}" y="{y:.1f}" width="{tw}" height="{row_h:.1f}" fill="{ZEBRA}"/>')
        mid = y + row_h / 2
        color = BAD if kind == "bad" else INK
        cells = [str(r) if r else "–", ch, what, f"({pos[0] + 1}, {pos[1] + 1})", str(cnt)]
        x = tx
        for c, (val, (_, w, anchor)) in enumerate(zip(cells, cols)):
            ax = x + w / 2 if anchor == "middle" else x + 8
            weight, fam, col = 400, SANS, color
            if c == 1:
                weight, fam = 700, MONO
            if c == 4:
                weight = 700 if kind in ("new", "start") else 400
                col = BADGE if kind in ("new", "start") else MUTED
            if c in (0, 3):
                col = MUTED if c == 0 else color
            out.append(text(ax, mid, val, 13, col, weight, anchor, fam))
            x += w
    out.append(f'<rect x="{tx}" y="{GY}" width="{tw}" height="{gh}" fill="none" stroke="{LINE}" stroke-width="1"/>')

    # Legend and result, one line under both parts.
    ly = GY + gh + 34
    lx = GX
    def item(mark, mark_w, label):
        nonlocal lx
        out.append(mark(lx))
        out.append(text(lx + mark_w + 8, ly, label, 13, INK))
        lx += mark_w + 8 + len(label) * 6.7 + 26

    item(lambda x: f'<circle cx="{x + 9}" cy="{ly}" r="9" fill="{START}"/>' + text(x + 9, ly + 0.5, "S", 10, "#ffffff", 700, "middle"), 18, "start")
    item(lambda x: f'<circle cx="{x + 9}" cy="{ly}" r="9" fill="{MOVE}"/>' + text(x + 9, ly + 0.5, "E", 10, "#ffffff", 700, "middle"), 18, "end")
    item(lambda x: arrow(x, ly, x + 30, ly, MOVE, 2.8), 30, "one move")
    item(lambda x: f'<line x1="{x}" y1="{ly}" x2="{x + 18}" y2="{ly}" stroke="{BAD}" stroke-width="2.4" stroke-dasharray="3 3"/>' + cross(x + 22, ly, BAD, 5), 28, "ignored command")
    item(lambda x: f'<circle cx="{x + 8}" cy="{ly}" r="8" fill="{BADGE}"/>' + text(x + 8, ly + 0.5, "3", 10, "#ffffff", 700, "middle"), 16, "order a cell was first reached")
    item(lambda x: f'<rect x="{x}" y="{ly - 9}" width="18" height="18" fill="{DESK}"/>' + text(x + 9, ly + 1, "#", 12, DESK_INK, 700, "middle", MONO), 18, "desk")

    ry = ly + 30
    out.append(text(GX, ry, f"Result: Robu ends at row {end[0] + 1}, column {end[1] + 1}, "
                            f"and has stood on {len(order)} different cells.", 14, INK, 600))

    width = tx + tw + 20
    height = ry + 22
    label = (f"Robu's walk for the sample: it ends at row {end[0] + 1}, column {end[1] + 1}, "
             f"after standing on {len(order)} different cells; three commands are ignored.")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height:.0f}" '
            f'width="{width:.0f}" height="{height:.0f}" role="img" aria-label="{escape(label)}">'
            f'<rect width="100%" height="100%" fill="#ffffff"/>' + "".join(out) + "</svg>")


def draw_simple(grid, moves):
    """Grid only: visited cells shaded, one arrow per move, a cross per ignored command."""
    n, m = len(grid), len(grid[0])
    order, _, arrows, bumps, end = simulate(grid, moves)
    start = next(iter(order))
    gw, gh = m * CELL, n * CELL
    out = []
    for j in range(m):
        out.append(text(GX + j * CELL + CELL / 2, GY - 22, str(j + 1), 13, MUTED, 500, "middle"))
    for i in range(n):
        out.append(text(GX - 18, GY + i * CELL + CELL / 2, str(i + 1), 13, MUTED, 500, "middle"))
    for i in range(n):
        for j in range(m):
            x, y = GX + j * CELL, GY + i * CELL
            if grid[i][j] == "#":
                out.append(f'<rect x="{x}" y="{y}" width="{CELL}" height="{CELL}" fill="{DESK}" stroke="#ffffff" stroke-width="1.5"/>')
                out.append(text(x + CELL / 2, y + CELL / 2 + 1, "#", 18, DESK_INK, 700, "middle", MONO))
            else:
                fill = VISITED if (i, j) in order else FREE
                out.append(f'<rect x="{x}" y="{y}" width="{CELL}" height="{CELL}" fill="{fill}" stroke="{LINE}" stroke-width="1"/>')
    out.append(f'<rect x="{GX}" y="{GY}" width="{gw}" height="{gh}" fill="none" stroke="{INK}" stroke-width="2"/>')

    undirected = {}
    for a, b in arrows:
        undirected[frozenset((a, b))] = undirected.get(frozenset((a, b)), 0) + 1
    for a, b in arrows:
        (x1, y1), (x2, y2) = center(a), center(b)
        dx, dy = (x2 - x1) / CELL, (y2 - y1) / CELL
        off = 6 if undirected[frozenset((a, b))] > 1 else 0
        ox, oy = -dy * off, dx * off
        trim_a = 17 if a in (start, end) else 3
        trim_b = 18 if b in (start, end) else 5
        out.append(arrow(x1 + dx * trim_a + ox, y1 + dy * trim_a + oy,
                         x2 - dx * trim_b + ox, y2 - dy * trim_b + oy, MOVE))
    for cell, ch in bumps:
        cx, cy = center(cell)
        di, dj = STEP[ch]
        out.append(cross(cx + dj * CELL / 2, cy + di * CELL / 2, BAD, 7))

    sx, sy = center(start)
    out.append(f'<circle cx="{sx}" cy="{sy}" r="14" fill="{START}"/>')
    out.append(text(sx, sy + 0.5, "S", 14, "#ffffff", 700, "middle"))
    ex, ey = center(end)
    out.append(f'<circle cx="{ex}" cy="{ey}" r="14" fill="{MOVE}"/>')
    out.append(text(ex, ey + 0.5, "E", 14, "#ffffff", 700, "middle"))

    ly = GY + gh + 30
    lx = GX

    def item(mark, mark_w, label):
        nonlocal lx
        out.append(mark(lx))
        out.append(text(lx + mark_w + 7, ly, label, 13, INK))
        lx += mark_w + 7 + len(label) * 6.3 + 22

    item(lambda x: f'<circle cx="{x + 9}" cy="{ly}" r="9" fill="{START}"/>' + text(x + 9, ly + 0.5, "S", 10, "#ffffff", 700, "middle"), 18, "start")
    item(lambda x: f'<circle cx="{x + 9}" cy="{ly}" r="9" fill="{MOVE}"/>' + text(x + 9, ly + 0.5, "E", 10, "#ffffff", 700, "middle"), 18, "end")
    item(lambda x: arrow(x, ly, x + 26, ly, MOVE, 2.8), 26, "move")
    item(lambda x: cross(x + 7, ly, BAD, 6), 14, "ignored")
    item(lambda x: f'<rect x="{x}" y="{ly - 8}" width="16" height="16" fill="{VISITED}" stroke="{LINE}"/>', 16, "visited")
    ry = ly + 28
    out.append(text(GX, ry, f"Ends at row {end[0] + 1}, column {end[1] + 1} · {len(order)} different cells", 14, INK, 600))

    width = max(GX + gw, lx) + 16
    height = ry + 20
    label = (f"Robu's walk for the sample: it ends at row {end[0] + 1}, column {end[1] + 1}, "
             f"after standing on {len(order)} different cells; three commands are ignored.")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height:.0f}" '
            f'width="{width:.0f}" height="{height:.0f}" role="img" aria-label="{escape(label)}">'
            f'<rect width="100%" height="100%" fill="#ffffff"/>' + "".join(out) + "</svg>")


# Which style becomes sample.png (the file the statement uses).
STATEMENT_STYLE = "simple"


def main():
    lines = open(os.path.join(HERE, "sample.txt")).read().split("\n")
    n, _ = map(int, lines[0].split())
    grid, moves = lines[1:1 + n], lines[2 + n].strip()
    tool = os.path.join(HERE, "..", "..", "tools", "svg2png.js")
    for style, fn in (("detailed", draw), ("simple", draw_simple)):
        svg_path = os.path.join(HERE, f"sample_{style}.svg")
        open(svg_path, "w").write(fn(grid, moves))
        subprocess.run(["node", tool, svg_path, os.path.join(HERE, f"sample_{style}.png"), "2"], check=True)
    shutil.copy(os.path.join(HERE, f"sample_{STATEMENT_STYLE}.png"), os.path.join(HERE, "sample.png"))
    print(f"sample.png = {STATEMENT_STYLE} style")


if __name__ == "__main__":
    main()
