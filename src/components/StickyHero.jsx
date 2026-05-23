import { useEffect, useRef, useState, useCallback } from "react";
import { T } from "../constants/theme";
import ResponsivePicture from "./ResponsivePicture";

/**
 * StickyHero — Apple-style hero that stays pinned while content scrolls.
 *
 * The hero text fades out and the background subtly zooms as the user scrolls
 * past the section. The next section then scrolls over the hero naturally.
 *
 * Props:
 *   image     — background image URL
 *   overlay   — dark overlay opacity (default 0.5)
 *   tint      — optional CSS color tint
 *   height    — total scroll runway (default "180vh")
 *   showScrollHint — whether to show the small scroll cue
 *   children  — hero content (title, subtitle, etc.)
 */
export default function StickyHero({
  image,
  overlay = 0.5,
  tint,
  height = "130vh",
  viewportHeight = "100vh",
  showScrollHint = true,
  children,
}) {
  const wrapperRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const handleScroll = useCallback(() => {
    if (reducedMotion) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = el.offsetHeight;
    const scrollRange = h - window.innerHeight;
    if (scrollRange <= 0) {
      setProgress(0);
      return;
    }
    const p = Math.min(1, Math.max(0, -rect.top / scrollRange));
    setProgress(p);
  }, [reducedMotion]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Derived values (static when reduced motion is on)
  const textOpacity = reducedMotion ? 1 : Math.max(0, 1 - progress * 2.5);
  const textY = reducedMotion ? 0 : progress * -40;
  const bgScale = reducedMotion ? 1 : 1 + progress * 0.1;

  return (
    <div ref={wrapperRef} style={{ height, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: viewportHeight,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background with zoom */}
        {image && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              transform: reducedMotion ? "none" : `scale(${bgScale})`,
              opacity: loaded ? 1 : 0,
              transition: loaded ? "none" : "opacity 0.8s ease",
              willChange: "transform",
            }}
          >
            <ResponsivePicture
              src={image}
              widths={[480, 1024, 1920]}
              sizes="100vw"
              alt=""
              loading="eager"
              fetchPriority="high"
              onLoad={() => setLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        {/* Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: tint
              ? `linear-gradient(160deg, ${tint}, rgba(0,0,0,${overlay}))`
              : `rgba(0,0,0,${overlay})`,
            opacity: loaded ? 1 : 0,
            transition: loaded ? "none" : "opacity 0.8s ease",
          }}
        />

        {/* Content with fade-out + lift */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "0 24px",
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            willChange: "transform, opacity",
          }}
        >
          {children}
        </div>

        {/* Scroll indicator */}
        {showScrollHint && progress < 0.2 && (
          <div
            aria-hidden="true"
            className="scroll-hint"
            style={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              opacity: 1 - progress * 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 500,
              }}
            >
              Scroll
            </div>
            <div
              style={{
                width: 1,
                height: 28,
                background: "linear-gradient(rgba(255,255,255,0.5), transparent)",
                animation: "scrollPulse 2s ease infinite",
              }}
            />
            <style>{`@keyframes scrollPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
          </div>
        )}

        {/* Bottom gradient for seamless transition */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: `linear-gradient(transparent, ${T.warmWhite})`,
            opacity: progress > 0.3 ? Math.min(1, (progress - 0.3) * 3) : 0,
          }}
        />
      </div>
    </div>
  );
}
