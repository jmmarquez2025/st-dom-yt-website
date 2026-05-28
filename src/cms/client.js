/**
 * Google Sheets CMS Client
 *
 * Fetches live data from a published Google Sheet.
 * Falls back to bundled static data when the sheet is unavailable.
 *
 * ── Setup ──
 * 1. Create a Google Sheet with these tabs (exact names):
 *    Staff | Schedule | Ministries | Announcements
 *
 * 2. Staff tab columns:    id | name | role | type (friar/staff) | order
 * 3. Schedule tab columns: category (sundayMass/dailyMass/confession/adoration) | dayKey | time
 * 4. Ministries tab columns: id | icon | key | order
 * 5. Announcements tab columns: title | body | date | active (TRUE/FALSE)
 *
 * 3. File → Share → Publish to web → Entire Document → CSV → Publish
 * 4. Copy the Sheet ID from the URL and paste it into src/constants/config.js
 *
 * ── How it works ──
 * Uses the Google Visualization API (no API key needed) to query published sheets.
 * Returns JSON parsed from the gviz endpoint.
 */

import { CONFIG } from "../constants/config";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

/**
 * Fetch a sheet tab as an array of row objects.
 * @param {string} sheetName - Tab name (e.g. "Staff")
 * @returns {Promise<Object[]|null>} Array of row objects, or null on failure
 */
