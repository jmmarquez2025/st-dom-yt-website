import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Phone } from "lucide-react";

/**
 * Shown on /mass-intentions while the feature is flag-disabled (ships dark).
 * Renders inside the page's centered container.
 */
export default function ComingSoon() {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: "center" }}>
      <h2
        style={{
          fontSize: 28,
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          color: T.softBlack,
          marginBottom: 12,
        }}
      >
        {t("massIntentions.comingSoonTitle")}
      </h2>
      <p style={{ fontSize: 16, color: T.warmGray, lineHeight: 1.7 }}>
        {t("massIntentions.comingSoonBody")}
      </p>
      <a
        href={CONFIG.phoneLink}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginTop: 24,
          color: T.burgundy,
          fontWeight: 600,
          textDecoration: "none",
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        <Phone size={16} />
        {CONFIG.phone}
      </a>
    </div>
  );
}
