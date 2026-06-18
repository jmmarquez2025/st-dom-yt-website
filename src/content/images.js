/**
 * Image overrides
 * ───────────────
 * Lets the dashboard swap a page's hero / key images. Because every page reads
 * image paths from the shared PHOTOS object (src/constants/photos.js), we apply
 * an override by reconciling PHOTOS in place before first paint — no page needs
 * to change. Overrides are a small { slotKey: path } map in the stdom_images
 * shard, so they ride the existing sync pipeline.
 *
 * Editors pick from the existing site photo library (which keeps the responsive
 * -480/-1024/-1920 webp pipeline intact) or paste a URL (loads, but un-optimised).
 * Uploading brand-new files needs a commit to public/photos — out of scope for a
 * static host.
 */

import { PHOTOS } from "../constants/photos";

const STORAGE_KEY = "stdom_images";

// Pristine snapshot, captured before any override is applied, so "reset to
// default" and the library both have the shipped paths.
const ORIGINAL = {};
for (const k of Object.keys(PHOTOS)) {
  if (typeof PHOTOS[k] === "string") ORIGINAL[k] = PHOTOS[k];
}

/** Per-page editable image slots: which PHOTOS keys each page exposes. */
export const IMAGE_SLOTS = {
  home: [
    { slot: "homeHero", label: "Hero background" },
    { slot: "dominicanCharism", label: "Dominican charism image" },
  ],
  about: [
    { slot: "aboutHero", label: "Hero background" },
    { slot: "aboutArchitecture", label: "Architecture image" },
  ],
  massTimes: [{ slot: "monstrance", label: "Adoration image" }],
  sacraments: [
    { slot: "stockSacraments", label: "Hero / overview image" },
    { slot: "stockEucharist", label: "Eucharist image" },
  ],
  faithFormation: [{ slot: "faithFormationHero", label: "Hero background" }],
  getInvolved: [{ slot: "getInvolvedHero", label: "Hero background" }],
  history: [{ slot: "historyHero", label: "Hero background" }],
  arch: [{ slot: "archHero", label: "Hero background" }],
  visit: [{ slot: "visitHero", label: "Hero background" }],
  bulletin: [{ slot: "bulletinHero", label: "Hero background" }],
};

/** "homeHero" → "Home Hero", "psjShield" → "Psj Shield". */
function humanize(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Every swappable site image, for the picker library (excludes the gallery array). */
export const LIBRARY = Object.keys(ORIGINAL).map((slot) => ({
  slot,
  label: humanize(slot),
  src: ORIGINAL[slot],
}));

export function getImageOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function write(map) {
  try {
    if (Object.keys(map).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* quota / disabled */
  }
}

/** The pristine, shipped path for a slot. */
export function originalImage(slot) {
  return ORIGINAL[slot] || "";
}

/** Current effective path for a slot (override or original). */
export function currentImage(slot) {
  const ov = getImageOverrides();
  return ov[slot] || ORIGINAL[slot] || "";
}

export function setImage(slot, path) {
  const ov = getImageOverrides();
  if (!path || path === ORIGINAL[slot]) delete ov[slot];
  else ov[slot] = path;
  write(ov);
  applyImageOverrides();
}

export function resetImage(slot) {
  const ov = getImageOverrides();
  delete ov[slot];
  write(ov);
  applyImageOverrides();
}

/**
 * Reconcile PHOTOS in place: every known slot becomes its override or its
 * shipped original. Safe to call repeatedly. Run once before first paint and
 * again after an edit.
 */
export function applyImageOverrides() {
  const ov = getImageOverrides();
  for (const slot of Object.keys(ORIGINAL)) {
    PHOTOS[slot] = ov[slot] || ORIGINAL[slot];
  }
}
