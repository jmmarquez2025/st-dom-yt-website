/**
 * Admin Sync
 * ───────────
 * Two-way sync between localStorage (fast in-browser cache) and a shared
 * Google Sheet via the admin-cms.gs web app.
 *
 *  - pullAll()          — fetch every section from the sheet and hydrate
 *                         localStorage. Called on app mount so a visitor
 *                         on any device sees the latest admin edits.
 *  - push(section)      — debounced, fire-and-forget upload of one section.
 *                         Stores reuse this after they write to localStorage.
 *  - clearRemote()      — wipe every managed section on the sheet.
 *  - getStatus()        — { lastPulledAt, lastPushedAt, pending, error }
 *  - subscribe(fn)      — notify listeners when status changes.
 *
 * Writes require a passphrase token — the same one used to unlock the
 * Staff Dashboard. It's read from sessionStorage "stdom_staff_auth" if
 * present, otherwise the caller can pass it explicitly.
 */

import { CONFIG } from "../constants/config";
import { MANAGED_KEYS } from "../admin/dataManager";

const STATUS_KEY = "stdom_admin_sync_status";
const TOKEN_KEY = "stdom_staff_token";
const LEGACY_TOKEN_KEY = "stdom_staff_auth";
const DEBOUNCE_MS = 1500;

const listeners = new Set();
const pushTimers = new Map();
let status = loadStatus();
let suppressAutoSync = false;

function loadStatus() {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* localStorage unavailable or corrupt — fall through to defaults */ }
  return { lastPulledAt: null, lastPushedAt: null, pending: [], error: null };
}

function saveStatus(patch) {
  status = { ...status, ...patch };
  try {
    localStorage.setItem(STATUS_KEY, JSON.stringify(status));
  } catch (_) { /* quota exceeded or storage disabled — keep in-memory copy */ }
  listeners.forEach((fn) => {
    try { fn(status); } catch (_) { /* one bad listener shouldn't break the others */ }
  });
}

export function getStatus() {
  return status;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isConfigured() {
  return Boolean(CONFIG.adminCmsUrl);
}

function getToken(explicit) {
  if (explicit) return explicit;
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) return token;

    // Older sessions stored the auth flag in stdom_staff_auth. Treat "1" as
    // an auth marker, not as a write token, while still accepting a real token
    // if a previous build stored it there.
    const legacy = sessionStorage.getItem(LEGACY_TOKEN_KEY) || "";
    return legacy && legacy !== "1" ? legacy : "";
  } catch {
    return "";
  }
}

/**
 * Pull every managed section from the sheet and write it to localStorage.
 * Safe to call on every page load — falls back silently if the backend
 * isn't configured or unreachable. Returns the number of sections hydrated.
 */
export async function pullAll() {
  if (!isConfigured()) return 0;
  try {
    const res = await fetch(CONFIG.adminCmsUrl, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    if (body.error) throw new Error(body.error);
    const sections = body.sections || {};
    let hydrated = 0;
    suppressAutoSync = true;
    try {
      Object.entries(sections).forEach(([key, record]) => {
        if (!MANAGED_KEYS.includes(key)) return;
        const data = record && record.data;
        if (typeof data === "string") {
          try {
            if (data.length > 0) localStorage.setItem(key, data);
            else localStorage.removeItem(key);
            hydrated += 1;
          } catch (_) { /* quota — skip this section, keep hydrating others */ }
        }
      });
    } finally {
      suppressAutoSync = false;
    }
    saveStatus({ lastPulledAt: new Date().toISOString(), error: null });
    // Let stores/hooks know fresh data arrived
    try { window.dispatchEvent(new Event("stdom:admin-synced")); } catch (_) { /* CustomEvent unsupported — listeners poll on their own */ }
    return hydrated;
  } catch (err) {
    saveStatus({ error: `Pull failed: ${err.message || err}` });
    return 0;
  }
}

/**
 * Push one section to the sheet. Debounced per-section so rapid edits
 * collapse into a single network call. Fire-and-forget — the response is
 * not awaited (Apps Script + mode:"no-cors" means the browser can't read
 * it anyway). If the backend isn't configured, this is a no-op.
 */
export function push(section, token) {
  if (!isConfigured()) return;
  if (!MANAGED_KEYS.includes(section)) return;

  // Mark as pending immediately so the UI can show "saving…"
  const pending = Array.from(new Set([...(status.pending || []), section]));
  saveStatus({ pending });

  if (pushTimers.has(section)) clearTimeout(pushTimers.get(section));
  // Stagger when several sections are pending at once (e.g. a save-all), so the
  // debounced POSTs don't all fire on the same tick and overwhelm Apps Script.
  const delay = DEBOUNCE_MS + pushTimers.size * 150;
  const timer = setTimeout(() => {
    pushTimers.delete(section);
    doPush(section, getToken(token));
  }, delay);
  pushTimers.set(section, timer);
}

/** Flush every pending debounce timer immediately, as ONE batched upload. */
export function flush(token) {
  const sections = [];
  pushTimers.forEach((timer, section) => {
    clearTimeout(timer);
    sections.push(section);
  });
  pushTimers.clear();
  if (sections.length) doBatchPush(sections, getToken(token));
}

/**
 * Run `fn` without the auto-sync interceptor firing per write, then push every
 * touched key in a single batch. Used by import/restore so a backup doesn't
 * trigger N separate POSTs.
 */
export function runWithoutAutoSync(fn, keysToPush, token) {
  suppressAutoSync = true;
  try {
    fn();
  } finally {
    suppressAutoSync = false;
  }
  const keys = (keysToPush || []).filter((k) => MANAGED_KEYS.includes(k));
  if (keys.length) doBatchPush(keys, getToken(token));
}

/** POST several sections in one request via the Apps Script batch endpoint. */
async function doBatchPush(sectionKeys, token) {
  if (!isConfigured()) return;
  if (!token) {
    saveStatus({ error: "Push skipped: unlock the Staff Dashboard before saving cloud changes." });
    return;
  }
  const sections = {};
  sectionKeys.forEach((k) => {
    sections[k] = localStorage.getItem(k) ?? "";
  });
  saveStatus({ pending: Array.from(new Set([...(status.pending || []), ...sectionKeys])) });
  try {
    await fetch(CONFIG.adminCmsUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ token, action: "batch", sections }),
    });
    const remaining = (status.pending || []).filter((s) => !sectionKeys.includes(s));
    saveStatus({ lastPushedAt: new Date().toISOString(), pending: remaining, error: null });
  } catch (err) {
    saveStatus({ error: `Batch push failed: ${err.message || err}` });
  }
}

