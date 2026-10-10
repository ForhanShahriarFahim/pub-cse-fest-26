// Builds hackathon/PUB_CSE_Fest-26_Hackathon_Problem_Set.docx from content.js.
// Run from the repository root: node hackathon/build_docx.js
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, LevelFormat, PageBreak,
  Header, Footer, PageNumber, TabStopType, VerticalAlign, HeadingLevel,
} = require("docx");
const { TRACKS, PROBLEMS, FILMS } = require("./content");

const OUT = path.join(__dirname, "PUB_CSE_Fest-26_Hackathon_Problem_Set.docx");
const LOGO = path.join(__dirname, "..", "contest", "fest-logo.jpg");

const FONT = "Times New Roman";
const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 1134; // A4, 2 cm margins
const CONTENT_W = PAGE_W - 2 * MARGIN; // 9638
const SHADE = "EFEFEF";
const THIN = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const CELL_BORDERS = { top: THIN, left: THIN, bottom: THIN, right: THIN };

const CREATIVITY =
  "Be creative: the features listed above are the minimum scope. Teams are encouraged to add new features " +
  "or modify the listed ones wherever it makes the solution more useful. Well-justified additions are credited under Innovation.";

// ---------- small helpers ----------
const run = (text, o = {}) => new TextRun({ text, font: FONT, ...o });
const para = (children, o = {}) =>
  new Paragraph({ children: Array.isArray(children) ? children : [run(children)], ...o });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

function heading(text, before = 160) {
  return new Paragraph({
    keepNext: true,
    spacing: { before, after: 60 },
    children: [run(text, { bold: true, size: 23 })],
  });
}

// Light-grey box for descriptions: a one-cell borderless table, so the shade has even padding.
function shaded(text) {
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: { top: none, left: none, bottom: none, right: none, insideHorizontal: none, insideVertical: none },
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: { top: none, left: none, bottom: none, right: none },
      shading: { type: ShadingType.CLEAR, color: "auto", fill: SHADE },
      margins: { top: 90, bottom: 90, left: 140, right: 140 },
      children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 264 }, children: [run(text)] })],
    })] })],
  });
}

let listInstance = 0;
function numbered(items, o = {}) {
  const inst = ++listInstance;
  const out = [];
  for (const it of items) {
    if (typeof it === "object" && it.module) {
      out.push(new Paragraph({
        keepNext: true,
        spacing: { before: 60, after: 20 },
        children: [run(it.module, { bold: true, italics: true, size: 21 })],
      }));
    } else {
      out.push(new Paragraph({
        numbering: { reference: "num", level: 0, instance: inst },
        spacing: { after: o.after ?? 45, line: 266 },
        children: [run(it)],
      }));
    }
  }
  return out;
}

function bullets(items, o = {}) {
  return items.map((t) => new Paragraph({
    numbering: { reference: "bul", level: 0 },
    spacing: { after: o.after ?? 45, line: 266 },
    children: Array.isArray(t) ? t : [run(t)],
  }));
}

function cell(children, width, o = {}) {
  return new TableCell({
    borders: CELL_BORDERS,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 40, bottom: 40, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    children: (Array.isArray(children) ? children : [children]).map((c) =>
      typeof c === "string" ? para([run(c, { bold: o.bold, size: o.size })], { alignment: o.align }) : c),
  });
}

function table(widths, header, rows, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const trs = [];
  if (header) {
    trs.push(new TableRow({
      tableHeader: true,
      children: header.map((h, i) => cell(h, widths[i], { bold: true, fill: SHADE, size: o.size, align: o.headAlign?.[i] })),
    }));
  }
  rows.forEach((r) => trs.push(new TableRow({
    cantSplit: true,
    children: r.map((c, i) => cell(c, widths[i], { bold: o.boldFirst && i === 0, size: o.size, align: o.align?.[i] })),
  })));
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths, rows: trs });
}

function rule(after = 120) {
  return new Paragraph({
    spacing: { after },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000", space: 1 } },
    children: [],
  });
}

