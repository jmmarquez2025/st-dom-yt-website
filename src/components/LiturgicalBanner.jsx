import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLiturgicalSeason } from "../utils/liturgical";

/**
 * Thin liturgical-season indicator strip.
 * Shows the current season with its liturgical color.
 */
export default function LiturgicalBanner() {
  const { t } = useTranslation();
  const season = getLiturgicalSeason();
  const gradient = `linear-gradient(90deg, ${season.color}, ${season.accent})`;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = prefersReducedMotion ? 0 : 600;

  const prevGradientRef = useRef(gradient);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    if (prevGradientRef.current === gradient) return;
    setFadeKey((n) => n + 1);
    const id = window.setTimeout(() => {
      prevGradientRef.current = gradient;
    }, duration);
    return () => window.clearTimeout(id);
  }, [gradient, duration]);

  const previousGradient = prevGradientRef.current;

  return (
    <div
      style={{
        position: "relative",
        color: "#fff",
        textAlign: "center",
        padding: "6px 16px",
        fontSize: 11,
        letterSpacing: 3,
        textTransform: "uppercase",
        fontWeight: 600,
        background: previousGradient,
        overflow: "hidden",
      }}
    >
      <div
        key={fadeKey}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: gradient,
          opacity: previousGradient === gradient ? 1 : 0,
          animation:
            previousGradient === gradient
              ? "none"
              : `liturgical-fade-in ${duration}ms var(--ease-out-expo, ease) forwards`,
        }}
      />
      <span style={{ position: "relative" }}>
        {t(`home.liturgical.${season.key}`)}
      </span>
      <style>{`@keyframes liturgical-fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
