"""Draws the HackerRank contest banner (banner.png) and a preview of the landing page.

Usage: python3 contest/draw_banner.py   (needs node + playwright; see tools/svg2png.js)

HackerRank prints the contest name, the date and a Sign Up button in the MIDDLE of
the banner, so the middle is kept clear. The image is scaled to cover the header box and
anchored at the top LEFT, so narrower windows cut off the right side first: the fest
logo sits on the left (always visible) and the decorative code symbols on the right.
The logo's own navy background is faded into a matching navy so no square edge shows.
"""
import base64
import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.join(HERE, "..", "tools", "svg2png.js")

W, H = 1920, 640
EDGE, MID, GLOW = "#021637", "#04184d", "#0c1a66"   # sampled from the logo background
CYAN, WHITE = "#3fb4e8", "#ffffff"

LOGO_SIZE = 988                       # fest-logo.jpg is 988 x 988
ART_CX, ART_CY, ART_H = 471, 508, 592  # centre and height of the artwork inside it
SHOW_ART_H = 260                       # artwork height on the banner
LOGO_AT = (210, 370)                   # where the artwork centre goes on the banner


def logo_layer():
    s = SHOW_ART_H / ART_H
    size = LOGO_SIZE * s
    x, y = LOGO_AT[0] - ART_CX * s, LOGO_AT[1] - ART_CY * s
    data = base64.b64encode(open(os.path.join(HERE, "fest-logo.jpg"), "rb").read()).decode()
    return (f'<mask id="fade" maskUnits="userSpaceOnUse" x="{x - 40:.1f}" y="{y - 40:.1f}" '
            f'width="{size + 80:.1f}" height="{size + 80:.1f}">'
            f'<rect x="{x + 14:.1f}" y="{y + 14:.1f}" width="{size - 28:.1f}" height="{size - 28:.1f}" '
            f'rx="40" fill="#fff" filter="url(#soft)"/></mask>'
            f'<image href="data:image/jpeg;base64,{data}" x="{x:.1f}" y="{y:.1f}" width="{size:.1f}" '
            f'height="{size:.1f}" mask="url(#fade)"/>')


def code_motif():
    """Faint code symbols on the right, fading out before the centre."""
    out = []
    glyphs = [("{ }", 1670, 230, 64), ("</>", 1500, 430, 92), ("01", 1780, 500, 40), (";", 1360, 200, 54),
              ("()", 1590, 150, 40), ("[ ]", 1310, 530, 40), ("#", 1800, 320, 48), ("++", 1400, 340, 40)]
    for g, x, y, size in glyphs:
        out.append(f'<text x="{x}" y="{y}" font-family="DejaVu Sans Mono, monospace" font-size="{size}" '
                   f'font-weight="700" fill="{CYAN}" text-anchor="middle" dominant-baseline="central">'
                   f'{g.replace("<", "&lt;").replace(">", "&gt;")}</text>')
    return f'<g opacity="0.16" mask="url(#rightfade)">{"".join(out)}</g>'


def dots():
    """A light dot grid across the banner, strongest at the edges."""
    pts = []
    for y in range(24, H, 32):
        for x in range(24, W, 32):
            pts.append(f'<circle cx="{x}" cy="{y}" r="1.4"/>')
    return f'<g fill="{WHITE}" opacity="0.10" mask="url(#edges)">{"".join(pts)}</g>'


def banner_svg():
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
  <radialGradient id="bg" cx="0.5" cy="0.5" r="0.75">
    <stop offset="0" stop-color="{MID}"/><stop offset="1" stop-color="{EDGE}"/>
  </radialGradient>
  <radialGradient id="glowLogo" cx="{LOGO_AT[0] / W}" cy="{LOGO_AT[1] / H}" r="0.32" gradientTransform="translate({LOGO_AT[0] / W} 0.5) scale(1 4) translate({-LOGO_AT[0] / W} -0.5)">
    <stop offset="0" stop-color="{GLOW}" stop-opacity="1"/><stop offset="1" stop-color="{GLOW}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowCode" cx="0.8" cy="0.5" r="0.25" gradientTransform="translate(0.8 0.5) scale(1 4) translate(-0.8 -0.5)">
    <stop offset="0" stop-color="#0b2a7a" stop-opacity="0.8"/><stop offset="1" stop-color="#0b2a7a" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="rf" x1="1" x2="0"><stop offset="0" stop-color="#fff"/><stop offset="0.25" stop-color="#fff"/><stop offset="0.36" stop-color="#000"/></linearGradient>
  <mask id="rightfade"><rect width="{W}" height="{H}" fill="url(#rf)"/></mask>
  <linearGradient id="eg" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.3" stop-color="#000"/><stop offset="0.7" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
  <mask id="edges"><rect width="{W}" height="{H}" fill="url(#eg)"/></mask>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#glowCode)"/>
<rect width="{W}" height="{H}" fill="url(#glowLogo)"/>
{dots()}
{code_motif()}
{logo_layer()}
<rect y="{H - 6}" width="{W}" height="6" fill="{CYAN}" opacity="0.85"/>
</svg>'''


def preview_svg(view_w=1280, box_h=459, header=76):
    """How HackerRank shows the banner on a 1280 px wide window (measured from the live page):
    the image covers a box that starts behind the white header, anchored at the top left,
    so anything beyond the box width on the right is cut off."""
    scale = max(view_w / W, box_h / H)
    img = base64.b64encode(open(os.path.join(HERE, "banner.png"), "rb").read()).decode()
    font = "Inter, 'DejaVu Sans', sans-serif"
    cx = view_w / 2
    top = 150
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w} {box_h}" width="{view_w}" height="{box_h}">
<image href="data:image/png;base64,{img}" x="0" y="0" width="{W * scale:.1f}" height="{H * scale:.1f}"/>
<rect width="{view_w}" height="{header}" fill="#ffffff"/>
<text x="24" y="{header / 2 + 8}" font-family="{font}" font-size="28" font-weight="800" fill="#39424e">HackerRank</text>
<text x="{cx}" y="{top}" font-family="{font}" font-size="34" fill="#fff" text-anchor="middle">PUB CSE Fest-26 Programming Contest</text>
<text x="{cx}" y="{top + 44}" font-family="{font}" font-size="24" fill="#fff" text-anchor="middle">Celebrating 12 years of PUB CSE · Code. Compete. Celebrate.</text>
<text x="{cx}" y="{top + 98}" font-family="{font}" font-size="17" font-weight="600" fill="#fff" text-anchor="middle">Oct 30 2026, 10:00 am BDT to Oct 30 2026, 01:00 pm BDT</text>
<rect x="{cx - 54}" y="{top + 130}" width="108" height="50" fill="#2ec866"/>
<text x="{cx}" y="{top + 162}" font-family="{font}" font-size="19" font-weight="600" fill="#fff" text-anchor="middle">Sign Up</text>
</svg>'''


def render(svg, name, scale="1"):
    path = os.path.join(HERE, name + ".svg")
    open(path, "w").write(svg)
    subprocess.run(["node", TOOL, path, os.path.join(HERE, name + ".png"), scale], check=True)
    os.remove(path)


def main():
    render(banner_svg(), "banner")
    render(preview_svg(), "banner-preview")


if __name__ == "__main__":
    main()