// ---------- cover ----------
function cover() {
  const c = (text, size, o = {}) => para([run(text, { size, ...o })], { alignment: AlignmentType.CENTER, spacing: { after: o.after ?? 80 } });
  const info = [
    ["Development Period", "14 October 2026 to 30 October 2026"],
    ["Final Presentation and Judging", "30 October 2026"],
    ["Team Size", "5 students per team"],
    ["Tracks", "5 tracks, 19 problems"],
  ];
  return [
    para([], { spacing: { before: 600 } }),
    c("Pundra University of Science & Technology", 30, { bold: true }),
    c("Department of Computer Science and Engineering", 25, { after: 500 }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new ImageRun({ type: "jpg", data: fs.readFileSync(LOGO), transformation: { width: 150, height: 150 } })],
    }),
    c("PUB CSE FEST-26", 32, { bold: true, after: 120 }),
    c("HACKATHON 2026", 56, { bold: true, after: 120 }),
    c("Problem Set", 34, { after: 700 }),
    new Table({
      width: { size: 7200, type: WidthType.DXA },
      columnWidths: [3000, 4200],
      alignment: AlignmentType.CENTER,
      rows: info.map(([k, v]) => new TableRow({
        children: [cell(k, 3000, { bold: true, fill: SHADE }), cell(v, 4200)],
      })),
    }),
    para([], { spacing: { after: 2600 } }),
    c("Organised by the Department of Computer Science and Engineering", 21, { italics: true, after: 40 }),
    c("Pundra University of Science & Technology, Bogura", 21, { italics: true }),
  ];
}

// ---------- problem list ----------
function problemList() {
  const rows = [];
  const all = [
    ...PROBLEMS.map((p) => [p.id, `${p.name}: ${p.subtitle}`, p.track]),
    ...FILMS.map((f) => [f.id, f.title, "E"]),
  ];
  let lastTrack = null;
  for (const [id, title, tr] of all) {
    if (tr !== lastTrack) {
      rows.push(new TableRow({
        cantSplit: true,
        children: [new TableCell({
          columnSpan: 2, borders: CELL_BORDERS, width: { size: CONTENT_W, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, color: "auto", fill: SHADE },
          margins: { top: 50, bottom: 50, left: 100, right: 100 },
          children: [para([run(TRACKS[tr], { bold: true })])],
        })],
      }));
      lastTrack = tr;
    }
    rows.push(new TableRow({
      cantSplit: true,
      children: [cell(id, 900, { bold: true, align: AlignmentType.CENTER }), cell(title, CONTENT_W - 900)],
    }));
  }
  return [
    para([run("Problem List", { bold: true, size: 32 })], { spacing: { after: 60 } }),
    rule(160),
    para("Each team selects one problem from the list below. Allocation is confirmed by the organising committee so that problems are spread across teams. Track E is a creative track in which teams produce an animated short film instead of software.",
      { alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 } }),
    new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [900, CONTENT_W - 900], rows }),
    para([], { spacing: { after: 200 } }),
    shaded("Creativity is part of the challenge. The requirements on each problem page define the minimum scope. Teams are free to add new features, modify the listed ones, or approach the problem in their own way, as long as the core requirements are met. Original, useful ideas are rewarded under the Innovation criterion."),
  ];
}

// ---------- one software problem page ----------
function problemPage(p) {
  return [
    pageBreak(),
    para([run(TRACKS[p.track], { size: 20, italics: true })], { spacing: { after: 40 } }),
    para([run(`${p.id}.  ${p.name}`, { bold: true, size: 32 })], { spacing: { after: 20 } }),
    para([run(p.subtitle, { size: 24 })], { spacing: { after: 40 } }),
    rule(60),
    heading("Problem Description", 80),
    shaded(p.description),
    heading("Required Features"),
    ...numbered(p.features),
    heading("Users and Roles"),
    table([2900, CONTENT_W - 2900], null, p.roles, { boldFirst: true, size: 21 }),
    heading("Restrictions"),
    ...bullets(p.restrictions),
    heading("Optional Features"),
    para(p.optional, { alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 80 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 4 } },
      children: [run(CREATIVITY, { italics: true, size: 20 })],
    }),
  ];
}

