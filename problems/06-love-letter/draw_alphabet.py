"""Draws alphabet.svg / alphabet.png: how a Caesar shift with K = 3 works.

Usage: python3 draw_alphabet.py   (needs node + playwright; see tools/svg2png.js)

Top: the alphabet and the letter each one becomes with K = 3 (X, Y, Z wrap around).
Bottom: the statement's example, character by character, computed with encrypt().
"""
import os
import subprocess
from html import escape

from encrypt import encrypt

HERE = os.path.dirname(os.path.abspath(__file__))
K = 3
EXAMPLE = "I love C++ <3"

INK, MUTED, LINE = "#1f2638", "#5d6578", "#c9d0dd"
ROSE, ROSE_BG, ROSE_WRAP = "#b8255f", "#fde8f0", "#f7c4d7"
GREY_BG = "#eef0f4"
SANS = "Inter, 'DejaVu Sans', sans-serif"
MONO = "'DejaVu Sans Mono', monospace"

LABEL_W = 112           # left column for row labels
COL = 24                # alphabet column pitch
TW, TH = 21, 26         # tile size


def text(x, y, s, size=13, color=INK, weight=400, anchor="start", family=SANS):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{color}" text-anchor="{anchor}" dominant-baseline="central">{escape(s)}</text>')


def tile(cx, y, ch, fill, color, stroke=LINE, w=TW):
    return (f'<rect x="{cx - w / 2:.1f}" y="{y}" width="{w}" height="{TH}" rx="4" fill="{fill}" stroke="{stroke}"/>'
            + text(cx, y + TH / 2 + 1, ch, 14, color, 600, "middle", MONO))


def down_arrow(cx, y1, y2, color):
    return (f'<line x1="{cx}" y1="{y1}" x2="{cx}" y2="{y2 - 5}" stroke="{color}" stroke-width="1.6"/>'
            f'<polygon points="{cx},{y2} {cx - 3.5},{y2 - 6} {cx + 3.5},{y2 - 6}" fill="{color}"/>')


def draw():
    out = []
    x0 = LABEL_W

    # Part 1: the shifted alphabet.
    out.append(text(16, 18, f"With key K = {K}, every letter moves {K} places later in the alphabet", 14, INK, 600))
    top, bottom = 40, 90
    out.append(text(16, top + TH / 2, "Original", 13, MUTED, 500))
    out.append(text(16, bottom + TH / 2, "Encrypted", 13, MUTED, 500))
    for i in range(26):
        cx = x0 + i * COL + COL / 2
        plain = chr(65 + i)
        enc = encrypt(plain, K)
        wraps = i + K >= 26
        out.append(tile(cx, top, plain, "#ffffff", INK))
        out.append(down_arrow(cx, top + TH + 3, bottom - 3, ROSE if wraps else LINE))
        out.append(tile(cx, bottom, enc, ROSE_WRAP if wraps else ROSE_BG, ROSE, ROSE if wraps else LINE))
    # Bracket under the wrapping letters.
    wx1 = x0 + (26 - K) * COL + 2
    wx2 = x0 + 26 * COL - 2
    by = bottom + TH + 8
    out.append(f'<path d="M{wx1},{by} v5 H{wx2} v-5" fill="none" stroke="{ROSE}" stroke-width="1.6"/>')
    out.append(text(wx2, by + 18, "Z wraps around to A", 12, ROSE, 600, "end"))
    out.append(text(x0, by + 18, "Lowercase letters move the same way: a → d, x → a", 12, MUTED))

    # Part 2: the example from the statement.
    ey = by + 52
    enc_example = encrypt(EXAMPLE, K)
    out.append(text(16, ey, f"Example: “{EXAMPLE}” becomes “{enc_example}”", 14, INK, 600))
    etop, ebottom = ey + 22, ey + 72
    out.append(text(16, etop + TH / 2, "Original", 13, MUTED, 500))
    out.append(text(16, ebottom + TH / 2, "Encrypted", 13, MUTED, 500))
    pitch = 32
    for i, (a, b) in enumerate(zip(EXAMPLE, enc_example)):
        cx = x0 + i * pitch + pitch / 2
        is_letter = a.isalpha()
        shown_a = "␣" if a == " " else a
        shown_b = "␣" if b == " " else b
        out.append(tile(cx, etop, shown_a, "#ffffff" if is_letter else GREY_BG, INK if is_letter else MUTED, w=26))
        out.append(down_arrow(cx, etop + TH + 3, ebottom - 3, ROSE if is_letter else LINE))
        out.append(tile(cx, ebottom, shown_b, ROSE_BG if is_letter else GREY_BG,
                        ROSE if is_letter else MUTED, w=26))
    lx = x0 + len(EXAMPLE) * pitch + 22
    out.append(f'<rect x="{lx}" y="{etop + 4}" width="16" height="16" rx="3" fill="{ROSE_BG}" stroke="{LINE}"/>')
    out.append(text(lx + 24, etop + 12, f"letter: moves {K} places", 12, INK))
    out.append(f'<rect x="{lx}" y="{etop + 30}" width="16" height="16" rx="3" fill="{GREY_BG}" stroke="{LINE}"/>')
    out.append(text(lx + 24, etop + 38, "space or symbol: unchanged", 12, INK))
    out.append(text(lx, etop + 64, "␣ = space", 12, MUTED))

    # Footer: the rule both ways.
    fy = ebottom + TH + 34
    out.append(text(16, fy, f"To encrypt, move each letter K places forward.  To decrypt, move it K places back.", 13, INK, 600))

    width = x0 + 26 * COL + 16
    height = fy + 20
    label = (f"Caesar shift with key {K}: each letter moves {K} places later, X Y Z wrap to A B C; "
             f"'{EXAMPLE}' becomes '{enc_example}', spaces and symbols unchanged.")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} {height:.0f}" '
            f'width="{width:.0f}" height="{height:.0f}" role="img" aria-label="{escape(label)}">'
            f'<rect width="100%" height="100%" fill="#ffffff"/>' + "".join(out) + "</svg>")


def main():
    svg_path = os.path.join(HERE, "alphabet.svg")
    open(svg_path, "w").write(draw())
    tool = os.path.join(HERE, "..", "..", "tools", "svg2png.js")
    subprocess.run(["node", tool, svg_path, os.path.join(HERE, "alphabet.png"), "2"], check=True)


if __name__ == "__main__":
    main()
