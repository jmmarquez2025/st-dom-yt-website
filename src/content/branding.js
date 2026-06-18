/**
 * Global branding overrides (colors)
 * ──────────────────────────────────
 * Exposes a SAFE set of brand colors for editing. Recoloring the site needs two
 * things applied together, because the codebase reads colors two ways:
 *   1. the `T` object (inline React styles, ~900 call sites) — we mutate it
 *   2. the `--color-*` CSS variables (stylesheet rules) — we inject a <style>
 * Both are applied before first paint (src/main.jsx) and reconciled on edit, so
 * a reset restores the shipped palette everywhere.
 *
 * Deliberately NOT exposed: radii, spacing, fonts, and easing — changing those
 * site-wide is how a non-technical edit breaks the layout / the editorial feel.
 */

import { T } from "../constants/theme";

const STORAGE_KEY = "stdom_branding";

// key = T property, cssVar = matching global.css custom property.
export const BRAND_TOKENS = [
  { key: "burgundy", cssVar: "--color-burgundy", label: "Brand color (primary)" },
  { key: "burgundyDark", cssVar: "--color-burgundy-dark", label: "Brand color (dark)", advanced: true },
  { key: "gold", cssVar: "--color-gold", label: "Accent (gold)" },
  { key: "goldLight", cssVar: "--color-gold-light", label: "Accent (light gold)", advanced: true },
  { key: "cream", cssVar: "--color-cream", label: "Section background", advanced: true },
  { key: "warmWhite", cssVar: "--color-warm-white", label: "Page background", advanced: true },
];

// Pristine palette, captured before any override is applied.
const ORIGINAL = {};
for (const tk of BRAND_TOKENS) ORIGINAL[tk.key] = T[tk.key];

export function originalColor(key) {
  return ORIGINAL[key];
}

export const DEFAULT_NAMES = { nav: "St. Dominic", full: "St. Dominic Catholic Church" };

function readShard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { colors: {}, names: {} };
    const p = JSON.parse(raw);
    return {
      colors: p.colors && typeof p.colors === "object" ? p.colors : {},
      names: p.names && typeof p.names === "object" ? p.names : {},
    };
  } catch {
    return { colors: {}, names: {} };
  }
}

function writeShard(shard) {
  const hasColors = Object.keys(shard.colors || {}).length > 0;
  const hasNames = Object.keys(shard.names || {}).length > 0;
  try {
    if (hasColors || hasNames) localStorage.setItem(STORAGE_KEY, JSON.stringify(shard));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* quota / disabled */
  }
}

export function getBranding() {
  return { colors: readShard().colors };
}

/** Editable site names (override or shipped default). */
export function getSiteNames() {
  const { names } = readShard();
  return { nav: names.nav || DEFAULT_NAMES.nav, full: names.full || DEFAULT_NAMES.full };
}
export function getNavName() {
  return getSiteNames().nav;
}
export function getSiteNameFull() {
  return getSiteNames().full;
}

export function setBranding(colors) {
  const clean = {};
  for (const tk of BRAND_TOKENS) {
    const v = colors[tk.key];
    if (v && v.toLowerCase() !== String(ORIGINAL[tk.key]).toLowerCase()) clean[tk.key] = v;
  }
  const shard = readShard();
  shard.colors = clean;
  writeShard(shard);
  applyBranding();
}

export function setSiteNames(names) {
  const clean = {};
  if (names.nav && names.nav !== DEFAULT_NAMES.nav) clean.nav = names.nav;
  if (names.full && names.full !== DEFAULT_NAMES.full) clean.full = names.full;
  const shard = readShard();
  shard.names = clean;
  writeShard(shard);
}

export function resetBranding() {
  // Reset colors only; keep any custom site names.
  const shard = readShard();
  shard.colors = {};
  writeShard(shard);
  applyBranding();
}

/** Reconcile both the T object and the :root CSS variables. */
export function applyBranding() {
  const { colors } = getBranding();
  let css = "";
  for (const tk of BRAND_TOKENS) {
    const val = colors[tk.key] || ORIGINAL[tk.key];
    T[tk.key] = val; // inline-style consumers
    css += `${tk.cssVar}:${val};`; // stylesheet consumers
  }
  if (typeof document !== "undefined") {
    let style = document.getElementById("brand-overrides");
    if (!style) {
      style = document.createElement("style");
      style.id = "brand-overrides";
      document.head.appendChild(style);
    }
    style.textContent = `:root{${css}}`;
  }
}

// ── WCAG contrast (for the editor's readability meter) ──
function channel(x) {
  const v = x / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function luminance(hex) {
  const c = hex.replace("#", "");
  if (c.length < 6) return 0;
  const r = channel(parseInt(c.slice(0, 2), 16));
  const g = channel(parseInt(c.slice(2, 4), 16));
  const b = channel(parseInt(c.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrastRatio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}
