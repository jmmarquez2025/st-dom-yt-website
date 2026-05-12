import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CROSS_FLORY } from "../constants/crossPaths";
import { FEAST_DAYS, DOMINICAN_SAINTS } from "../data/saints";

/**
 * Return today's saint entry (bilingual fields intact). For dates without a
 * named feast we rotate through the Dominican fallback list.
 */
function getSaint(now) {
  const key = `${now.getMonth() + 1}/${now.getDate()}`;
  if (FEAST_DAYS[key]) return { ...FEAST_DAYS[key], isFeast: true };

  // Rotate through Dominican saints for uncovered days
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const fallback = DOMINICAN_SAINTS[dayOfYear % DOMINICAN_SAINTS.length];
  return { ...fallback, isFeast: false };
}

function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function SaintOfTheDay() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("es") ? "es" : "en";
  const pick = (field) => field?.[lang] ?? field?.en ?? "";

  const { saint, dateStr, isoDate } = useMemo(() => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    const locale = lang === "es" ? "es-ES" : "en-US";
    return {
      saint: getSaint(now),
      dateStr: now.toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      isoDate: iso,
    };
  }, [lang]);

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${T.burgundyDark} 0%, ${T.burgundy} 100%)`,
        borderRadius: 12,
        padding: "clamp(32px, 5vw, 48px)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      {/* Ornamental Dominican Cross Flory watermark (arc-based Wikimedia path) */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", right: -10, top: -10, opacity: 0.06, width: 220, height: 220 }}
        viewBox={CROSS_FLORY.viewBox}
        fill="#fff"
      >
        <path d={CROSS_FLORY.d} />
      </svg>

      {/* Date pill */}
      <time
        dateTime={isoDate}
        style={{
          display: "inline-block",
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: T.goldLight,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        {dateStr}
      </time>

      {/* Eyebrow */}
      <div
        style={{
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        {t("saintOfDay.label")}
      </div>

      {/* Saint name */}
      <h2
        style={{
          fontSize: "clamp(26px, 4vw, 38px)",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 700,
          lineHeight: 1.15,
          color: "#fff",
          marginBottom: 8,
        }}
      >
        {pick(saint.name)}
      </h2>

      {/* Feast type badge */}
      <div
        style={{
          display: "inline-block",
          padding: "4px 14px",
          background: "rgba(255,255,255,0.12)",
          borderRadius: 20,
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: T.goldLight,
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        {pick(saint.feast)}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.82)",
        }}
      >
        {pick(saint.desc)}
      </p>
    </div>
  );
}
