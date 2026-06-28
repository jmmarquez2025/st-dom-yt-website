/**
 * Mass Intentions — Staff Dashboard data API.
 *
 * Intention records contain PII (requester email/phone/address, names of the
 * deceased, *private* intentions), so — unlike the other admin sections — they
 * are deliberately NOT a "managed section" broadcast to every visitor by
 * adminSync.pullAll(). Instead they live in a private "Intentions" tab of the
 * Google Sheet and are reached only through the token-gated Apps Script
 * endpoints below. The storage key is intentionally absent from MANAGED_KEYS.
 *
 *   fetchAll(token)        — GET all rows (token in query string)
 *   update(id, patch)      — POST a single-row patch (fire-and-forget, no-cors)
 *   getCached()            — last-fetched rows, for instant reloads on one device
 *
 * The token is the same staff passphrase token adminSync uses, written to
 * sessionStorage by the Staff Dashboard passphrase gate.
 */

import { CONFIG } from "../constants/config";

// Per-device cache only. NOT a managed key — never synced to every visitor.
const CACHE_KEY = "stdom_mass_intentions_cache";
const TOKEN_KEY = "stdom_staff_token";

export function isConfigured() {
  return Boolean(CONFIG.massIntentionsUrl);
}

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function getCached() {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function setCache(list) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  } catch {
    /* quota or storage disabled — keep working from in-memory state */
  }
}

function applyPatchToCache(id, patch) {
  const now = new Date().toISOString();
  const list = getCached().map((i) =>
    i.id === id ? { ...i, ...patch, updatedAt: now } : i
  );
  setCache(list);
  return list;
}

/**
 * Fetch every intention row. Reads the Apps Script JSON response the same way
 * adminSync.pullAll() does (Apps Script GET responses are cross-origin
 * readable). Falls back to the per-device cache when the backend isn't set.
 */
export async function fetchAll(token = getToken()) {
  if (!isConfigured()) return getCached();
  const url = `${CONFIG.massIntentionsUrl}?resource=intentions&token=${encodeURIComponent(
    token
  )}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (body && body.error) throw new Error(body.error);
  const list = Array.isArray(body) ? body : body.intentions || [];
  setCache(list);
  return list;
}

/**
 * Patch one intention (assign date/time/celebrant, change status, record
 * offering, mark fulfilled…). Fire-and-forget no-cors POST mirroring
 * adminSync.doPush — the response is opaque, so we optimistically update the
 * cache and return the new list. Without a backend, edits stay device-local.
 */
export async function update(id, patch, token = getToken()) {
  if (!isConfigured()) return applyPatchToCache(id, patch);
  if (!token) {
    throw new Error("Unlock the Staff Dashboard before saving changes.");
  }
  await fetch(CONFIG.massIntentionsUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ token, resource: "intentions", action: "update", id, patch }),
  });
  return applyPatchToCache(id, patch);
}
