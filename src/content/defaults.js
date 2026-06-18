/**
 * Shipped translation defaults, read straight from the bundled locale JSON.
 *
 * The dashboard needs the ORIGINAL (un-overridden) string for two things:
 * pre-filling each editor field with the real current copy, and detecting when
 * an edit equals the default (so the override can be pruned). It can't read
 * these from the live i18n instance because that may already carry overrides.
 *
 * Imported only by editor components, which are lazy-loaded behind the staff
 * passphrase — so es.json never lands in the public bundle.
 */

import en from "../locales/en.json";
import es from "../locales/es.json";
import { getByPath } from "./flatten";

const LOCALES = { en, es };

/** The shipped value for a dotted i18n key in a given language ("" if absent). */
export function getDefault(lang, key) {
  const table = LOCALES[lang] || LOCALES.en;
  const value = getByPath(table, key);
  if (value == null) return "";
  return value;
}
