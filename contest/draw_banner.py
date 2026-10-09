"""Draws the HackerRank contest banner (banner.png) and a preview of the landing page.

Usage: python3 contest/draw_banner.py   (needs node + playwright; see tools/svg2png.js)

HackerRank prints the contest name, the date and a Sign Up button in the MIDDLE of
the banner, so the middle is kept clear and the fest logo sits on the right.
The logo's own navy background is faded into a matching navy so no square edge shows.
"""
import base64
import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.join(HERE, "..", "tools", "svg2png.js")

W, H = 1920, 480
EDGE, MID, GLOW = "#021637", "#04184d", "#0c1a66"   # sampled from the logo background
CYAN, WHITE = "#3fb4e8", "#ffffff"

LOGO_SIZE = 988                       # fest-logo.jpg is 988 x 988
ART_CX, ART_CY, ART_H = 471, 508, 592  # centre and height of the artwork inside it
SHOW_ART_H = 250                       # artwork height on the banner
LOGO_AT = (1520, 240)                  # where the artwork centre goes on the banner


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
    """Faint code symbols on the left, fading out before the centre."""
    out = []
    glyphs = [("{ }", 250, 150, 64), ("</>", 420, 330, 92), ("01", 140, 380, 40), (";", 560, 120, 54),
              ("()", 330, 70, 40), ("[ ]", 610, 410, 40), ("#", 120, 230, 48), ("++", 520, 250, 40)]
    for g, x, y, size in glyphs:
        out.append(f'<text x="{x}" y="{y}" font-family="DejaVu Sans Mono, monospace" font-size="{size}" '
                   f'font-weight="700" fill="{CYAN}" text-anchor="middle" dominant-baseline="central">'
                   f'{g.replace("<", "&lt;").replace(">", "&gt;")}</text>')
    return f'<g opacity="0.16" mask="url(#leftfade)">{"".join(out)}</g>'


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
  <radialGradient id="glowR" cx="{LOGO_AT[0] / W}" cy="0.5" r="0.32" gradientTransform="translate({LOGO_AT[0] / W} 0.5) scale(1 4) translate({-LOGO_AT[0] / W} -0.5)">
    <stop offset="0" stop-color="{GLOW}" stop-opacity="1"/><stop offset="1" stop-color="{GLOW}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowL" cx="0.2" cy="0.5" r="0.25" gradientTransform="translate(0.2 0.5) scale(1 4) translate(-0.2 -0.5)">
    <stop offset="0" stop-color="#0b2a7a" stop-opacity="0.8"/><stop offset="1" stop-color="#0b2a7a" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="lf" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.25" stop-color="#fff"/><stop offset="0.36" stop-color="#000"/></linearGradient>
  <mask id="leftfade"><rect width="{W}" height="{H}" fill="url(#lf)"/></mask>
  <linearGradient id="eg" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.3" stop-color="#000"/><stop offset="0.7" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
  <mask id="edges"><rect width="{W}" height="{H}" fill="url(#eg)"/></mask>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#glowL)"/>
<rect width="{W}" height="{H}" fill="url(#glowR)"/>
{dots()}
{code_motif()}
{logo_layer()}
<rect y="{H - 6}" width="{W}" height="6" fill="{CYAN}" opacity="0.85"/>
</svg>'''


def preview_svg(view_w=1536, view_h=300):
    """Roughly how HackerRank shows it: banner centred at natural size, text on top.
    Text sizes are measured from a screenshot of the real landing page."""
    x0 = (W - view_w) / 2
    y0 = (H - view_h) / 2
    img = base64.b64encode(open(os.path.join(HERE, "banner.png"), "rb").read()).decode()
    font = "Inter, 'DejaVu Sans', sans-serif"
    cx = view_w / 2
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w} {view_h}" width="{view_w}" height="{view_h}">
<image href="data:image/png;base64,{img}" x="{-x0}" y="{-y0}" width="{W}" height="{H}"/>
<text x="{cx}" y="78" font-family="{font}" font-size="34" fill="#fff" text-anchor="middle">PUB CSE Fest-26 Programming Contest</text>
<text x="{cx}" y="140" font-family="{font}" font-size="18" font-weight="600" fill="#fff" text-anchor="middle">Oct 31 2026, 10:00 am BDT to Oct 31 2026, 12:30 pm BDT</text>
<rect x="{cx - 54}" y="172" width="108" height="48" fill="#1ba94c"/>
<text x="{cx}" y="203" font-family="{font}" font-size="19" font-weight="600" fill="#fff" text-anchor="middle">Sign Up</text>
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