// ---------- animation track ----------
function filmGuidelines() {
  return [
    pageBreak(),
    para([run(TRACKS.E, { size: 20, italics: true })], { spacing: { after: 40 } }),
    para([run("Animated Short Film: General Guidelines", { bold: true, size: 32 })], { spacing: { after: 40 } }),
    rule(60),
    heading("Overview", 80),
    shaded("Each team creates a 7 to 10 minute animated short film set in the university or the CSE department, based on one of the three themes E1, E2 or E3. The team writes the story and dialogue itself. The finished film must show real animation work, storytelling, editing, sound design and creative direction. A sequence of still images or a single generated video does not meet the requirements."),
    heading("Production Requirements"),
    ...numbered([
      "Length between 7 and 10 minutes including titles and credits.",
      "Original story, script and dialogue written by the team, in Bangla or English. Subtitles are required if the dialogue is in Bangla.",
      "Character sheets and environment designs, with characters that keep a consistent appearance throughout.",
      "A storyboard covering every major shot, and an animatic (a rough timed version of the storyboard) made before final animation.",
      "Actual animation of characters, camera and environment: movement, expressions and transitions, not only panning over still images.",
      "Voice recorded by team members wherever possible, plus ambience, sound effects and music that do not overpower the dialogue.",
      "Edited and composited final film with titles and credits naming every team member and any external assets used.",
      "Final export as MP4 (H.264), 1920 × 1080, at least 24 frames per second.",
    ]),
    heading("Recommended Production Pipeline"),
    table([2300, CONTENT_W - 2300], ["Stage", "What the team does"], [
      ["1. Story and script", "Write the story, dialogue, narration and scene descriptions."],
      ["2. Design", "Create characters, props, locations and a colour and style reference."],
      ["3. Storyboard", "Draw the major shots. Stick figures are acceptable; composition and camera direction matter."],
      ["4. Animatic", "Turn the storyboard into a rough timed video with temporary dialogue and music."],
      ["5. Asset creation", "Build reusable characters, backgrounds, props, screens and effects."],
      ["6. Animation", "Animate characters, camera movement, expressions and environment."],
      ["7. Voice and sound", "Record dialogue; add ambience, Foley, effects and music."],
      ["8. Editing and compositing", "Combine animation, sound, titles and effects; check timing and continuity."],
      ["9. Final review", "Check story clarity, audio levels, spelling, credits and export quality."],
    ], { boldFirst: true, size: 21 }),
    pageBreak(),
    heading("Suggested Tools", 0),
    table([2300, 2700, 2300, CONTENT_W - 7300], ["Task", "Free option", "Alternative", "Skill learned"], [
      ["2D animation", "Krita, OpenToonz", "Adobe Animate", "Keyframes, timing, rigging"],
      ["3D animation", "Blender", "Maya", "Modelling, lighting, camera"],
      ["Storyboard", "Krita, Storyboarder", "Photoshop", "Shot planning"],
      ["Video editing", "DaVinci Resolve", "Premiere Pro", "Pacing, titles, audio"],
      ["Compositing", "Blender, DaVinci Resolve", "After Effects", "Layers, effects, colour"],
      ["Audio", "Audacity", "Adobe Audition", "Recording, cleanup, mixing"],
      ["Vector assets", "Inkscape", "Illustrator", "Reusable 2D assets"],
    ], { boldFirst: true, size: 21 }),
    heading("Recommended Story Structure (7 to 10 minutes)"),
    table([2000, CONTENT_W - 2000], ["Time", "Story function"], [
      ["0:00 to 1:00", "Hook and introduction: establish the character, problem or mystery."],
      ["1:00 to 3:00", "Setup: introduce the university or CSE environment and the main characters."],
      ["3:00 to 6:00", "Development: conflict, challenge, discovery or project."],
      ["6:00 to 8:30", "Climax: the main problem is solved or the central realisation happens."],
      ["8:30 to 10:00", "Resolution: emotional conclusion, message and credits."],
    ], { boldFirst: true, size: 21 }),
    heading("Suggested Team Roles (5 members)"),
    table([3000, CONTENT_W - 3000], ["Role", "Responsibility"], [
      ["Director / Scriptwriter", "Story, script, scene planning and creative consistency."],
      ["Character and Environment Artist", "Characters, backgrounds, props and visual assets."],
      ["Animator", "Character animation, camera movement, transitions and effects."],
      ["Voice, Sound and Music Lead", "Dialogue recording, Foley, ambience, music and audio cleanup."],
      ["Editor / Compositor", "Animatic, final editing, compositing, titles and export."],
    ], { boldFirst: true, size: 21 }),
    para([run("Members may help one another; the role split is a starting point, not a restriction.", { italics: true, size: 20 })], { spacing: { before: 60 } }),
    heading("Quality Checklist"),
    ...bullets([
      "A clear beginning, middle and end.",
      "Characters look and behave consistently.",
      "Shots have intentional framing and camera movement.",
      "Animation timing is believable.",
      "Dialogue is reasonably synchronised with mouth and body movement.",
      "Backgrounds and props establish the university or CSE setting.",
      "Sound effects and ambience support the visuals, and music does not overpower dialogue.",
      "Transitions are purposeful.",
      "Credits name every team member and any external assets.",
    ]),
    heading("Use of AI Tools"),
    para("AI tools may help with brainstorming, rough visual references, temporary narration for the animatic, noise removal, subtitles, and repetitive production tasks. The script, storyboard, shot composition, character acting, animation decisions, editing and final creative direction must remain the team's own work. Judges will review the storyboard, animatic and project files along with the final film.",
      { alignment: AlignmentType.JUSTIFIED }),
  ];
}

