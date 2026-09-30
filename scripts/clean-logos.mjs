// scripts/clean-logos.mjs
// Produces transparent-background copies of public/Logos/*.png into
// public/Logos/clean/ WITHOUT touching the originals.
//
// Method: border-connected flood fill (a standard, conservative
// background-removal technique — NOT an ML/"magic" cutout):
//   1. Sample the image's outer border pixels.
//   2. If the border is already meaningfully transparent, the source is
//      already a clean cutout — copy through untouched (no destructive
//      re-encoding).
//   3. Otherwise, identify the dominant border color(s) (allows for a
//      plain solid background OR a two-tone checkerboard baked into the
//      pixels — both are common with these screenshot-derived assets).
//   4. Flood-fill from the border inward, clearing to transparent only
//      pixels that are BOTH connected to the border AND match a
//      background color within tolerance. Any white/light pixel that is
//      NOT reachable from the border (i.e. enclosed by the logo artwork
//      itself — white lettering, a white symbol, etc.) is structurally
//      unreachable by this algorithm and is left fully intact.
//   5. If the border colors can't be confidently identified as a
//      background (e.g. a saturated brand color fills the frame, or the
//      result would wipe out almost the whole image), the file is
//      skipped — no clean/ copy is written, and the DriftWall falls back
//      to the untouched original for that logo.

import { readdirSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, "..", "public", "Logos");
const outDir = path.join(logosDir, "clean");

const ALREADY_TRANSPARENT_BORDER_ALPHA = 250;
const ALREADY_TRANSPARENT_FRACTION = 0.3;
// A pixel counts as "background-like" if it's both desaturated (neutral
// gray/white — not a saturated brand color) and light. This one predicate
// covers plain white backgrounds, light-gray checkerboard squares, and the
// soft anti-aliased blend between them, without needing to cluster exact
// colors — and it naturally leaves genuinely colored brand backgrounds
// (blue, red, cream, etc.) alone since those fail the desaturation test.
const GRAYSCALE_SPREAD = 26; // max(r,g,b) - min(r,g,b)
const LIGHT_THRESHOLD = 198; // min average brightness to count as "light"
const MIN_BORDER_COVERAGE = 0.55; // fraction of the border that must be background-like to proceed
const MAX_REMOVED_FRACTION = 0.92; // abort if flood fill would wipe almost everything

function isBackgroundish(r, g, b) {
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const brightness = (r + g + b) / 3;
  return spread <= GRAYSCALE_SPREAD && brightness >= LIGHT_THRESHOLD;
}

async function processFile(filename) {
  const inPath = path.join(logosDir, filename);
  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info; // channels === 4
  const idx = (x, y) => (y * width + x) * channels;

  // --- 1. Collect border pixels ---
  const borderPixels = [];
  for (let x = 0; x < width; x++) {
    borderPixels.push(idx(x, 0), idx(x, height - 1));
  }
  for (let y = 0; y < height; y++) {
    borderPixels.push(idx(0, y), idx(width - 1, y));
  }

  // --- 2. Already transparent? ---
  let transparentBorderCount = 0;
  for (const i of borderPixels) {
    if (data[i + 3] < ALREADY_TRANSPARENT_BORDER_ALPHA) transparentBorderCount++;
  }
  if (transparentBorderCount / borderPixels.length >= ALREADY_TRANSPARENT_FRACTION) {
    return { filename, decision: "already-transparent", removedFraction: 0 };
  }

  // --- 3. Does the border look like a removable background at all? ---
  let borderBgCount = 0;
  for (const i of borderPixels) {
    if (isBackgroundish(data[i], data[i + 1], data[i + 2])) borderBgCount++;
  }
  if (borderBgCount / borderPixels.length < MIN_BORDER_COVERAGE) {
    return { filename, decision: "skipped-unidentifiable-background", removedFraction: 0 };
  }

  // --- 4. Border-connected flood fill (iterative, 4-connected) ---
  const visited = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x++) {
    if (isBackgroundish(data[idx(x, 0)], data[idx(x, 0) + 1], data[idx(x, 0) + 2])) stack.push([x, 0]);
    if (
      isBackgroundish(data[idx(x, height - 1)], data[idx(x, height - 1) + 1], data[idx(x, height - 1) + 2])
    )
      stack.push([x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    if (isBackgroundish(data[idx(0, y)], data[idx(0, y) + 1], data[idx(0, y) + 2])) stack.push([0, y]);
    if (
      isBackgroundish(data[idx(width - 1, y)], data[idx(width - 1, y) + 1], data[idx(width - 1, y) + 2])
    )
      stack.push([width - 1, y]);
  }

  let removedCount = 0;
  while (stack.length) {
    const [x, y] = stack.pop();
    const p = y * width + x;
    if (visited[p]) continue;
    const i = idx(x, y);
    if (!isBackgroundish(data[i], data[i + 1], data[i + 2])) continue;
    visited[p] = 1;
    data[i + 3] = 0;
    removedCount++;
    if (x > 0) stack.push([x - 1, y]);
    if (x < width - 1) stack.push([x + 1, y]);
    if (y > 0) stack.push([x, y - 1]);
    if (y < height - 1) stack.push([x, y + 1]);
  }

  const removedFraction = removedCount / (width * height);
  if (removedFraction > MAX_REMOVED_FRACTION) {
    return { filename, decision: "skipped-would-destroy-logo", removedFraction };
  }
  if (removedCount === 0) {
    return { filename, decision: "skipped-no-removable-background", removedFraction: 0 };
  }

  mkdirSync(outDir, { recursive: true });
  await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(outDir, filename));

  return { filename, decision: "cleaned", removedFraction };
}

async function main() {
  const files = readdirSync(logosDir).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));
  const results = [];
  for (const filename of files) {
    try {
      results.push(await processFile(filename));
    } catch (err) {
      results.push({ filename, decision: "error", error: String(err) });
    }
  }

  console.log("\nfilename".padEnd(42), "decision".padEnd(30), "removed%");
  for (const r of results) {
    console.log(
      r.filename.padEnd(42),
      r.decision.padEnd(30),
      r.removedFraction != null ? `${Math.round(r.removedFraction * 100)}%` : ""
    );
  }
  const cleaned = results.filter((r) => r.decision === "cleaned").length;
  console.log(`\n${cleaned}/${results.length} files cleaned into public/Logos/clean/`);
  console.log(`${results.length - cleaned} kept as original (already transparent or unsafe to process).`);
}

main();
