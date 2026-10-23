#!/usr/bin/env python3
"""Builds the printable problem set (Word .docx) for the contestants.

Usage: python3 tools/build_print.py [output.docx]
       (needs python-docx: pip install python-docx)

Everything is read from the problem folders (challenge.md, tests/input/input00.txt,
tests/output/output00.txt, *.png), so the printed copy cannot drift from HackerRank.
Each problem starts on a new page as "Problem N"; every page has a page number.
"""
import glob
import os
import re
import sys

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import challenge  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_OUT = os.path.join(ROOT, "contest", "PUB-CSE-Fest-26-Problem-Set.docx")
CONTEST = "PUB CSE Fest-26 Programming Contest"
UNIVERSITY = "Pundra University of Science & Technology"

BODY_FONT, MONO_FONT = "Calibri", "Consolas"
ACCENT = RGBColor(0x1F, 0x3A, 0x5F)
GREY = RGBColor(0x59, 0x59, 0x59)
TEXT_WIDTH = Cm(17)  # A4 (21 cm) minus 2 cm margins on both sides
IMAGE_WIDTH = Cm(12)


# ---------- low-level helpers ----------

def set_font(run, name, size=None):
    run.font.name = name
    run._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), name)
    if size:
        run.font.size = Pt(size)


def add_field(paragraph, code):
    """Inserts a Word field such as PAGE or NUMPAGES (Word fills in the value)."""
    run = paragraph.add_run()
    for tag, text in (("begin", None), (None, code), ("separate", None), (None, "1"), ("end", None)):
        if tag:
            el = OxmlElement("w:fldChar")
            el.set(qn("w:fldCharType"), tag)
        else:
            el = OxmlElement("w:instrText" if text == code else "w:t")
            el.set(qn("xml:space"), "preserve")
            el.text = text
        run._r.append(el)
    return run


def shade_box(paragraph, fill="F2F2F2", border="BFBFBF"):
    """Grey background and thin border around a paragraph (used for code / sample I/O)."""
    ppr = paragraph._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    for side in ("top", "left", "bottom", "right"):
        b = OxmlElement(f"w:{side}")
        b.set(qn("w:val"), "single")
        b.set(qn("w:sz"), "4")
        b.set(qn("w:space"), "4")
        b.set(qn("w:color"), border)
        bdr.append(b)
    ppr.append(bdr)
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    ppr.append(shd)


def bottom_rule(paragraph, color="1F3A5F", size="12"):
    ppr = paragraph._p.get_or_add_pPr()
    bdr = OxmlElement("w:pBdr")
    b = OxmlElement("w:bottom")
    b.set(qn("w:val"), "single")
    b.set(qn("w:sz"), size)
    b.set(qn("w:space"), "1")
    b.set(qn("w:color"), color)
    bdr.append(b)
    ppr.append(bdr)


def keep_with_next(paragraph):
    paragraph.paragraph_format.keep_with_next = True


# ---------- markdown (the small subset used in challenge.md) ----------

INLINE = re.compile(r"(\*\*.+?\*\*|`[^`]+`)")


def add_inline(paragraph, text, size=None):
    """Adds text with **bold** and `code` spans."""
    for part in INLINE.split(text):
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            # bold may itself contain `code`
            for sub in re.split(r"(`[^`]+`)", part[2:-2]):
                if sub.startswith("`") and sub.endswith("`"):
                    r = paragraph.add_run(sub[1:-1])
                    set_font(r, MONO_FONT, size)
                elif sub:
                    r = paragraph.add_run(sub)
                    if size:
                        r.font.size = Pt(size)
                else:
                    continue
                r.bold = True
        elif part.startswith("`") and part.endswith("`"):
            r = paragraph.add_run(part[1:-1])
            set_font(r, MONO_FONT, size)
        else:
            r = paragraph.add_run(part)
            if size:
                r.font.size = Pt(size)


def add_code(doc, lines, size=9.5):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.left_indent = Cm(0.15)
    p.paragraph_format.right_indent = Cm(0.15)
    shade_box(p)
    for i, line in enumerate(lines):
        r = p.add_run(line)
        set_font(r, MONO_FONT, size)
        if i < len(lines) - 1:
            r.add_break(WD_BREAK.LINE)
    return p


