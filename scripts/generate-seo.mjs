import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] || "dist";
const siteUrl = (process.env.VITE_SITE_URL || "https://jmmarquez2025.github.io/st-dom-yt-website").replace(/\/$/, "");

const pages = [
  ["/", "1.0", "weekly"],
  ["/visit", "0.9", "monthly"],
  ["/mass-times", "0.9", "weekly"],
  ["/sacraments", "0.8", "monthly"],
  ["/about", "0.7", "monthly"],
  ["/staff", "0.7", "monthly"],
  ["/becoming-catholic", "0.8", "monthly"],
  ["/get-involved", "0.7", "monthly"],
  ["/contact", "0.8", "yearly"],
  ["/give", "0.8", "yearly"],
  ["/bulletin", "0.6", "weekly"],
  ["/sacraments/baptism", "0.7", "monthly"],
  ["/sacraments/first-communion", "0.7", "monthly"],
  ["/sacraments/confirmation", "0.7", "monthly"],
  ["/sacraments/marriage", "0.7", "monthly"],
  ["/sacraments/anointing", "0.6", "monthly"],
  ["/sacraments/funerals", "0.6", "monthly"],
  ["/blog", "0.7", "weekly"],
  ["/faith-formation", "0.7", "monthly"],
  ["/connect", "0.6", "monthly"],
  ["/events", "0.6", "weekly"],
  ["/gallery", "0.5", "monthly"],
  ["/register", "0.6", "yearly"],
  ["/history", "0.5", "yearly"],
  ["/architecture", "0.5", "yearly"],
  ["/blog/easter-vigil-2026-new-catholics", "0.6", "yearly"],
  ["/blog/light-darkness-cannot-overcome", "0.6", "yearly"],
  ["/blog/contemplata-aliis-tradere", "0.6", "yearly"],
  ["/blog/veritas-seeking-truth", "0.6", "yearly"],
  ["/blog/food-pantry-turns-30", "0.6", "yearly"],
];

function loc(path) {
  return path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(([path, priority, changefreq]) => `  <url><loc>${loc(path)}</loc><priority>${priority}</priority><changefreq>${changefreq}</changefreq></url>`)
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "sitemap.xml"), sitemap);
writeFileSync(join(outDir, "robots.txt"), robots);

const indexPath = join(outDir, "index.html");
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, "utf8")
    .replaceAll("https://jmmarquez2025.github.io/st-dom-yt-website", siteUrl)
    .replaceAll("https://saintdominic.org", siteUrl);
  writeFileSync(indexPath, html);
}
