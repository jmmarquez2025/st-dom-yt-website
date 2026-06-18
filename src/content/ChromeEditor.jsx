import { CHROME } from "./registry";
import PageEditor from "./PageEditor";
import NavLayoutEditor from "./NavLayoutEditor";
import { SANS } from "./fields/styles";
import { T } from "../constants/theme";

const INTROS = {
  nav: "Edit the menu labels shown in the header (and reused as footer link labels), in English and Spanish. Menu structure and links are fixed in code; only the wording is editable here.",
  footer: "Edit the footer headings, link labels, and fine print, in English and Spanish.",
};

/**
 * Navigation / Footer editor. Reuses the per-page bilingual editor against the
 * `nav` / `footer` i18n namespaces, so changing a label here updates everywhere
 * that label appears across the site.
 */
export default function ChromeEditor({ chromeId, onToast }) {
  const entry = CHROME.find((c) => c.id === chromeId);
  if (!entry) return null;
  return (
    <div>
      <p style={{ fontFamily: SANS, fontSize: 14, color: T.warmGray, margin: "0 0 22px", maxWidth: 760 }}>
        {INTROS[chromeId]}
      </p>
      {chromeId === "nav" && <NavLayoutEditor onToast={onToast} />}
      <PageEditor page={entry} onToast={onToast} />
    </div>
  );
}
