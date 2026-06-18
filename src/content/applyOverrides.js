/**
 * Content override engine
 * ───────────────────────
 * Reads every per-page content shard from localStorage and layers the edited
 * EN/ES strings on top of the shipped locale bundles at runtime, so page
 * components keep calling `t("home.hero.title")` unchanged while the dashboard
 * controls what that resolves to.
 *
 * Lifecycle:
 *   - installContentOverrides()  — called once from main.jsx BEFORE first paint
 *     (no flash of default copy), and registers a listener so that when
 *     pullAll() finishes hydrating localStorage from the Google Sheet
 *     ("stdom:admin-synced"), the fresh overrides are re-applied and the UI
 *     repaints.
 *   - i18n.js's changeLanguage wrapper re-applies overrides after a lazily
 *     loaded base locale registers, so toggling EN↔ES never clobbers edits
 *     with the shipped copy.
 *   - PageEditor calls applyContentOverrides() + notifyI18nChange() on Save so
 *     the live site (and the "Preview ↗" tab) updates immediately.
 */

import i18n from "../i18n";
import { CONTENT_SHARD_KEYS } from "./shards";
import { unflatten } from "./flatten";

/** Merge every shard's overrides into the live i18n resource store. */
export function applyContentOverrides() {
  const merged = { en: {}, es: {} };

  for (const shardKey of CONTENT_SHARD_KEYS) {
    let raw;
    try {
      raw = localStorage.getItem(shardKey);
    } catch {
      raw = null;
    }
    if (!raw) continue;
    let env;
    try {
      env = JSON.parse(raw);
    } catch {
      continue; // corrupt shard — skip, keep applying the others
    }
    if (env && env.en && typeof env.en === "object") Object.assign(merged.en, env.en);
    if (env && env.es && typeof env.es === "object") Object.assign(merged.es, env.es);
  }

  // deep = true (merge into existing tree), overwrite = true (edited value wins).
  if (Object.keys(merged.en).length) {
    i18n.addResourceBundle("en", "translation", unflatten(merged.en), true, true);
  }
  if (Object.keys(merged.es).length) {
    i18n.addResourceBundle("es", "translation", unflatten(merged.es), true, true);
  }
}

/**
 * Layer an explicit flat key→value map onto one language's live bundle. Used by
 * the editor on Save so the page reflects exactly what's in the form — INCLUDING
 * fields just reset to default, which `applyContentOverrides` (add-only) can't
 * restore on its own because the engine doesn't hold the shipped base. The
 * mount/pull path doesn't need this: it re-applies onto a freshly loaded base.
 */
export function applyFlatToI18n(lang, flatMap) {
  if (flatMap && Object.keys(flatMap).length) {
    i18n.addResourceBundle(lang, "translation", unflatten(flatMap), true, true);
  }
}

/**
 * Force every `t()` consumer to re-read. react-i18next's useTranslation binds
 * to i18next's "languageChanged" event by default, so emitting it (with the
 * unchanged current language) repaints the tree without actually switching
 * languages. Used after a runtime re-apply; not needed pre-paint.
 */
export function notifyI18nChange() {
  try {
    i18n.emit("languageChanged", i18n.language);
  } catch {
    /* no listeners / emit unsupported — nothing to repaint */
  }
}

let installed = false;

/** Apply once before first paint, then keep in sync with cloud pulls. */
export function installContentOverrides() {
  if (installed) return;
  installed = true;

  applyContentOverrides();

  if (typeof window !== "undefined") {
    window.addEventListener("stdom:admin-synced", () => {
      applyContentOverrides();
      notifyI18nChange();
    });
  }
}
