import { useState } from "react";
import { T } from "../constants/theme";
import { INTENTION_TYPES, isLocked, isOverdue } from "../data/massIntentions";
import { statusStyle, formatDate, isoToday } from "./format";
import { ArrowLeft, Lock, AlertTriangle } from "lucide-react";

const TYPE_LABEL_KEY = Object.fromEntries(INTENTION_TYPES.map((x) => [x.value, x.labelKey]));

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 0.5,
  fontVariantCaps: "all-small-caps",
  color: T.warmGray,
  marginBottom: 4,
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 14,
  border: `1.5px solid ${T.stone}`,
  borderRadius: "var(--radius-control)",
  fontFamily: "'Source Sans 3', sans-serif",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function ReadRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ padding: "6px 0" }}>
      <span style={labelStyle}>{label}</span>
      <div style={{ fontSize: 14.5, color: T.softBlack, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function btn(variant) {
  const base = {
    padding: "11px 18px",
    fontSize: 13.5,
    fontWeight: 600,
    borderRadius: "var(--radius-control)",
    cursor: "pointer",
    fontFamily: "'Source Sans 3', sans-serif",
    border: "1px solid transparent",
    transition: "opacity 0.2s",
  };
  if (variant === "primary") return { ...base, background: T.burgundy, color: T.cream };
  if (variant === "danger") return { ...base, background: "#fff", color: "#b91c1c", borderColor: "#fecaca" };
  return { ...base, background: "#fff", color: T.charcoal, borderColor: T.stone };
}

export default function IntentionDetailPanel({ intention, celebrants, times, onSave, onClose, t }) {
  const locked = isLocked(intention);
  const overdue = isOverdue(intention);
  const s = statusStyle(intention.status);

  const [assignedDate, setAssignedDate] = useState(intention.assignedDate || "");
  const [assignedTime, setAssignedTime] = useState(intention.assignedTime || "");
  const [celebrantId, setCelebrantId] = useState(intention.celebrantId || "");
  const [offeringReceived, setOfferingReceived] = useState(
    intention.offeringReceived != null ? String(intention.offeringReceived) : ""
  );
  const [offeringReceivedDate, setOfferingReceivedDate] = useState(
    intention.offeringReceivedDate || ""
  );
  const [internalNotes, setInternalNotes] = useState(intention.internalNotes || "");
  const [notify, setNotify] = useState(false);
  const [assignError, setAssignError] = useState("");

  const [confirmMode, setConfirmMode] = useState(null); // null | "deny" | "fulfill"
  const [denyReason, setDenyReason] = useState("duplicate");
  const [fulfillDate, setFulfillDate] = useState(isoToday());

  const celebrantName = (celebrants.find((c) => c.id === celebrantId) || {}).name || "";

  const editablePatch = () => ({
    assignedDate,
    assignedTime,
    celebrantId,
    celebrantName,
    offeringReceived: offeringReceived === "" ? 0 : Number(offeringReceived),
    offeringReceivedDate,
    internalNotes,
  });

  const handleApprove = () => {
    if (!assignedDate || !assignedTime) {
      setAssignError(t("massIntentions.requiredError"));
      return;
    }
    setAssignError("");
    onSave({ ...editablePatch(), status: "scheduled", notify });
  };

  const handleSaveChanges = () => onSave(editablePatch());

  const handleDeny = () => {
    const reasonLabel = t(`massIntentionsAdmin.denyReason${cap(denyReason)}`);
    onSave({ status: "rejected", approvalReason: reasonLabel, notify });
  };

  const handleFulfill = () => {
    onSave({ ...editablePatch(), status: "fulfilled", fulfillmentDate: fulfillDate });
  };

  const handleTransfer = () => {
    if (!celebrantId) {
      setAssignError(t("massIntentions.requiredError"));
      return;
    }
    setAssignError("");
    onSave({ ...editablePatch(), status: "transferred", notify });
  };

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${T.stone}`,
        borderRadius: "var(--radius-card)",
        padding: "24px 26px",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("massIntentionsAdmin.actionClose")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: T.burgundy,
            cursor: "pointer",
            fontSize: 13.5,
            fontWeight: 600,
            fontFamily: "'Source Sans 3', sans-serif",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          {t("massIntentionsAdmin.actionClose")}
        </button>
        <span
          className="chip"
          style={{
            background: s.bg,
            color: s.color,
            fontSize: 11.5,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 999,
            marginLeft: "auto",
          }}
        >
          {t(`massIntentionsAdmin.status${cap(intention.status)}`)}
        </span>
      </div>

      <h2
        style={{
          fontSize: 24,
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          color: T.softBlack,
          marginBottom: 2,
        }}
      >
        {intention.personName || "—"}
      </h2>
      <div style={{ fontSize: 13.5, color: T.warmGray, marginBottom: 18 }}>
        {t(TYPE_LABEL_KEY[intention.intentionType] || "massIntentions.typeSpecial")}
      </div>

      {overdue && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius-control)",
            color: "#b91c1c",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          <AlertTriangle size={16} />
          {t("massIntentionsAdmin.overdueNote")}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 8,
        }}
        className="mi-detail-grid"
      >
        {/* Requester */}
        <section>
          <h3 style={sectionTitleStyle}>{t("massIntentionsAdmin.detailRequester")}</h3>
          <ReadRow label={t("massIntentions.requesterName")} value={intention.requesterName} />
          <ReadRow label={t("massIntentions.requesterEmail")} value={intention.requesterEmail} />
          <ReadRow label={t("massIntentions.requesterPhone")} value={intention.requesterPhone} />
          <ReadRow label={t("massIntentions.requesterAddress")} value={intention.requesterAddress} />
        </section>

        {/* Intention */}
        <section>
          <h3 style={sectionTitleStyle}>{t("massIntentionsAdmin.detailIntention")}</h3>
          <ReadRow
            label={t("massIntentions.datePref")}
            value={
              !intention.requestedDatePref || intention.requestedDatePref === "first-available"
                ? t("massIntentions.datePrefFirst")
                : formatDate(intention.requestedDatePref)
            }
          />
          <ReadRow label={t("massIntentions.massPref")} value={intention.requestedMassPref} />
          <ReadRow
            label={t("massIntentions.announce")}
            value={
              intention.announcementPreference === "private"
                ? t("massIntentions.announcePrivate")
                : t("massIntentions.announcePublic")
            }
          />
          <ReadRow label={t("massIntentions.notes")} value={intention.notes} />
        </section>
      </div>

      {locked ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
            padding: "12px 14px",
            background: T.stoneLight,
            borderRadius: "var(--radius-control)",
            color: T.warmGray,
            fontSize: 13.5,
          }}
        >
          <Lock size={15} />
          {t("massIntentionsAdmin.lockedNote")}
          {intention.fulfillmentDate ? ` (${formatDate(intention.fulfillmentDate)})` : ""}
        </div>
      ) : (
        <>
          <h3 style={{ ...sectionTitleStyle, marginTop: 16 }}>
            {t("massIntentionsAdmin.detailAssign")}
          </h3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}
            className="mi-assign-grid"
          >
            <Field label={t("massIntentionsAdmin.assignDate")}>
              <input
                type="date"
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label={t("massIntentionsAdmin.assignTime")}>
              <select
                value={assignedTime}
                onChange={(e) => setAssignedTime(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">—</option>
                {times.map((tm) => (
                  <option key={tm} value={tm}>
                    {tm}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("massIntentionsAdmin.assignCelebrant")}>
              <select
                value={celebrantId}
                onChange={(e) => setCelebrantId(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">{t("massIntentionsAdmin.assignCelebrantNone")}</option>
                {celebrants.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}
            className="mi-assign-grid"
          >
            <Field label={t("massIntentionsAdmin.offeringReceived")}>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                value={offeringReceived}
                onChange={(e) => setOfferingReceived(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label={t("massIntentionsAdmin.offeringDate")}>
              <input
                type="date"
                value={offeringReceivedDate}
                onChange={(e) => setOfferingReceivedDate(e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>

          <div style={{ marginTop: 14 }}>
            <Field label={t("massIntentionsAdmin.internalNotes")}>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Field>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 12,
              fontSize: 13.5,
              color: T.softBlack,
              cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              style={{ accentColor: T.burgundy, width: 16, height: 16 }}
            />
            {t("massIntentionsAdmin.notify")}
          </label>

          {assignError && (
            <div style={{ color: T.error, fontSize: 12.5, marginTop: 8 }}>{assignError}</div>
          )}

          {/* Inline confirm: deny */}
          {confirmMode === "deny" && (
            <div style={confirmBoxStyle}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                {t("massIntentionsAdmin.denyTitle")}
              </div>
              <Field label={t("massIntentionsAdmin.denyReason")}>
                <select
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="duplicate">{t("massIntentionsAdmin.denyReasonDuplicate")}</option>
                  <option value="invalid">{t("massIntentionsAdmin.denyReasonInvalid")}</option>
                  <option value="outside">{t("massIntentionsAdmin.denyReasonOutside")}</option>
                  <option value="other">{t("massIntentionsAdmin.denyReasonOther")}</option>
                </select>
              </Field>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button type="button" style={btn("danger")} onClick={handleDeny}>
                  {t("massIntentionsAdmin.denyConfirm")}
                </button>
                <button type="button" style={btn()} onClick={() => setConfirmMode(null)}>
                  {t("massIntentionsAdmin.cancel")}
                </button>
              </div>
            </div>
          )}

          {/* Inline confirm: fulfill */}
          {confirmMode === "fulfill" && (
            <div style={confirmBoxStyle}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                {t("massIntentionsAdmin.fulfillTitle")}
              </div>
              <Field label={t("massIntentionsAdmin.fulfillDate")}>
                <input
                  type="date"
                  value={fulfillDate}
                  onChange={(e) => setFulfillDate(e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button type="button" style={btn("primary")} onClick={handleFulfill}>
                  {t("massIntentionsAdmin.fulfillConfirm")}
                </button>
                <button type="button" style={btn()} onClick={() => setConfirmMode(null)}>
                  {t("massIntentionsAdmin.cancel")}
                </button>
              </div>
            </div>
          )}

          {/* Primary actions */}
          {!confirmMode && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
              <button type="button" style={btn("primary")} onClick={handleApprove}>
                {t("massIntentionsAdmin.actionApprove")}
              </button>
              <button type="button" style={btn()} onClick={handleSaveChanges}>
                {t("massIntentionsAdmin.actionSave")}
              </button>
              {intention.status === "scheduled" && (
                <button type="button" style={btn()} onClick={() => setConfirmMode("fulfill")}>
                  {t("massIntentionsAdmin.actionFulfill")}
                </button>
              )}
              <button type="button" style={btn()} onClick={handleTransfer}>
                {t("massIntentionsAdmin.actionTransfer")}
              </button>
              <button type="button" style={btn("danger")} onClick={() => setConfirmMode("deny")}>
                {t("massIntentionsAdmin.actionDeny")}
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @media (max-width: 640px) {
          .mi-detail-grid { grid-template-columns: 1fr !important; }
          .mi-assign-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const sectionTitleStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  color: T.burgundy,
  marginBottom: 8,
  fontFamily: "'Source Sans 3', sans-serif",
};

const confirmBoxStyle = {
  marginTop: 16,
  padding: "16px 18px",
  background: T.cream,
  border: `1px solid ${T.stone}`,
  borderRadius: "var(--radius-control)",
};

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}
