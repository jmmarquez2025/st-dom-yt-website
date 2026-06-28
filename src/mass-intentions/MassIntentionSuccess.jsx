import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import DominicanDivider from "../components/DominicanDivider";
import { CheckCircle, Gift } from "lucide-react";
import { cardStyle } from "./MassIntentionFields";

/**
 * Confirmation panel shown after a successful submission. Includes the
 * voluntary-offering hand-off to the Flocknote giving page.
 */
export default function MassIntentionSuccess({ name, message, onReset }) {
  const { t } = useTranslation();
  return (
    <div
      aria-live="polite"
      role="status"
      style={{
        ...cardStyle,
        background: "#eef6ec",
        border: "1px solid #c8e6c9",
        textAlign: "center",
        animation: "fadeInScale 0.4s ease",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(46,125,50,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <CheckCircle size={32} color="#2e7d32" />
      </div>
      <h2
        style={{
          fontSize: 24,
          color: "#2e7d32",
          fontWeight: 600,
          fontFamily: "'Cormorant Garamond', serif",
          marginBottom: 12,
        }}
      >
        {message || t("massIntentions.success")}
      </h2>
      <p style={{ fontSize: 15, color: T.warmGray, lineHeight: 1.7, marginBottom: 8 }}>
        {t("massIntentions.successMessage", { name })}
      </p>

      <DominicanDivider />

      <a
        href={CONFIG.flocknoteGivingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-hover"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginTop: 8,
          background: T.gold,
          color: T.softBlack,
          textDecoration: "none",
          padding: "14px 28px",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          borderRadius: "var(--radius-control)",
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        <Gift size={16} />
        {t("massIntentions.successOfferingCta")}
      </a>
      <p style={{ fontSize: 13, color: T.warmGray, marginTop: 12, lineHeight: 1.6 }}>
        {t("massIntentions.successOfferingNote")}
      </p>
      <p style={{ fontSize: 13, color: T.warmGray, marginTop: 16, lineHeight: 1.6 }}>
        {t("massIntentions.successFallback")}
      </p>
      <button
        onClick={onReset}
        style={{
          marginTop: 20,
          background: "none",
          border: "1px solid #66bb6a",
          borderRadius: "var(--radius-control)",
          padding: "10px 24px",
          fontSize: 14,
          color: "#2e7d32",
          cursor: "pointer",
          fontWeight: 600,
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        {t("massIntentions.successReset")}
      </button>
    </div>
  );
}