def add_image(doc, pdir, alt, name):
    pic = doc.add_paragraph()
    pic.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pic.paragraph_format.keep_with_next = True
    pic.add_run().add_picture(os.path.join(pdir, name), width=IMAGE_WIDTH)
    cap = doc.add_paragraph()
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = cap.add_run(alt)
    r.italic = True
    r.font.size = Pt(9)
    r.font.color.rgb = GREY


def add_markdown(doc, text, pdir):
    """Renders paragraphs, - bullets, 1. numbered items, > quotes, ``` code and images."""
    lines = text.split("\n")
    i, after_list = 0, False
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith("```"):
            j = i + 1
            while j < len(lines) and not lines[j].startswith("```"):
                j += 1
            add_code(doc, lines[i + 1:j])
            i = j + 1
            continue
        img = re.match(r"!\[(.*)\]\(UPLOAD (\S+) HERE\)", line)
        if img:
            add_image(doc, pdir, img[1], img[2])
            i += 1
            continue
        item = re.match(r"(- |\d+\. |> )(.*)", line)
        # Gather the item / paragraph together with its continuation lines.
        body = [item[2] if item else line.strip()]
        i += 1
        while (i < len(lines) and lines[i].strip() and not lines[i].startswith("```")
               and not re.match(r"(- |\d+\. |> |!\[)", lines[i])):
            if not item and lines[i].startswith(" "):
                break
            body.append(lines[i].strip())
            i += 1
        joined = " ".join(body)
        p = doc.add_paragraph()
        fmt = p.paragraph_format
        if item and item[1] == "- ":
            p.style = doc.styles["List Bullet"]
            fmt.space_after = Pt(2)
        elif item and item[1] == "> ":
            fmt.left_indent = Cm(0.8)
            fmt.right_indent = Cm(0.8)
            shade_box(p, fill="EAF0F7", border="1F3A5F")
        elif item:
            fmt.left_indent = Cm(0.75)
            fmt.first_line_indent = Cm(-0.75)
            fmt.tab_stops.add_tab_stop(Cm(0.75))
            fmt.space_after = Pt(2)
            p.add_run(item[1].strip() + "\t")
        is_list = bool(item) and item[1] != "> "
        if after_list and not is_list:
            fmt.space_before = Pt(6)
        after_list = is_list
        add_inline(p, joined)


# ---------- document parts ----------

def setup(doc):
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Cm(21), Cm(29.7)
    sec.left_margin = sec.right_margin = Cm(2)
    sec.top_margin, sec.bottom_margin = Cm(2), Cm(2)
    sec.header_distance = sec.footer_distance = Cm(1)

    normal = doc.styles["Normal"]
    normal.font.name = BODY_FONT
    normal.font.size = Pt(10.5)
    normal.element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), BODY_FONT)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.1

    for name, size, before, after in (("Heading 1", 20, 0, 2), ("Heading 2", 12.5, 10, 3)):
        st = doc.styles[name]
        st.font.name = BODY_FONT
        st.font.size = Pt(size)
        st.font.bold = True
        st.font.color.rgb = ACCENT
        # Drop the theme fonts so the heading really uses BODY_FONT.
        rfonts = st.element.get_or_add_rPr().get_or_add_rFonts()
        for attr in ("w:asciiTheme", "w:hAnsiTheme", "w:eastAsiaTheme", "w:cstheme"):
            rfonts.attrib.pop(qn(attr), None)
        rfonts.set(qn("w:ascii"), BODY_FONT)
        rfonts.set(qn("w:hAnsi"), BODY_FONT)
        st.paragraph_format.space_before = Pt(before)
        st.paragraph_format.space_after = Pt(after)
        st.paragraph_format.keep_with_next = True


def header_footer(section):
    section.different_first_page_header_footer = True
    hp = section.header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r = hp.add_run(CONTEST)
    r.font.size = Pt(9)
    r.font.color.rgb = GREY
    bottom_rule(hp, color="BFBFBF", size="4")

    for footer in (section.footer, section.first_page_footer):
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for part in ("Page ", "PAGE", " of ", "NUMPAGES"):
            r = add_field(fp, part) if part.isupper() else fp.add_run(part)
            r.font.size = Pt(9)
            r.font.color.rgb = GREY


