"""Draws sample.png from sample.txt: python3 draw_sample.py"""
from PIL import Image, ImageDraw, ImageFont

CELL, PAD = 72, 56
INK, GRID, DESK, FREE = "#1f2937", "#cbd5e1", "#475569", "#ffffff"
START, END, PATH, BLOCK = "#16a34a", "#2563eb", "#f59e0b", "#dc2626"

lines = open("sample.txt").read().split("\n")
r, c = map(int, lines[0].split())
grid = lines[1:1 + r]
moves = lines[2 + r].strip()

font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
W, H = PAD + c * CELL + 24, PAD + r * CELL + 24
img = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(img)


def box(i, j):
    x0, y0 = PAD + j * CELL, PAD + i * CELL
    return x0, y0, x0 + CELL, y0 + CELL


def center(i, j):
    x0, y0, x1, y1 = box(i, j)
    return (x0 + x1) // 2, (y0 + y1) // 2


# simulate
for i, row in enumerate(grid):
    if "S" in row:
        x, y = i, row.index("S")
start = (x, y)
path, blocked = [(x, y)], []
step = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}
for ch in moves:
    nx, ny = x + step[ch][0], y + step[ch][1]
    if 0 <= nx < r and 0 <= ny < c and grid[nx][ny] != "#":
        x, y = nx, ny
        path.append((x, y))
    else:
        blocked.append(((x, y), step[ch]))
end = (x, y)
visited = set(path)

# cells
for i in range(r):
    for j in range(c):
        fill = DESK if grid[i][j] == "#" else ("#fef3c7" if (i, j) in visited else FREE)
        d.rectangle(box(i, j), fill=fill, outline=GRID, width=2)
        if grid[i][j] == "#":
            x0, y0, x1, y1 = box(i, j)
            d.text(((x0 + x1) / 2, (y0 + y1) / 2), "#", fill="white", font=font, anchor="mm")

# labels
for j in range(c):
    d.text((PAD + j * CELL + CELL / 2, PAD / 2), str(j + 1), fill=INK, font=small, anchor="mm")
for i in range(r):
    d.text((PAD / 2, PAD + i * CELL + CELL / 2), str(i + 1), fill=INK, font=small, anchor="mm")

# path
pts = [center(i, j) for i, j in path]
d.line(pts, fill=PATH, width=7, joint="curve")
for (i, j), (di, dj) in blocked:
    cx, cy = center(i, j)
    tx, ty = cx + dj * CELL * 0.42, cy + di * CELL * 0.42
    d.line([(cx, cy), (tx, ty)], fill=BLOCK, width=4)
    s = 7
    d.line([(tx - s, ty - s), (tx + s, ty + s)], fill=BLOCK, width=4)
    d.line([(tx - s, ty + s), (tx + s, ty - s)], fill=BLOCK, width=4)

for (i, j), col, label in ((start, START, "S"), (end, END, "E")):
    cx, cy = center(i, j)
    d.ellipse((cx - 18, cy - 18, cx + 18, cy + 18), fill=col)
    d.text((cx, cy), label, fill="white", font=font, anchor="mm")

img.save("sample.png")
print("saved sample.png", img.size, "visited", len(visited), "end", end[0] + 1, end[1] + 1)
