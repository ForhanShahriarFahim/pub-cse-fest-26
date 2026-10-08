// Renders an SVG file to a PNG with headless Chromium.
// Usage: node tools/svg2png.js in.svg out.png [scale=2]
const fs = require("fs");
const path = require("path");
const PW = ["playwright", "/opt/node22/lib/node_modules/playwright"];
let chromium;
for (const p of PW) { try { ({ chromium } = require(p)); break; } catch (_) {} }
if (!chromium) { console.error("playwright not found"); process.exit(1); }

(async () => {
  const [inp, out, scale = "2"] = process.argv.slice(2);
  const svg = fs.readFileSync(inp, "utf8");
  const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const [w, h] = [Math.ceil(+m[1]), Math.ceil(+m[2])];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: +scale });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${svg}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator("svg").screenshot({ path: path.resolve(out) });
  await browser.close();
  console.log(`rendered ${out} (${w * scale}x${h * scale})`);
})();
