import { useEffect, useState } from "react";
import useScrollProgress from "../hooks/useScrollProgress";
import { T } from "../constants/theme";

/**
 * A vertical timeline line that "fills" with gold color as the user scrolls.
 * Wraps its children and overlays the animated line on the left side.
 */
export default function ScrollTimeline({ children }) {
  const { ref, progress } = useScrollProgress({ offset: 0.9 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const fill = reducedMotion ? 1 : progress;

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {/* Background track */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 28,
          top: 40,
          bottom: 40,
          width: 2,
          background: T.stone,
        }}
      />
      {/* Animated fill */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 28,
          top: 40,
          bottom: 40,
          width: 2,
          background: `linear-gradient(to bottom, ${T.burgundy}, ${T.gold})`,
          transformOrigin: "top",
          transform: `scaleY(${fill})`,
          transition: "transform 0.05s linear",
          willChange: "transform",
        }}
      />
      {children}
    </div>
  );
}
