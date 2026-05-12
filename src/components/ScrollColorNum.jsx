import { useEffect, useRef, useState } from "react";

/**
 * Interpolate between two hex colors.
 */
function lerpColor(a, b, t) {
  const ah = parseInt(a.replace("#", ""), 16);
  const bh = parseInt(b.replace("#", ""), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${((rr << 16) | (rg << 8) | rb).toString(16).padStart(6, "0")}`;
}

/**
 * A text/number element that smoothly transitions color as it scrolls
 * from entering the viewport to its "focal point" position.
 *
 * @param {string} colorFrom - Starting hex color (when entering viewport)
 * @param {string} colorTo   - Ending hex color (when in focal position)
 * @param {number} scaleFrom - Starting scale (default 0.9)
 * @param {number} scaleTo   - Ending scale (default 1.0)
 */
export default function ScrollColorNum({
  children,
  as: Tag = "span",
  colorFrom = "#6B6560",
  colorTo = "#C5A55A",
  scaleFrom = 0.92,
  scaleTo = 1.0,
  style = {},
  className = "",
}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    function update() {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Element enters at bottom 85%, reaches full at 40%
      const start = windowH * 0.85;
      const end = windowH * 0.4;
      const range = start - end;
      const current = start - rect.top;
      setProgress(Math.min(1, Math.max(0, current / range)));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [reducedMotion]);

  const color = reducedMotion ? colorTo : lerpColor(colorFrom, colorTo, progress);
  const scale = reducedMotion ? scaleTo : scaleFrom + (scaleTo - scaleFrom) * progress;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        color,
        transform: `scale(${scale})`,
        transition: "transform 0.1s ease",
        willChange: "color, transform",
      }}
    >
      {children}
    </Tag>
  );
}