function filmPage(f) {
  return [
    pageBreak(),
    para([run(TRACKS.E, { size: 20, italics: true })], { spacing: { after: 40 } }),
    para([run(`${f.id}.  ${f.title}`, { bold: true, size: 32 })], { spacing: { after: 40 } }),
    rule(60),
    heading("Concept", 80),
    shaded(f.concept),
    heading("Required Story Elements"),
    ...numbered(f.elements),
    heading("Theme-Specific Requirements"),
    ...bullets(f.specific),
    heading("General Requirements"),
    para("All production requirements in the Track E General Guidelines apply: 7 to 10 minutes, original script, storyboard and animatic, real animation, team-recorded voice where possible, credits, and 1080p MP4 export.",
      { alignment: AlignmentType.JUSTIFIED }),
    heading("Intended Use"),
    para(`The best film may be used by the department for: ${f.use.charAt(0).toLowerCase()}${f.use.slice(1)}`, { alignment: AlignmentType.JUSTIFIED }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 160 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 4 } },
      children: [run("Be creative: the story elements above are a guide. Teams may reorder them, add characters and subplots, choose any visual style (2D, 3D, cut-out, stop-motion or mixed), and give the story their own voice, as long as the theme stays recognisable.", { italics: true, size: 20 })],
    }),
  ];
}

