import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { Loader2, RefreshCw, FileText, ClipboardList, Inbox } from "lucide-react";
import {
  fetchAll,
  update,
  getCached,
  isConfigured,
} from "./store";
import {
  filterByStatus,
  isOverdue,
  toBulletinCsv,
  toAuditCsv,
} from "../data/massIntentions";
import { isoToday } from "./format";
import IntentionListRow from "./IntentionListRow";
import IntentionDetailPanel from "./IntentionDetailPanel";
import { sundayMass, dailyMass } from "../data/schedule";
import { friars as fallbackFriars, staff as fallbackStaff } from "../data/staff";
import { getMerged as getStaffMerged } from "../staff-admin/store";

const FILTERS = ["pending", "active", "scheduled", "fulfilled", "overdue", "all"];

function download(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function uniqueTimes() {
  const out = [];
  [...sundayMass, ...dailyMass].forEach(([, time]) => {
    time
      .split(",")
      .map((s) => s.trim())
      .forEach((tm) => {
        if (tm && !out.includes(tm)) out.push(tm);
      });
  });
  return out;
}

function SummaryBadge({ label, value, tone }) {
  const tones = {
    pending: { bg: "#f3f4f6", color: "#374151" },
    scheduled: { bg: "#e8f0fe", color: "#1a56db" },
    fulfilled: { bg: "#e6f9ee", color: "#1a7d42" },
    overdue: { bg: "#fef2f2", color: "#b91c1c" },
  };
  const c = tones[tone] || tones.pending;
  return (
    <div
      style={{
        background: c.bg,
        borderRadius: "var(--radius-card)",
        padding: "12px 16px",
        minWidth: 110,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700, color: c.color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: T.warmGray, marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function MassIntentionsDashboard({ onToast }) {
  const { t } = useTranslation();
  const [list, setList] = useState(() => getCached());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState(false);

  const celebrants = useMemo(
    () =>
      getStaffMerged(fallbackFriars, fallbackStaff).friars.map((f) => ({
        id: f.id,
        name: f.name,
      })),
    []
  );
  const times = useMemo(uniqueTimes, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAll();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "load failed");
      setList(getCached());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const month = isoToday().slice(0, 7);
    return {
      pending: list.filter((i) => i.status === "pending").length,
      scheduled: list.filter((i) => i.status === "scheduled").length,
      fulfilled: list.filter(
        (i) => i.status === "fulfilled" && (i.fulfillmentDate || "").slice(0, 7) === month
      ).length,
      overdue: list.filter((i) => isOverdue(i)).length,
    };
  }, [list]);

  const filtered = useMemo(() => {
    const arr = filterByStatus(list, filter);
    return [...arr].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }, [list, filter]);

  const selected = useMemo(
    () => list.find((i) => i.id === selectedId) || null,
    [list, selectedId]
  );

  const handleSave = useCallback(
    async (patch) => {
      if (!selectedId) return;
      setBusy(true);
      try {
        const next = await update(selectedId, patch);
        setList(next);
        setSelectedId(null);
        const key =
          patch.status === "fulfilled"
            ? "toastFulfilled"
            : patch.status === "rejected"
            ? "toastDenied"
            : patch.status === "transferred"
            ? "toastTransferred"
            : "toastSaved";
        onToast?.({ message: t(`massIntentionsAdmin.${key}`), type: "success" });
      } catch (e) {
        onToast?.({ message: e.message || t("massIntentionsAdmin.toastError"), type: "error" });
      } finally {
        setBusy(false);
      }
    },
    [selectedId, onToast, t]
  );

  const chipStyle = (active) => ({
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    borderRadius: 999,
    border: `1px solid ${active ? T.burgundy : T.stone}`,
    background: active ? T.burgundy : "#fff",
    color: active ? T.cream : T.charcoal,
    cursor: "pointer",
    fontFamily: "'Source Sans 3', sans-serif",
  });

  if (selected) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 8px" }}>
        {busy && (
          <div style={{ textAlign: "center", color: T.warmGray, marginBottom: 8, fontSize: 13 }}>
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite", verticalAlign: "middle" }} />
          </div>
        )}
        <IntentionDetailPanel
          intention={selected}
          celebrants={celebrants}
          times={times}
          onSave={handleSave}
          onClose={() => setSelectedId(null)}
          t={t}
        />
        <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 8px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 26,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              color: T.softBlack,
              marginBottom: 4,
            }}
          >
            {t("massIntentionsAdmin.title")}
          </h2>
          <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.5 }}>
            {t("massIntentionsAdmin.intro")}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={load} style={toolBtn} aria-label={t("massIntentionsAdmin.refresh")}>
            <RefreshCw size={14} />
            {t("massIntentionsAdmin.refresh")}
          </button>
          <button
            type="button"
            onClick={() => download(`mass-intentions-bulletin-${isoToday()}.csv`, toBulletinCsv(list))}
            style={toolBtn}
          >
            <FileText size={14} />
            {t("massIntentionsAdmin.exportBulletin")}
          </button>
          <button
            type="button"
            onClick={() => download(`mass-intentions-register-${isoToday()}.csv`, toAuditCsv(list))}
            style={toolBtn}
          >
            <ClipboardList size={14} />
            {t("massIntentionsAdmin.exportAudit")}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <SummaryBadge label={t("massIntentionsAdmin.summaryPending")} value={counts.pending} tone="pending" />
        <SummaryBadge label={t("massIntentionsAdmin.summaryScheduled")} value={counts.scheduled} tone="scheduled" />
        <SummaryBadge label={t("massIntentionsAdmin.summaryFulfilled")} value={counts.fulfilled} tone="fulfilled" />
        <SummaryBadge label={t("massIntentionsAdmin.summaryOverdue")} value={counts.overdue} tone="overdue" />
      </div>

      {!isConfigured() && (
        <div
          style={{
            padding: "10px 14px",
            background: T.chipGoldBg,
            border: `1px solid ${T.stone}`,
            borderRadius: "var(--radius-control)",
            color: T.goldText,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {t("massIntentionsAdmin.backendNote")}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} style={chipStyle(filter === f)}>
            {t(`massIntentionsAdmin.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
          </button>
        ))}
      </div>

      {/* A failed refresh still shows cached rows — only block the whole view
          when there is nothing cached to fall back to. */}
      {error && list.length > 0 && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius-control)",
            color: "#b91c1c",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {t("massIntentionsAdmin.loadError")}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: T.warmGray }}>
          <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
          <div style={{ marginTop: 8, fontSize: 14 }}>{t("massIntentionsAdmin.loading")}</div>
        </div>
      ) : error && list.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "28px 0",
            color: "#b91c1c",
            fontSize: 14,
          }}
        >
          {t("massIntentionsAdmin.loadError")}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: T.warmGray }}>
          <Inbox size={26} />
          <div style={{ marginTop: 8, fontSize: 14 }}>{t("massIntentionsAdmin.empty")}</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((intention) => (
            <IntentionListRow
              key={intention.id}
              intention={intention}
              onSelect={setSelectedId}
              t={t}
            />
          ))}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const toolBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 600,
  borderRadius: "var(--radius-control)",
  border: `1px solid ${T.stone}`,
  background: "#fff",
  color: T.charcoal,
  cursor: "pointer",
  fontFamily: "'Source Sans 3', sans-serif",
};
