#!/usr/bin/env node
/**
 * One-time source-JPG re-encoder.
 *
 * Walks public/photos/ (excluding public/photos/stock/), finds .jpg files
 * exceeding the size threshold, and re-encodes them in place at
 * quality 82 / max width 2400 / mozjpeg. The original is preserved as
 * <name>.original-large.jpg so the operation is reversible.
 *
 * Run after `npm install`. Idempotent: skips files that already have a
 * `.original-large.jpg` sibling (already optimized).
 *
 * Usage:
 *   node scripts/optimize-sources.mjs              # default threshold 1 MB
 *   node scripts/optimize-sources.mjs --threshold 500   # KB
 *   node scripts/optimize-sources.mjs --dry-run
 */

import { readdir, stat, rename, access } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "public", "photos");
const SKIP_DIRS = new Set(["stock"]);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const thresholdIdx = args.indexOf("--threshold");
const thresholdKB = thresholdIdx >= 0 ? Number(args[thresholdIdx + 1]) : 1024;
const thresholdBytes = thresholdKB * 1024;
const MAX_WIDTH = 2400;
const QUALITY = 82;

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      files.push(...(await walk(full)));
    } else if (ent.isFile() && extname(ent.name).toLowerCase() === ".jpg") {
      if (basename(ent.name).endsWith(".original-large.jpg")) continue;
      files.push(full);
    }
  }
  return files;
}

async function processFile(file) {
  const s = await stat(file);
  if (s.size < thresholdBytes) return { file, skipped: "under threshold" };

  const backup = file.replace(/\.jpg$/i, ".original-large.jpg");
  if (await exists(backup)) {
    return { file, skipped: "already optimized (backup present)" };
  }

  if (dryRun) {
    return { file, sizeKB: Math.round(s.size / 1024), action: "would-optimize" };
  }

  const tmp = file + ".tmp";
  await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp);

  await rename(file, backup);
  await rename(tmp, file);

  const after = await stat(file);
  return {
    file,
    beforeKB: Math.round(s.size / 1024),
    afterKB: Math.round(after.size / 1024),
    savedKB: Math.round((s.size - after.size) / 1024),
  };
}

async function main() {
  console.log(
    `Source-JPG optimizer | threshold ${thresholdKB} KB | maxWidth ${MAX_WIDTH}px | quality ${QUALITY}${dryRun ? " | DRY RUN" : ""}`,
  );

  const files = await walk(ROOT);
  let totalBefore = 0, totalAfter = 0, optimized = 0, skipped = 0;

  for (const file of files) {
    const res = await processFile(file);
    if (res.skipped) {
      skipped++;
      continue;
    }
    if (res.action === "would-optimize") {
      console.log(`  [dry] ${res.file} (${res.sizeKB} KB)`);
      continue;
    }
    optimized++;
    totalBefore += res.beforeKB;
    totalAfter += res.afterKB;
    console.log(`  ${res.file}: ${res.beforeKB} → ${res.afterKB} KB (saved ${res.savedKB} KB)`);
  }

  console.log(
    `\nDone. Optimized ${optimized}, skipped ${skipped}, total saved ${totalBefore - totalAfter} KB.`,
  );
  if (optimized > 0 && !dryRun) {
    console.log(`Originals preserved as *.original-large.jpg. Delete after verification.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
