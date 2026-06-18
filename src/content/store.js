/**
 * Per-page content store
 * ───────────────────────
 * A localStorage-backed store for one page's bilingual i18n overrides. One
 * shard key per page (see src/content/shards.js). The envelope written to
 * localStorage is:
 *
 *   { v: 1, updatedAt: "<ISO>", en: { "<dotted key>": "…" }, es: { … } }
 *
 * Writes go through plain `localStorage.setItem`, so the auto-sync interceptor
 * (src/cms/adminSync.js) pushes the shard to the Google Sheet automatically —
 * this module knows nothing about syncing, exactly like the other stores.
 *
 * Overrides are kept SPARSE: a field only appears when it differs from the
 * shipped default. The dashboard prunes a field back to default by removing it
 * (so the bundled translation shows through), which keeps every shard small.
 */

const SCHEMA_VERSION = 1;
const LANGS = ["en", "es"];

function emptyEnvelope() {
  return { v: SCHEMA_VERSION, updatedAt: null, en: {}, es: {} };
}

/** Create a store bound to one shard key. */
export function makeContentStore(shardKey) {
  function read() {
    let raw;
    try {
      raw = localStorage.getItem(shardKey);
    } catch {
      return emptyEnvelope();
    }
    if (!raw) return emptyEnvelope();
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return emptyEnvelope();
      return {
        v: parsed.v || SCHEMA_VERSION,
        updatedAt: parsed.updatedAt || null,
        en: parsed.en && typeof parsed.en === "object" ? parsed.en : {},
        es: parsed.es && typeof parsed.es === "object" ? parsed.es : {},
      };
    } catch {
      // Corrupt blob — behave as if there are no overrides rather than throwing.
      return emptyEnvelope();
    }
  }

  function write(env) {
    const envelope = {
      v: SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
      en: env.en || {},
      es: env.es || {},
    };
    const hasAny = LANGS.some((l) => Object.keys(envelope[l]).length > 0);
    try {
      if (hasAny) {
        localStorage.setItem(shardKey, JSON.stringify(envelope));
      } else {
        // No overrides left — remove the key so it reads as "all defaults".
        localStorage.removeItem(shardKey);
      }
    } catch {
      /* quota or storage disabled — the in-memory edit is lost on reload */
    }
    return envelope;
  }

  return {
    shardKey,

    /** The raw `{ en, es }` override maps (flat dotted keys → value). */
    getOverrides() {
      const { en, es } = read();
      return { en, es };
    },

    /** Replace the whole override set for both languages in one write. */
    setAll(en, es) {
      return write({ en: en || {}, es: es || {} });
    },

    /** Set one field; passing the shipped default value should be done by the
     *  caller via removeField instead, to keep the shard sparse. */
    setField(lang, key, value) {
      const env = read();
      env[lang] = { ...env[lang], [key]: value };
      return write(env);
    },

    /** Remove one field (falls back to the bundled default). */
    removeField(lang, key) {
      const env = read();
      if (env[lang] && key in env[lang]) {
        const next = { ...env[lang] };
        delete next[key];
        env[lang] = next;
        return write(env);
      }
      return env;
    },

    /** Drop every override on this shard. */
    clear() {
      try {
        localStorage.removeItem(shardKey);
      } catch {
        /* ignore */
      }
    },

    /** True if any override exists on this shard. */
    hasAny() {
      const { en, es } = read();
      return Object.keys(en).length > 0 || Object.keys(es).length > 0;
    },
  };
}
