/**
 * Site Settings Store
 *
 * Holds admin-editable contact info and social media accounts.
 * Overrides CONFIG values on the public site when present.
 *
 * Shape:
 * {
 *   contact: { phone, phoneLink, fax, email, address, city, state, zip, officeHours },
 *   social: [ { id, platform, handle, url, description, active, order } ]
 * }
 */

const STORAGE_KEY = "stdom_settings";

function generateId() {
  return "s-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export const PLATFORMS = [
  { value: "Facebook", icon: "Facebook" },
  { value: "Instagram", icon: "Instagram" },
  { value: "YouTube", icon: "Youtube" },
  { value: "Twitter", icon: "Twitter" },
  { value: "TikTok", icon: "Music" },
  { value: "LinkedIn", icon: "Linkedin" },
  { value: "Other", icon: "Globe" },
];

export function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getContact(fallback) {
  const stored = getAll();
  return stored?.contact ? { ...fallback, ...stored.contact } : fallback;
}

// Official parish accounts, shown until an admin configures accounts in the
// Settings dashboard. Any stored list (even an emptied one) replaces these.
const DEFAULT_SOCIAL = [
  {
    id: "default-facebook",
    platform: "Facebook",
    handle: "@saintdominicYT",
    url: "https://www.facebook.com/saintdominicYT/",
    description: "Weekly videos, announcements, and parish news.",
    active: true,
    order: 1,
  },
  {
    id: "default-instagram",
    platform: "Instagram",
    handle: "@saintdominicyt",
    url: "https://www.instagram.com/saintdominicyt/",
    description: "Photos and moments from life at St. Dom's.",
    active: true,
    order: 2,
  },
];

export function getSocial() {
  const stored = getAll();
  const list = Array.isArray(stored?.social) ? stored.social : DEFAULT_SOCIAL;
  return [...list].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getActiveSocial() {
  return getSocial().filter((s) => s.active !== false);
}

export function newSocial() {
  return {
    id: generateId(),
    platform: "Instagram",
    handle: "",
    url: "",
    description: "",
    active: true,
    order: 999,
  };
}
