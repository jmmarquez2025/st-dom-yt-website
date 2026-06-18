import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// The active locale ships in its own chunk (Vite splits the dynamic import
// per file). The inactive locale is fetched only if the user toggles
// language, keeping ~75 KB of unused JSON out of the initial bundle.
const SUPPORTED = ["en", "es"];
const initialLang = (() => {
  try {
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    /* localStorage unavailable */
  }
  return "en";
})();

// Deep clone so i18next never holds a reference to the imported locale JSON
// module. The content-override engine calls addResourceBundle(deep, overwrite),
// which deep-extends INTO i18next's resource store — if that store were the
// imported object, those merges would mutate the shipped translations that the
// dashboard reads back as "defaults" (src/content/defaults.js).
const clone = (obj) => JSON.parse(JSON.stringify(obj));

const loadLocale = (lng) =>
  import(`./locales/${lng}.json`).then((m) => clone(m.default));

const initialBundle = await loadLocale(initialLang);

i18n.use(initReactI18next).init({
  resources: { [initialLang]: { translation: initialBundle } },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Wrap changeLanguage so the requested bundle is fetched and registered
// before i18next swaps languages — otherwise the first paint after a toggle
// shows the fallback locale until the bundle resolves.
const _changeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = async (lng, ...rest) => {
  if (lng && SUPPORTED.includes(lng) && !i18n.hasResourceBundle(lng, "translation")) {
    try {
      const bundle = await loadLocale(lng);
      i18n.addResourceBundle(lng, "translation", bundle, true, true);
      // Re-layer admin content overrides on top of the freshly loaded base —
      // otherwise toggling language would clobber edited strings with the
      // shipped copy. Dynamic import avoids a static import cycle with the
      // override engine (which imports this module). Runs before the language
      // actually switches, so the first paint in the new language is correct.
      try {
        const { applyContentOverrides } = await import("./content/applyOverrides");
        applyContentOverrides();
      } catch {
        /* override engine unavailable — the base bundle still works */
      }
    } catch {
      /* network failure — i18next falls back to the active language */
    }
  }
  return _changeLanguage(lng, ...rest);
};

export default i18n;
