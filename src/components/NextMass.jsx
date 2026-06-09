import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { useSchedule } from "../cms/hooks";
import { getNextMassFromSchedule } from "../utils/schedule";

function formatCountdown(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const digitStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 56,
};
const numStyle = {
  fontSize: "clamp(28px, 5vw, 40px)",
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 700,
  lineHeight: 1,
  color: "#fff",
};
const unitStyle = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: T.goldLight,
  marginTop: 4,
};
const separatorStyle = {
  fontSize: "clamp(24px, 4vw, 36px)",
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 300,
  color: "rgba(255,255,255,0.3)",
  alignSelf: "flex-start",
  paddingTop: 2,
};

export default function NextMass() {
  const { t } = useTranslation();
  const { data: schedule } = useSchedule();
  const scheduleKey = JSON.stringify(schedule);
  const [next, setNext] = useState(() => getNextMassFromSchedule(schedule));
  const [countdown, setCountdown] = useState(() =>
    next ? formatCountdown(next.date - Date.now()) : null
  );

  useEffect(() => {
    const activeSchedule = JSON.parse(scheduleKey);
    const update = () => {
      const mass = getNextMassFromSchedule(activeSchedule);
      setNext(mass);
      if (mass) {
        setCountdown(formatCountdown(mass.date - Date.now()));
      } else {
        setCountdown(null);
      }
    };

    // Tick only while the tab is visible — a hidden tab doesn't need a live countdown.
    let tick = null;
    const start = () => {
      if (tick) return;
      update();
      tick = setInterval(update, 1000);
    };
    const stop = () => {
      if (tick) {
        clearInterval(tick);
        tick = null;
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scheduleKey]);

  if (!next || !countdown) return null;

  const dayLabel = t(`schedule.${next.label}`);

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "24px 32px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: T.goldLight,
          fontWeight: 600,
        }}
      >
        {t("home.nextMass.label")}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {countdown.days > 0 && (
          <>
            <div style={digitStyle}>
              <span style={numStyle}>{String(countdown.days).padStart(2, "0")}</span>
              <span style={unitStyle}>{t("home.nextMass.days")}</span>
            </div>
            <span style={separatorStyle}>:</span>
          </>
        )}
        <div style={digitStyle}>
          <span style={numStyle}>{String(countdown.hours).padStart(2, "0")}</span>
          <span style={unitStyle}>{t("home.nextMass.hours")}</span>
        </div>
        <span style={separatorStyle}>:</span>
        <div style={digitStyle}>
          <span style={numStyle}>{String(countdown.minutes).padStart(2, "0")}</span>
          <span style={unitStyle}>{t("home.nextMass.min")}</span>
        </div>
        <span style={separatorStyle}>:</span>
        <div style={digitStyle}>
          <span style={numStyle}>{String(countdown.seconds).padStart(2, "0")}</span>
          <span style={unitStyle}>{t("home.nextMass.sec")}</span>
        </div>
      </div>

      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
        {dayLabel} · {next.timeStr}
      </div>
    </div>
  );
}