def cover(doc, problems):
    logo = os.path.join(ROOT, "contest", "fest-logo.jpg")
    if os.path.exists(logo):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(24)
        p.add_run().add_picture(logo, width=Cm(4.5))

    for text, size, bold, color, after in (
            (CONTEST, 24, True, ACCENT, 4),
            (UNIVERSITY, 13, False, GREY, 2),
            ("Department of Computer Science and Engineering", 12, False, GREY, 24),
            ("Problem Set", 18, True, ACCENT, 14)):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(after)
        r = p.add_run(text)
        r.bold = bold
        r.font.size = Pt(size)
        r.font.color.rgb = color

    widths = (Cm(3), Cm(10))
    table = doc.add_table(rows=1, cols=2)
    table.style = doc.styles["Table Grid"]
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rows = [("Problem", "Title")] + [(f"Problem {n}", p["name"]) for n, p in enumerate(problems, 1)]
    for k, (a, b) in enumerate(rows):
        cells = table.rows[0].cells if k == 0 else table.add_row().cells
        for cell, text, w in zip(cells, (a, b), widths):
            cell.width = w
            para = cell.paragraphs[0]
            para.paragraph_format.space_before = Pt(3)
            para.paragraph_format.space_after = Pt(3)
            run = para.add_run(text)
            run.bold = k == 0
            if k == 0:
                shd = OxmlElement("w:shd")
                shd.set(qn("w:val"), "clear")
                shd.set(qn("w:color"), "auto")
                shd.set(qn("w:fill"), "1F3A5F")
                cell._tc.get_or_add_tcPr().append(shd)
                run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(24)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(f"This problem set has {len(problems)} problems. "
                  "Read from standard input and write to standard output. "
                  "Allowed languages: C, C++, Java, Python 3.")
    r.font.size = Pt(10.5)
    r.font.color.rgb = GREY


def problem_page(doc, number, pdir):
    _, s = challenge.parse(os.path.join(pdir, "challenge.md"))
    name = s["Challenge Name"]["blocks"][0].strip()

    label = doc.add_paragraph()
    label.paragraph_format.page_break_before = True
    label.paragraph_format.space_after = Pt(0)
    keep_with_next(label)
    r = label.add_run(f"PROBLEM {number}")
    r.bold = True
    r.font.size = Pt(11)
    r.font.color.rgb = GREY

    h = doc.add_heading(name, level=1)
    bottom_rule(h)
    h.paragraph_format.space_after = Pt(10)

    add_markdown(doc, s["Problem Statement"]["blocks"][0], pdir)
    for title, field in (("Input", "Input Format"), ("Constraints", "Constraints"),
                         ("Output", "Output Format")):
        doc.add_heading(title, level=2)
        add_markdown(doc, s[field]["blocks"][0], pdir)

    sample_in = open(os.path.join(pdir, "tests", "input", "input00.txt")).read().rstrip("\n")
    sample_out = open(os.path.join(pdir, "tests", "output", "output00.txt")).read().rstrip("\n")
    for title, data in (("Sample Input", sample_in), ("Sample Output", sample_out)):
        doc.add_heading(title, level=2)
        box = add_code(doc, data.split("\n") if data else ["(no input)"])
        if not data:
            box.runs[0].italic = True

    doc.add_heading("Explanation", level=2)
    add_markdown(doc, s["Test Cases tab"]["blocks"][0], pdir)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT
    dirs = sorted(glob.glob(os.path.join(ROOT, "problems", "[0-9][0-9]-*")))
    problems = []
    for d in dirs:
        _, s = challenge.parse(os.path.join(d, "challenge.md"))
        problems.append({"dir": d, "name": s["Challenge Name"]["blocks"][0].strip()})

    doc = Document()
    setup(doc)
    header_footer(doc.sections[0])
    cover(doc, problems)
    for n, p in enumerate(problems, 1):
        problem_page(doc, n, p["dir"])

    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    doc.save(out)
    print(f"wrote {out} ({len(problems)} problems)")


if __name__ == "__main__":
    main()
