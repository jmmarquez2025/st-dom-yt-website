import { T } from "../constants/theme";
import { INTENTION_TYPES, isOverdue } from "../data/massIntentions";
import { statusStyle, formatDate } from "./format";
import { AlertTriangle, ChevronRight } from "lucide-react";

const TYPE_LABEL_KEY = Object.fromEntries(INTENTION_TYPES.map((x) => [x.value, x.labelKey]));

export default function IntentionListRow({ intention, onSelect, t }) {
  const s = statusStyle(intention.status);
  const overdue = isOverdue(intention);
  const prefLabel =
    !intention.requestedDatePref || intention.requestedDatePref === "first-available"
      ? t("massIntentions.datePrefFirst")
      : formatDate(intention.requestedDatePref);

  return (
    <button
      type="button"
      onClick={() => onSelect(intention.id)}
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 0.9fr 1.1fr auto",
        alignItems: "center",
        gap: 12,
        width: "100%",
        textAlign: "left",
        padding: "14px 16px",
        background: "#fff",
        border: `1px solid ${T.stone}`,
        borderRadius: "var(--radius-card)",
        cursor: "pointer",
        fontFamily: "'Source Sans 3', sans-serif",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.burgundy;
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(107,29,42,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.stone;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: T.softBlack,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {intention.personName || "—"}
        </div>
        <div style={{ fontSize: 12.5, color: T.warmGray }}>
          {t(TYPE_LABEL_KEY[intention.intentionType] || "massIntentions.typeSpecial")}
        </div>
      </div>

      <div style={{ fontSize: 13, color: T.warmGray, minWidth: 0 }}>
        <div
          style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          title={intention.requesterName}
        >
          {intention.requesterName || "—"}
        </div>
      </div>

      <div style={{ fontSize: 13, color: T.warmGray, display: "flex", alignItems: "center", gap: 6 }}>
        {prefLabel}
        {overdue && <AlertTriangle size={14} color={T.error} aria-label="overdue" />}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, justifySelf: "end" }}>
        <span
          className="chip"
          style={{
            background: s.bg,
            color: s.color,
            fontSize: 11.5,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 999,
            whiteSpace: "nowrap",
          }}
        >
          {t(`massIntentionsAdmin.status${cap(intention.status)}`)}
        </span>
        <ChevronRight size={16} color={T.warmGray} />
      </div>
    </button>
  );
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}