// ---------- rules, submission and judging ----------
function rulesPages() {
  return [
    pageBreak(),
    para([run("Rules, Submission and Judging", { bold: true, size: 32 })], { spacing: { after: 40 } }),
    rule(60),
    heading("Timeline", 80),
    table([4200, CONTENT_W - 4200], null, [
      ["Problem set release and team registration", "14 October 2026"],
      ["Development period", "14 October 2026 to 30 October 2026"],
      ["Final submission", "30 October 2026, before the presentation session (time will be announced)"],
      ["Final presentation, demonstration and judging", "30 October 2026"],
    ], { boldFirst: true, size: 21 }),
    heading("General Rules"),
    ...numbered([
      "Each team must have exactly 5 students. A student may be a member of only one team.",
      "Each team works on one problem from this problem set, subject to allocation by the organising committee.",
      "Teams may use any programming language, framework, database, cloud service or blockchain platform, and any web, mobile or desktop platform.",
      "Open-source libraries and frameworks are allowed. Simply combining existing tools without meaningful implementation of your own will receive limited marks.",
      "Teams may use any tools, including AI assistants, but every member must be able to explain the design, code and decisions of the project during judging.",
      "Copying an existing project and presenting it as the team's own work leads to disqualification.",
      "External people must not develop any part of the solution for a team.",
      "No real money may be collected and no real personal, medical or financial data may be used. Use simulated or synthetic data.",
      "The decision of the judges is final.",
    ]),
    heading("Cybersecurity Safety Notice"),
    shaded("All security testing and attack simulation must be performed only on systems, applications, datasets and networks owned by the team or explicitly authorised by the organisers. Participants must not scan, exploit, attack, disrupt or attempt unauthorised access to any external system, website, server, network or account. Any violation leads to immediate disqualification."),
    heading("Submission Requirements: Tracks A to D"),
    ...bullets([
      "Source code in a Git repository (preferred) or a ZIP archive.",
      "README with problem ID, team name, members, solution description, technology stack, installation and usage instructions, and known limitations.",
      "Architecture or design diagram, and database schema or smart-contract design where applicable.",
      "A working prototype demonstrated live during judging. A screen-recorded demo video (3 to 5 minutes) is recommended as a backup.",
      "Presentation slides covering the problem, solution, architecture, implementation, demonstration, innovation and future work.",
    ]),
    heading("Submission Requirements: Track E"),
    ...bullets([
      "Final film as MP4 (H.264), 1920 × 1080, 7 to 10 minutes.",
      "Script, character sheets, storyboard and animatic.",
      "Editable project files (for example Blender, Krita, OpenToonz or DaVinci Resolve projects).",
      "A one-page production note listing team roles, tools used and any external assets.",
    ]),
    pageBreak(),
    heading("Presentation and Demonstration", 0),
    ...bullets([
      "Each team has about 10 minutes: 7 minutes for presentation and live demonstration and 3 minutes for questions.",
      "Teams should give priority to a live demonstration of the working prototype.",
      "A slides-only presentation without a working implementation is not eligible for prizes.",
      "Track E teams screen their film and explain their production process.",
    ]),
    heading("Judging Criteria: Tracks A to D", 240),
    table([3600, 1400, CONTENT_W - 5000], ["Criterion", "Marks", "What judges look for"], [
      ["Problem Understanding", "10", "Clear grasp of the problem, users and requirements."],
      ["Functionality", "25", "Required features work correctly in the live demonstration."],
      ["Technical Implementation", "20", "Sound architecture, code quality and appropriate use of technology."],
      ["Security and Reliability", "15", "Authentication, access control, data protection and error handling."],
      ["Innovation", "10", "Original ideas, useful additions and creative modifications beyond the minimum scope."],
      ["UI/UX", "10", "Ease of use, clarity and accessibility of the interface."],
      ["Presentation and Demo", "10", "Clear explanation, confident demonstration and answers to questions."],
      [para([run("Total", { bold: true })]), para([run("100", { bold: true })], { alignment: AlignmentType.CENTER }), ""],
    ], { boldFirst: true, size: 21, align: [undefined, AlignmentType.CENTER], headAlign: [undefined, AlignmentType.CENTER] }),
    heading("Judging Criteria: Track E (Animated Short Film)", 240),
    table([3600, 1400, CONTENT_W - 5000], ["Criterion", "Marks", "What judges look for"], [
      ["Story and Script", "25", "Originality, structure, emotional impact and clarity."],
      ["Animation and Visual Quality", "25", "Movement, composition, consistency and visual design."],
      ["Sound and Editing", "15", "Dialogue, Foley, music, pacing and mixing."],
      ["Technical Execution", "15", "Production pipeline, storyboard and animatic, project files, export quality."],
      ["Creativity and CSE Integration", "10", "Effective and original use of the university and CSE setting."],
      ["Presentation", "10", "Explanation of the process and the final screening."],
      [para([run("Total", { bold: true })]), para([run("100", { bold: true })], { alignment: AlignmentType.CENTER }), ""],
    ], { boldFirst: true, size: 21, align: [undefined, AlignmentType.CENTER], headAlign: [undefined, AlignmentType.CENTER] }),
    heading("Final Note to Participants", 240),
    para("The aim of this hackathon is not only to build a working application or film, but to show problem-solving ability, technical understanding, teamwork, creativity and responsible engineering. Keep your scope realistic, finish the core requirements first, and then use the remaining time to add the ideas that make your work stand out. A polished, working prototype is worth more than an unfinished system with many features.",
      { alignment: AlignmentType.JUSTIFIED }),
  ];
}

// ---------- document ----------
const header = new Header({
  children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 2 } },
    children: [run("PUB CSE Fest-26 Hackathon", { size: 18 }), run("\tProblem Set", { size: 18 })],
  })],
});
const footer = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [run("Page ", { size: 18 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 })],
  })],
});

const pageProps = {
  page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, header: 560, footer: 560 } },
};

const body = [
  ...problemList(),
  ...PROBLEMS.flatMap(problemPage),
  ...filmGuidelines(),
  ...FILMS.flatMap(filmPage),
  ...rulesPages(),
];

const doc = new Document({
  creator: "Department of CSE, Pundra University of Science & Technology",
  title: "PUB CSE Fest-26 Hackathon Problem Set",
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  numbering: {
    config: [
      { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 400, hanging: 400 } } } }] },
      { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 400, hanging: 280 } } } }] },
    ],
  },
  sections: [
    { properties: pageProps, children: cover() },
    { properties: { ...pageProps, page: { ...pageProps.page, pageNumbers: { start: 1 } } }, headers: { default: header }, footers: { default: footer }, children: body },
  ],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(OUT, buf); console.log("wrote", OUT); });
