import { useEffect } from "react";
import { CONFIG } from "../constants/config";
import { getContact, getActiveSocial } from "../settings/store";
import { getSiteNameFull } from "../content/branding";
import { useAdminSyncSignal } from "../cms/hooks";

/**
 * Keeps the organization JSON-LD (the CatholicChurch block in index.html) in
 * sync with the editable Settings — contact info, office hours, and social
 * links — instead of leaving it hardcoded and stale. Non-JS crawlers still see
 * the build-time baseline in index.html; JS crawlers get the live values.
 */
export default function OrgSchema() {
  const sync = useAdminSyncSignal(); // re-run when admin data is pulled/changed

  useEffect(() => {
    const c = getContact(CONFIG);
    const social = getActiveSocial().map((s) => s.url).filter(Boolean);
    const sameAs = Array.from(new Set([CONFIG.youtubeChannelUrl, "https://dominicanfriars.org/", ...social].filter(Boolean)));

    const telephone = (c.phoneLink || "").replace(/^tel:/, "") || c.phone || "";

    const schema = {
      "@context": "https://schema.org",
      "@type": "CatholicChurch",
      name: getSiteNameFull(),
      alternateName: "Santo Domingo Parroquia Católica",
      address: {
        "@type": "PostalAddress",
        streetAddress: c.address || "",
        addressLocality: c.city || "",
        addressRegion: c.state || "",
        postalCode: c.zip || "",
        addressCountry: "US",
      },
      geo: { "@type": "GeoCoordinates", latitude: 41.0855, longitude: -80.6549 },
      telephone,
      faxNumber: c.fax || "",
      email: c.email || "",
      url: CONFIG.siteUrl,
      foundingDate: "1923-02-23",
      inLanguage: ["en", "es"],
      memberOf: { "@type": "Organization", name: "Diocese of Youngstown" },
      sameAs,
    };
    if (c.officeHours) schema.description = `Church office hours: ${c.officeHours}.`;

    let el = document.getElementById("org-json-ld");
    if (!el) {
      el = document.createElement("script");
      el.id = "org-json-ld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
  }, [sync]);

  return null;
}
