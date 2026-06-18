/**
 * Per-page SEO overrides
 * ──────────────────────
 * Editable, bilingual page titles / meta descriptions / share image, stored in
 * the stdom_seo shard as { [pageId]: { titleEn, titleEs, descEn, descEs, image } }.
 *
 * The runtime head manager (src/components/Seo.jsx) resolves the override for
 * the current route + language and falls back to the page's built-in props when
 * a field is blank — so SEO is opt-in and, where filled, finally bilingual.
 */

import { PAGES } from "./registry";

const STORAGE_KEY = "stdom_seo";

export function getAllSeo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getSeoForPage(pageId) {
  return getAllSeo()[pageId] || {};
}

export function setSeoForPage(pageId, data) {
  const all = getAllSeo();
  // Keep the shard sparse: drop empty fields, and drop the page entirely if blank.
  const clean = {};
  for (const k of ["titleEn", "titleEs", "descEn", "descEs", "image"]) {
    if (data[k]) clean[k] = data[k];
  }
  if (Object.keys(clean).length) all[pageId] = clean;
  else delete all[pageId];
  try {
    if (Object.keys(all).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* quota / disabled */
  }
}

// Build a route → pageId lookup once (routes are app-relative, matching
// react-router's useLocation().pathname under basename).
const ROUTE_TO_ID = {};
for (const p of PAGES) ROUTE_TO_ID[p.route] = p.id;

/** Resolve the SEO override for a pathname + language. Returns {} if none. */
export function resolveSeo(pathname, lang) {
  const id = ROUTE_TO_ID[pathname];
  if (!id) return {};
  const o = getAllSeo()[id];
  if (!o) return {};
  const es = lang === "es";
  return {
    title: (es ? o.titleEs : o.titleEn) || o.titleEn || "",
    description: (es ? o.descEs : o.descEn) || o.descEn || "",
    image: o.image || "",
  };
}