export async function fetchSheet(sheetName) {
  if (!CONFIG.cmsSheetId) return null;

  const cacheKey = sheetName;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  try {
    const url =
      `https://docs.google.com/spreadsheets/d/${CONFIG.cmsSheetId}` +
      `/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const res = await fetch(url);
    const text = await res.text();

    // Response is JSONP-like: google.visualization.Query.setResponse({...})
    const jsonStr = text.match(/google\.visualization\.Query\.setResponse\((.+)\);?$/s)?.[1];
    if (!jsonStr) return null;

    const json = JSON.parse(jsonStr);
    const cols = json.table.cols.map((c) => c.label || c.id);
    const rows = json.table.rows.map((r) =>
      Object.fromEntries(cols.map((col, i) => [col, r.c?.[i]?.v ?? ""]))
    );

    cache.set(cacheKey, { data: rows, ts: Date.now() });
    return rows;
  } catch {
    return null;
  }
}

/** Fetch staff from CMS */
export async function fetchStaff() {
  const rows = await fetchSheet("Staff");
  if (!rows) return null;

  const friars = rows
    .filter((r) => r.type === "friar")
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((r) => ({ id: r.id, name: r.name, role: r.role }));

  const staff = rows
    .filter((r) => r.type === "staff")
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((r) => ({ id: r.id, name: r.name, role: r.role }));

  return { friars, staff };
}

/** Fetch schedule from CMS */
export async function fetchSchedule() {
  const rows = await fetchSheet("Schedule");
  if (!rows) return null;

  const grouped = {};
  for (const r of rows) {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push([r.dayKey, r.time]);
  }
  return grouped;
}

/** Fetch ministries from CMS */
export async function fetchMinistries() {
  const rows = await fetchSheet("Ministries");
  if (!rows) return null;
  return rows
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((r) => ({ id: r.id, icon: r.icon, key: r.key }));
}

/** Fetch active announcements from CMS */
export async function fetchAnnouncements() {
  const rows = await fetchSheet("Announcements");
  if (!rows) return null;
  return rows.filter((r) => r.active === true || r.active === "TRUE");
}

/** Fetch events from CMS — tab: Events, columns: id | date | title | description | category | time | location */
export async function fetchEvents() {
  const rows = await fetchSheet("Events");
  if (!rows) return null;
  return rows
    .filter((r) => r.date && r.title)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/** Fetch bulletin archive from CMS — tab: Bulletins, columns: date | label | url */
export async function fetchBulletins() {
  const rows = await fetchSheet("Bulletins");
  if (!rows) return null;
  return rows
    .filter((r) => r.date && r.label)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Fetch blog posts from the Blog CMS (Google Docs + Sheets).
 * Uses a separate Apps Script deployment (not the gviz API)
 * because blog content comes from Google Docs, not sheet cells.
 *
 * See cms/blog-cms.gs for the server-side code.
 */
const BLOG_CACHE_KEY = "__blog_cms";
const BLOG_LOCAL_KEY = "__blog_local"; // local-only posts when CMS not configured
const BLOG_DELETED_KEY = "stdom_blog_deleted"; // tombstones for deleted post IDs (covers static posts the CMS can't touch)
const STAFF_TOKEN_KEY = "stdom_staff_token";

/* ── Local-storage helpers (offline / no-CMS mode) ── */

function getLocalPosts() {
  try {
    return JSON.parse(localStorage.getItem(BLOG_LOCAL_KEY) || "[]");
  } catch { return []; }
}

function saveLocalPosts(posts) {
  try {
    localStorage.setItem(BLOG_LOCAL_KEY, JSON.stringify(posts));
  } catch { /* quota exceeded */ }
}

/* ── Tombstone helpers ──
 * Static posts (src/data/blog.js) are baked into the JS bundle and the CMS
 * Apps Script can't touch them. We track deleted-post IDs in localStorage
 * so the admin's delete sticks for any post — static or CMS — and so the
 * CMS request becoming a no-op (no-cors masks the response) doesn't matter.
 */

export function getDeletedBlogIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(BLOG_DELETED_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}

function saveDeletedBlogIds(ids) {
  try {
    localStorage.setItem(BLOG_DELETED_KEY, JSON.stringify(ids));
  } catch { /* quota exceeded */ }
}

function addDeletedBlogId(id) {
  if (!id) return;
  const ids = getDeletedBlogIds();
  if (!ids.includes(id)) {
    ids.push(id);
    saveDeletedBlogIds(ids);
  }
}

export function removeDeletedBlogId(id) {
  if (!id) return;
  const ids = getDeletedBlogIds();
  const next = ids.filter((x) => x !== id);
  if (next.length !== ids.length) {
    saveDeletedBlogIds(next);
    try { localStorage.removeItem(BLOG_CACHE_KEY); } catch { /* ignore */ }
    try { window.dispatchEvent(new Event("stdom:admin-synced")); } catch { /* SSR / no window */ }
  }
}

function getStaffToken() {
  try {
    return sessionStorage.getItem(STAFF_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

/**
 * Submit (create or update) a blog post.
 *
 * When CONFIG.blogCmsUrl is set → POSTs to the Apps Script backend.
 * When it's empty → saves to localStorage so the blog manager works
 * immediately for testing and offline authoring.
 *
 * @param {Object} postData — post metadata + optional body blocks
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function submitBlogPost(postData) {
  // Saving a post with this ID undoes any prior tombstone, so re-creating a
  // deleted post (or editing a static one back in) makes it visible again.
  if (postData?.id) removeDeletedBlogId(postData.id);

  // ── Remote CMS mode ──
  if (CONFIG.blogCmsUrl) {
    const token = getStaffToken();
    if (!token) return { success: false, error: "Staff session expired. Please unlock the dashboard again." };

    try {
      await fetch(CONFIG.blogCmsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ ...postData, token }),
      });
      // Invalidate cache so next fetch picks up the change
      try { localStorage.removeItem(BLOG_CACHE_KEY); } catch { /* ignore */ }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to submit post" };
    }
  }

  // ── Local mode (no CMS URL) ──
  try {
    const posts = getLocalPosts();
    const idx = posts.findIndex((p) => p.id === postData.id);
    if (idx >= 0) {
      posts[idx] = { ...posts[idx], ...postData };
    } else {
      posts.unshift(postData);
    }
    saveLocalPosts(posts);
    return { success: true, local: true };
  } catch (err) {
    return { success: false, error: err.message || "Failed to save locally" };
  }
}

/**
 * Delete a blog post by ID.
 * Remote when CMS URL is set, localStorage otherwise.
 */
export async function deleteBlogPost(postId) {
  if (!postId) return { success: false, error: "Missing post ID" };

  // Tombstone first so the UI hides the post regardless of what the CMS
  // round-trip does — static-data posts and CMS posts alike. The no-cors
  // fetch below can't read the server response, so this is the source of
  // truth for "is it deleted from the admin's view."
  addDeletedBlogId(postId);

  if (CONFIG.blogCmsUrl) {
    const token = getStaffToken();
    if (!token) return { success: false, error: "Staff session expired. Please unlock the dashboard again." };

    try {
      // Best-effort: if the post exists in the CMS sheet, remove it there too.
      // The response is opaque (no-cors), so we can't surface server errors.
      await fetch(CONFIG.blogCmsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "delete", id: postId, token }),
      });
      try { localStorage.removeItem(BLOG_CACHE_KEY); } catch { /* ignore */ }
    } catch { /* tombstone already recorded — local view stays correct */ }
    return { success: true };
  }

  // ── Local mode ──
  try {
    const posts = getLocalPosts().filter((p) => p.id !== postId);
    saveLocalPosts(posts);
    return { success: true, local: true };
  } catch (err) {
    return { success: false, error: err.message || "Failed to delete locally" };
  }
}

/**
 * Fetch blog posts.
 * Remote CMS → localStorage cache → local-only posts as fallback.
 */
export async function fetchBlogPosts() {
  // ── Remote CMS mode ──
  if (CONFIG.blogCmsUrl) {
    try {
      const cached = JSON.parse(localStorage.getItem(BLOG_CACHE_KEY) || "null");
      if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
    } catch { /* ignore */ }

    try {
      const res = await fetch(CONFIG.blogCmsUrl);
      if (!res.ok) return null;
      const posts = await res.json();
      if (!Array.isArray(posts)) return null;
      try {
        localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify({ data: posts, ts: Date.now() }));
      } catch { /* quota exceeded */ }
      return posts;
    } catch {
      return null;
    }
  }

  // ── Local mode — return any locally-saved posts (may be empty) ──
  const local = getLocalPosts();
  return local.length > 0 ? local : null;
}
