import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, parse, sep } from "node:path";
import sharp from "sharp";

const PHOTO_DIR = "public/photos";
const STOCK_SEGMENT = `${sep}stock${sep}`;
const DEFAULT_WIDTHS = [480, 1024, 1920];

function parseWidths(argv) {
  const flagIdx = argv.indexOf("--widths");
  if (flagIdx === -1 || !argv[flagIdx + 1]) return DEFAULT_WIDTHS;
  const parsed = argv[flagIdx + 1]
    .split(",")
    .map((v) => Number.parseInt(v.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return parsed.length ? parsed : DEFAULT_WIDTHS;
}

const widths = parseWidths(process.argv.slice(2));

// Match files this script previously emitted (e.g. "foo-480.jpg", "foo-1024.webp").
// Those are *outputs*, never inputs — feeding them back in causes cascade artifacts
// like "foo-1024-480.jpg".
const VARIANT_SUFFIX_RE = /-(?:\d{2,4})\.(?:jpe?g|webp)$/i;
// Pre-optimization backups created by scripts/optimize-sources.mjs.
// They're frozen artifacts of the un-optimized originals — never re-encode them.
const BACKUP_SUFFIX_RE = /\.original-large\.(?:jpe?g|webp)$/i;

function isInput(name) {
  if (!/\.(jpe?g)$/i.test(name)) return false;
  if (VARIANT_SUFFIX_RE.test(name)) return false;
  if (BACKUP_SUFFIX_RE.test(name)) return false;
  return true;
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile() && isInput(entry.name)) {
      yield fullPath;
    }
  }
}

async function needsUpdate(source, target) {
  if (!existsSync(target)) return true;
  const [sourceStat, targetStat] = await Promise.all([stat(source), stat(target)]);
  return sourceStat.mtimeMs > targetStat.mtimeMs;
}

let count = 0;
let variantCount = 0;
console.log("Generating WebP images...");

const failures = [];

for await (const jpg of walk(PHOTO_DIR)) {
  try {
    const { dir, name } = parse(jpg);
    const webp = join(dir, `${name}.webp`);
    if (await needsUpdate(jpg, webp)) {
      await sharp(jpg).webp({ quality: 80 }).toFile(webp);
      count += 1;
      console.log(`  Created: ${webp}`);
    }

    if (jpg.includes(STOCK_SEGMENT)) continue;

    const metadata = await sharp(jpg).metadata();
    const sourceWidth = metadata.width ?? Infinity;

    for (const w of widths) {
      // Cap target width at the source's actual width — never upscale.
      // We still emit the file (using the advertised name -{w}) so every srcset
      // entry resolves to a real asset; the browser will scale on display.
      const targetWidth = Math.min(w, sourceWidth);
      const webpVariant = join(dir, `${name}-${w}.webp`);
      const jpgVariant = join(dir, `${name}-${w}.jpg`);

      if (await needsUpdate(jpg, webpVariant)) {
        await sharp(jpg).resize({ width: targetWidth }).webp({ quality: 80 }).toFile(webpVariant);
        variantCount += 1;
        console.log(`  Created: ${webpVariant} (${targetWidth}w)`);
      }
      if (await needsUpdate(jpg, jpgVariant)) {
        await sharp(jpg).resize({ width: targetWidth }).jpeg({ quality: 82, mozjpeg: true }).toFile(jpgVariant);
        variantCount += 1;
        console.log(`  Created: ${jpgVariant} (${targetWidth}w)`);
      }
    }
  } catch (err) {
    failures.push({ file: jpg, error: err.message });
    console.warn(`  SKIP (${err.message}): ${jpg}`);
  }
}

console.log(
  `Done! ${count} base WebP${count === 1 ? "" : "s"} + ${variantCount} variant${variantCount === 1 ? "" : "s"} generated.`,
);
if (failures.length) {
  console.log(`\n${failures.length} file(s) skipped due to errors:`);
  for (const f of failures) console.log(`  - ${f.file}: ${f.error}`);
}
