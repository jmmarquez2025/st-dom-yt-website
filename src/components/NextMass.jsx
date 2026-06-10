import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { useSchedule } from "../cms/hooks";
import { getNextMassFromSchedule } from "../utils/schedule";

/**
 * NextMass — a quiet, functional line under the hero CTAs:
 *
 *   NEXT MASS — Sunday · 10:30 AM · in 13h 42m
 *
 * Replaces the former glassmorphism countdown panel (translucent fill +
 * backdrop blur + seconds ticker). Minute precision only, so the interval
 * runs at 30s and pauses entirely while the tab is hidden.
 */
function formatRelative(ms, t) {
  if (ms <= 0) return null;
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const d = t("home.nextMass.days").toLowerCase().charAt(0);
  const h = t("home.nextMass.hours").toLowerCase().charAt(0);
  const m = t("home.nextMass.min").toLowerCase().charAt(0);
  if (days > 0) return `${days}${d} ${hours}${h}`;
  if (hours > 0) return `${hours}${h} ${minutes}${m}`;
  return `${minutes}${m}`;
}

export default function NextMass() {
  const { t } = useTranslation();
  const { data: schedule } = useSchedule();
  const scheduleKey = JSON.stringify(schedule);
  const [next, setNext] = useState(() => getNextMassFromSchedule(schedule));

  useEffect(() => {
    const activeSchedule = JSON.parse(scheduleKey);
    const update = () => setNext(getNextMassFromSchedule(activeSchedule));

    // Tick only while the tab is visible — a hidden tab doesn't need a live countdown.
    let tick = null;
    const start = () => {
      if (tick) return;
      update();
      tick = setInterval(update, 30000);
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

  if (!next) return null;

  const dayLabel = t(`schedule.${next.label}`);
  const relative = formatRelative(next.date - Date.now(), t);

  return (
    <p className="premium-hero__nextline u-onum">
      <span className="u-smallcaps" style={{ color: T.goldLight, fontWeight: 600 }}>
        {t("home.nextMass.label")}
      </span>
      <span aria-hidden="true"> — </span>
      {dayLabel} · {next.timeStr}
      {relative && (
        <span style={{ color: "rgba(255,255,255,0.62)" }}>
          {" "}
          · {t("home.nextMass.in")} {relative}
        </span>
      )}
    </p>
  );
}
