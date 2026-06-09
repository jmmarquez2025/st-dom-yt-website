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

