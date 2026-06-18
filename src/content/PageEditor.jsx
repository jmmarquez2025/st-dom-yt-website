import { useMemo, useState, useCallback } from "react";
import { ArrowLeft, ExternalLink, Save } from "lucide-react";
import { T } from "../constants/theme";
import { makeContentStore } from "./store";
import { getSchema } from "./schema";
import { getDefault } from "./defaults";
import { applyFlatToI18n, notifyI18nChange } from "./applyOverrides";
import { schemaKeys } from "./schema/_helpers";
import PageField from "./fields/PageField";
import ImageSlotField from "./fields/ImageSlotField";
import { IMAGE_SLOTS } from "./images";
import { SERIF, SANS, primaryBtn } from "./fields/styles";

/**
 * Per-page bilingual editor. Reads the page's field schema, shows each field's
 * effective value (override or shipped default), and writes a sparse override
 * blob to the page's shard. Saving re-applies overrides immediately so the
 * live site (and the Preview tab) reflect the edit.
 */
export default function PageEditor({ page, onToast, onBack }) {
  const store = useMemo(() => makeContentStore(page.shardKey), [page.shardKey]);
  const schema = useMemo(() => getSchema(page.id, page.ns), [page.id, page.ns]);

  // Local working copy of the sparse overrides; only keys that differ from the
  // shipped default live here.
  const [overrides, setOverrides] = useState(() => store.getOverrides());
  const [dirty, setDirty] = useState(false);

  const effective = useCallback(
    (lang, key) => {
      const o = overrides[lang];
      return key in o ? o[key] : getDefault(lang, key);
    },
    [overrides]
  );

  const isOverridden = useCallback(
    (key) => key in overrides.en || key in overrides.es,
    [overrides]
  );

  const handleChange = useCallback((lang, key, value) => {
    setOverrides((prev) => {
      const next = { ...prev[lang] };
      // Editing a field back to the shipped default prunes the override so the
      // shard stays sparse (and the field stops showing as customised). Arrays
      // (list fields) compare by value, not reference.
      const def = getDefault(lang, key);
      const isDefault =
        Array.isArray(value) || Array.isArray(def)
          ? JSON.stringify(value) === JSON.stringify(def)
          : value === def;
      if (isDefault) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return { ...prev, [lang]: next };
    });
    setDirty(true);
  }, []);

  const handleResetField = useCallback((key) => {
    setOverrides((prev) => {
      const en = { ...prev.en };
      const es = { ...prev.es };
      delete en[key];
      delete es[key];
      return { en, es };
    });
    setDirty(true);
  }, []);

  // Push the page's effective copy (override or shipped default) for every
  // field onto the live bundle, so the public page matches the form exactly —
  // including fields reset back to default this session.
  const pushLive = useCallback(
    (ov) => {
      const keys = schema ? schemaKeys(schema) : [];
      const enFlat = {};
      const esFlat = {};
      for (const key of keys) {
        enFlat[key] = key in ov.en ? ov.en[key] : getDefault("en", key);
        esFlat[key] = key in ov.es ? ov.es[key] : getDefault("es", key);
      }
      applyFlatToI18n("en", enFlat);
      applyFlatToI18n("es", esFlat);
      notifyI18nChange();
    },
    [schema]
  );

  const handleSave = useCallback(() => {
    try {
      store.setAll(overrides.en, overrides.es);
      pushLive(overrides);
      setDirty(false);
      onToast?.({ message: `${page.label} page saved`, type: "success" });
    } catch {
      onToast?.({ message: "Couldn't save. Please try again.", type: "error" });
    }
  }, [store, overrides, page.label, onToast, pushLive]);

  const handleResetPage = useCallback(() => {
    if (!window.confirm(`Reset the whole ${page.label} page to the original site text?`)) return;
    store.clear();
    const cleared = { en: {}, es: {} };
    setOverrides(cleared);
    pushLive(cleared);
    setDirty(false);
    onToast?.({ message: `${page.label} page reset to defaults`, type: "success" });
  }, [store, page.label, onToast, pushLive]);

  const previewHref = useMemo(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    return base + page.route;
  }, [page.route]);

  if (!schema) {
    return (
      <p style={{ fontFamily: SANS, color: T.warmGray }}>
        No editable fields are defined for this page yet.
      </p>
    );
  }

  return (
    <div>
      {/* Editor header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back to pages"
              style={{ background: "none", border: "none", color: T.warmGray, cursor: "pointer", padding: 4, display: "inline-flex" }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>
            {page.label}
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Opens the page in a new tab — it reflects your latest local edits"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              border: `1px solid ${T.stone}`,
              borderRadius: "var(--radius-card)",
              color: T.charcoal,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: SANS,
            }}
          >
            <ExternalLink size={15} /> Preview
          </a>
          <button onClick={handleSave} disabled={!dirty} style={primaryBtn(dirty)}>
            <Save size={16} /> Save changes
          </button>
        </div>
      </div>

      {/* Field groups, top-to-bottom like the page itself */}
      {schema.groups.map((grp) => (
        <section key={grp.title} style={{ marginBottom: 30 }}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              fontWeight: 600,
              color: T.burgundy,
              margin: "0 0 14px",
              paddingBottom: 8,
              borderBottom: `1px solid ${T.stone}`,
            }}
          >
            {grp.title}
          </h3>
          {grp.fields.map((field) => (
            <PageField
              key={field.key}
              field={field}
              en={effective("en", field.key)}
              es={effective("es", field.key)}
              enDefault={getDefault("en", field.key)}
              esDefault={getDefault("es", field.key)}
              overridden={isOverridden(field.key)}
              onChange={(lang, value) => handleChange(lang, field.key, value)}
              onReset={() => handleResetField(field.key)}
            />
          ))}
        </section>
      ))}

      {/* Per-page images (saved immediately on change) */}
      {IMAGE_SLOTS[page.id] && (
        <section style={{ marginBottom: 30 }}>
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              fontWeight: 600,
              color: T.burgundy,
              margin: "0 0 14px",
              paddingBottom: 8,
              borderBottom: `1px solid ${T.stone}`,
            }}
          >
            Images
          </h3>
          {IMAGE_SLOTS[page.id].map((img) => (
            <ImageSlotField key={img.slot} slot={img.slot} label={img.label} onToast={onToast} />
          ))}
        </section>
      )}

      {/* Page-level reset */}
      <div style={{ borderTop: `1px solid ${T.stone}`, paddingTop: 18, marginTop: 8 }}>
        <button
          onClick={handleResetPage}
          style={{ background: "none", border: "none", color: T.warmGray, fontSize: 13, fontFamily: SANS, cursor: "pointer", textDecoration: "underline" }}
        >
          Reset this entire page to the original site text
        </button>
      </div>
    </div>
  );
}