async function doPush(section, token) {
  if (!token) {
    const remaining = (status.pending || []).filter((s) => s !== section);
    saveStatus({
      pending: remaining,
      error: "Push skipped: unlock the Staff Dashboard before saving cloud changes.",
    });
    return;
  }

  // null means "deleted locally" — upload empty string so remote matches
  const data = localStorage.getItem(section) ?? "";
  try {
    await fetch(CONFIG.adminCmsUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ token, section, data }),
    });
    const remaining = (status.pending || []).filter((s) => s !== section);
    saveStatus({ lastPushedAt: new Date().toISOString(), pending: remaining, error: null });
  } catch (err) {
    saveStatus({ error: `Push failed (${section}): ${err.message || err}` });
  }
}

/** Wipe every managed section on the sheet. */
export async function clearRemote(token) {
  if (!isConfigured()) return { ok: false, reason: "not-configured" };
  try {
    await fetch(CONFIG.adminCmsUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ token: getToken(token), action: "clear" }),
    });
    saveStatus({ lastPushedAt: new Date().toISOString(), pending: [], error: null });
    return { ok: true };
  } catch (err) {
    saveStatus({ error: `Clear failed: ${err.message || err}` });
    return { ok: false, reason: err.message };
  }
}

/**
 * Intercept localStorage writes on managed keys so every section store
 * (events, schedule, staff, ministries, settings, bulletins, announcements)
 * automatically syncs without needing to know about this module. Stores
 * keep writing to localStorage exactly as before — we just observe.
 */
let installed = false;
export function installAutoSync() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const origSet = Storage.prototype.setItem;
  const origRemove = Storage.prototype.removeItem;

  Storage.prototype.setItem = function (key, value) {
    origSet.call(this, key, value);
    if (!suppressAutoSync && this === window.localStorage && MANAGED_KEYS.includes(key)) {
      push(key);
    }
  };

  Storage.prototype.removeItem = function (key) {
    origRemove.call(this, key);
    if (!suppressAutoSync && this === window.localStorage && MANAGED_KEYS.includes(key)) {
      // Signal a deletion — doPush will send an empty string upstream
      push(key);
    }
  };
}

// Flush any pending writes before the tab closes
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (!pushTimers.size) return;
    const sections = {};
    pushTimers.forEach((timer, section) => {
      clearTimeout(timer);
      sections[section] = localStorage.getItem(section) ?? "";
    });
    pushTimers.clear();
    try {
      const token = getToken();
      if (!token) return;
      // One batched beacon for reliability during unload.
      const payload = JSON.stringify({ token, action: "batch", sections });
      navigator.sendBeacon(CONFIG.adminCmsUrl, payload);
    } catch (_) { /* sendBeacon unsupported — best-effort flush on unload */ }
  });
}
