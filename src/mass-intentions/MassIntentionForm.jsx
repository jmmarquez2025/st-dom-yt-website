import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Send, AlertCircle, Loader2 } from "lucide-react";
import { FloatingInput, FloatingTextarea, StyledSelect } from "../components/forms/Fields";
import { validateEmail, validatePhone } from "../utils/formValidation";
import { INTENTION_TYPES, MASS_PREFERENCES, withinAdvanceWindow, POLICY } from "../data/massIntentions";
import { RadioGroup, GroupHeading, cardStyle } from "./MassIntentionFields";
import MassIntentionSuccess from "./MassIntentionSuccess";

/* ── Date bounds for the optional "specific date" picker ── */
function isoFromOffsetMonths(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
const isoToday = () => isoFromOffsetMonths(0);
const isoMaxDate = () => isoFromOffsetMonths(POLICY.advanceWindowMonths);

const PERSON_NAME_MAX = 60;

const EMPTY_FORM = {
  personName: "",
  intentionType: "deceased",
  notes: "",
  requesterName: "",
  requesterEmail: "",
  requesterPhone: "",
  requesterAddress: "",
  datePref: "first-available", // "first-available" | "specific"
  requestedDate: "",
  requestedMassPref: "any",
  announcementPreference: "public",
  consent: false,
  company: "", // honeypot — real users never fill this
};

export default function MassIntentionForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const hasErrors = Object.keys(errors).length > 0;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setVal = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const fieldError = (field, f = form) => {
    const req = t("massIntentions.requiredError");
    switch (field) {
      case "personName":
        if (!f.personName.trim()) return req;
        if (f.personName.length > PERSON_NAME_MAX) return t("massIntentions.nameTooLong");
        return "";
      case "requesterName":
        return f.requesterName.trim() ? "" : req;
      case "requesterEmail":
        return f.requesterEmail.trim()
          ? validateEmail(f.requesterEmail, t("massIntentions.emailError"))
          : req;
      case "requesterPhone":
        return validatePhone(f.requesterPhone, t("massIntentions.phoneError"));
      case "requestedDate":
        if (f.datePref !== "specific") return "";
        if (!f.requestedDate) return req;
        return withinAdvanceWindow(f.requestedDate) ? "" : t("massIntentions.dateOutOfRange");
      case "consent":
        return f.consent ? "" : req;
      default:
        return "";
    }
  };

  const validateField = (field) => {
    const err = fieldError(field);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
    return err;
  };

  const validateAll = () => {
    const fields = [
      "personName",
      "requesterName",
      "requesterEmail",
      "requesterPhone",
      "requestedDate",
      "consent",
    ];
    const next = {};
    fields.forEach((field) => {
      const err = fieldError(field);
      if (err) next[field] = err;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus("idle");
    setStatusMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.company) return; // honeypot tripped — silently ignore bots
    if (!validateAll()) return;

    const payload = {
      formType: "massIntention",
      personName: form.personName.trim(),
      intentionType: form.intentionType,
      notes: form.notes.trim(),
      requesterName: form.requesterName.trim(),
      requesterEmail: form.requesterEmail.trim(),
      requesterPhone: form.requesterPhone.trim(),
      requesterAddress: form.requesterAddress.trim(),
      requestedDatePref:
        form.datePref === "specific" && form.requestedDate
          ? form.requestedDate
          : "first-available",
      requestedMassPref: form.requestedMassPref,
      announcementPreference: form.announcementPreference,
      timestamp: new Date().toISOString(),
    };

    // No backend configured → fall back to an email the office can act on.
    if (!CONFIG.massIntentionsUrl) {
      const body = [
        `Mass intention for: ${payload.personName} (${payload.intentionType})`,
        `Requested by: ${payload.requesterName}`,
        `Email: ${payload.requesterEmail}`,
        `Phone: ${payload.requesterPhone || "—"}`,
        `Address: ${payload.requesterAddress || "—"}`,
        `Preferred date: ${payload.requestedDatePref}`,
        `Preferred Mass: ${payload.requestedMassPref}`,
        `Announce: ${payload.announcementPreference}`,
        `Notes: ${payload.notes || "—"}`,
      ].join("\n");
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(
        "Mass Intention Request"
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    setStatusMessage("");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      // Raw Apps Script can't return CORS headers, so this is a fire-and-forget
      // no-cors POST (same approach as the Contact form's non-proxy path).
      await fetch(CONFIG.massIntentionsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setSubmittedName(payload.personName);
      setStatus("success");
      setStatusMessage(t("massIntentions.success"));
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err.name === "AbortError"
          ? t("massIntentions.timeoutError")
          : t("massIntentions.errorMessage")
      );
    }
  };

  if (status === "success") {
    return (
      <MassIntentionSuccess name={submittedName} message={statusMessage} onReset={resetForm} />
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontSize: 28,
            color: T.softBlack,
            marginBottom: 8,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
          }}
        >
          {t("massIntentions.formTitle")}
        </h2>
        <p style={{ fontSize: 15, color: T.warmGray, lineHeight: 1.7 }}>
          {t("massIntentions.formDesc")}
        </p>
      </div>

      <form onSubmit={handleSubmit} ref={formRef} noValidate>
        <div style={{ display: "grid", gap: 18 }}>
          {hasErrors && (
            <div
              role="alert"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-control)",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <AlertCircle size={18} />
              {t("massIntentions.errorSummary")}
            </div>
          )}

          {/* Honeypot — visually hidden, off-screen, not announced */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={form.company}
            onChange={set("company")}
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />

          {/* ── About the intention ── */}
          <GroupHeading>{t("massIntentions.sectionPerson")}</GroupHeading>
          <FloatingInput
            label={t("massIntentions.personName")}
            required
            value={form.personName}
            onChange={set("personName")}
            onBlurValidate={() => validateField("personName")}
            error={errors.personName}
            maxLength={PERSON_NAME_MAX}
            ariaDescribedBy={errors.personName ? "mi-personName-error" : undefined}
          />
          <StyledSelect
            label={t("massIntentions.intentionType")}
            value={form.intentionType}
            onChange={set("intentionType")}
          >
            {INTENTION_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </StyledSelect>
          <FloatingTextarea
            label={t("massIntentions.notes")}
            value={form.notes}
            onChange={set("notes")}
            rows={3}
            placeholder={t("massIntentions.notesHelper")}
          />

          {/* ── About you ── */}
          <GroupHeading>{t("massIntentions.sectionYou")}</GroupHeading>
          <FloatingInput
            label={t("massIntentions.requesterName")}
            required
            value={form.requesterName}
            onChange={set("requesterName")}
            onBlurValidate={() => validateField("requesterName")}
            error={errors.requesterName}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
            className="mi-two-col"
          >
            <FloatingInput
              label={t("massIntentions.requesterEmail")}
              required
              type="email"
              value={form.requesterEmail}
              onChange={set("requesterEmail")}
              onBlurValidate={() => validateField("requesterEmail")}
              error={errors.requesterEmail}
            />
            <FloatingInput
              label={t("massIntentions.requesterPhone")}
              type="tel"
              value={form.requesterPhone}
              onChange={set("requesterPhone")}
              onBlurValidate={() => validateField("requesterPhone")}
              error={errors.requesterPhone}
            />
          </div>
          <FloatingInput
            label={t("massIntentions.requesterAddress")}
            value={form.requesterAddress}
            onChange={set("requesterAddress")}
          />
          <p style={{ fontSize: 12.5, color: T.warmGray, lineHeight: 1.6, marginTop: -6 }}>
            {t("massIntentions.requesterAddressHelper")}
          </p>

          {/* ── Preferred date ── */}
          <GroupHeading>{t("massIntentions.sectionWhen")}</GroupHeading>
          <RadioGroup
            legend={t("massIntentions.datePref")}
            name="datePref"
            value={form.datePref}
            onChange={(v) => {
              setVal("datePref")(v);
              setErrors((prev) => {
                const next = { ...prev };
                delete next.requestedDate;
                return next;
              });
            }}
            options={[
              { value: "first-available", label: t("massIntentions.datePrefFirst") },
              { value: "specific", label: t("massIntentions.datePrefSpecific") },
            ]}
          />
          {form.datePref === "specific" && (
            <div>
              <FloatingInput
                label={t("massIntentions.dateInput")}
                required
                type="date"
                value={form.requestedDate}
                onChange={set("requestedDate")}
                onBlurValidate={() => validateField("requestedDate")}
                error={errors.requestedDate}
                min={isoToday()}
                max={isoMaxDate()}
              />
              <p style={{ fontSize: 12.5, color: T.warmGray, lineHeight: 1.6, marginTop: 6 }}>
                {t("massIntentions.dateHelper")}
              </p>
            </div>
          )}
          <StyledSelect
            label={t("massIntentions.massPref")}
            value={form.requestedMassPref}
            onChange={set("requestedMassPref")}
          >
            {MASS_PREFERENCES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </StyledSelect>

          {/* ── Announcement ── */}
          <GroupHeading>{t("massIntentions.sectionAnnounce")}</GroupHeading>
          <RadioGroup
            legend={t("massIntentions.announce")}
            name="announcementPreference"
            value={form.announcementPreference}
            onChange={setVal("announcementPreference")}
            options={[
              { value: "public", label: t("massIntentions.announcePublic") },
              { value: "private", label: t("massIntentions.announcePrivate") },
            ]}
          />

          {/* ── Offering ── */}
          <GroupHeading>{t("massIntentions.sectionOffering")}</GroupHeading>
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "var(--radius-control)",
              background: T.chipGoldBg,
              border: `1px solid ${T.stone}`,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: T.goldText,
                marginBottom: 6,
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              {t("massIntentions.offeringSuggested", {
                amount: CONFIG.massIntentionSuggestedOffering,
              })}
            </div>
            <p style={{ fontSize: 13.5, color: T.warmGray, lineHeight: 1.65, margin: 0 }}>
              {t("massIntentions.offeringHelper")}
            </p>
          </div>

          {/* ── Consent ── */}
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              fontSize: 14,
              color: T.softBlack,
              lineHeight: 1.6,
              fontFamily: "'Source Sans 3', sans-serif",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => {
                setForm((f) => ({ ...f, consent: e.target.checked }));
                if (e.target.checked)
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.consent;
                    return next;
                  });
              }}
              style={{ accentColor: T.burgundy, width: 18, height: 18, marginTop: 2 }}
              aria-invalid={!!errors.consent}
            />
            <span>{t("massIntentions.consentLabel")}</span>
          </label>
          {errors.consent && (
            <div style={{ fontSize: 12, color: T.error, marginTop: -10 }}>{errors.consent}</div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-hover"
            style={{
              background: status === "sending" ? T.warmGray : T.burgundy,
              color: T.cream,
              border: "none",
              padding: "16px 32px",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              borderRadius: "var(--radius-control)",
              cursor: status === "sending" ? "wait" : "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
              minHeight: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "all 0.3s ease",
              boxShadow: status === "sending" ? "none" : "0 4px 16px rgba(107,29,42,0.25)",
            }}
          >
            {status === "sending" ? (
              <>
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                {t("massIntentions.submitting")}
              </>
            ) : (
              <>
                <Send size={16} />
                {t("massIntentions.submit")}
              </>
            )}
          </button>

          {status === "error" && (
            <div
              aria-live="polite"
              role="status"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-control)",
                padding: "12px 16px",
              }}
            >
              <AlertCircle size={18} color="#dc2626" />
              <p style={{ color: "#dc2626", fontSize: 14, fontWeight: 500, margin: 0 }}>
                {statusMessage || t("massIntentions.error")}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
