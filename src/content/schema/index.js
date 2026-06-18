/**
 * Page id → field schema. A hand-curated schema wins; any page without one
 * gets an auto-built schema from its i18n namespace (src/content/schema/auto.js).
 */
import home from "./home";
import { buildSchema } from "./auto";

// Hand-curated schemas (nicer labels / grouping) override the auto-builder.
const CUSTOM = {
  home,
};

export function getSchema(id, ns) {
  if (CUSTOM[id]) return CUSTOM[id];
  return ns ? buildSchema(ns) : null;
}
