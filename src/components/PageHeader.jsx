import { useLocation } from "react-router-dom";
import { T } from "../constants/theme";
import HeroImage from "./HeroImage";
import { PHOTOS } from "../constants/photos";

/**
 * PageHeader — page title banner with background image.
 *
 * Props:
 *   title     — heading text
 *   heroSrc   — optional custom hero image (falls back to PHOTOS.pageHeader)
 *   overlay   — dark overlay opacity (default 0.45)
 *   tint      — overlay tint color (default burgundy)
 *   tall      — if true, uses taller padding for more dramatic headers
 */
export default function PageHeader({
  title,
  heroSrc,
  overlay = 0.45,
  tint = "rgba(107,29,42,0.5)",
  tall = false,
}) {
  const location = useLocation();
  const sacramentMatch = location.pathname.match(/^\/sacraments\/(\w+)$/);
  const vtName = sacramentMatch ? `sacrament-${sacramentMatch[1]}` : undefined;
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: T.burgundy,
        padding: tall ? "90px 24px" : "60px 24px",
        textAlign: "center",
        ...(vtName ? { viewTransitionName: vtName } : {}),
      }}
    >
      <HeroImage
        src={heroSrc || PHOTOS.pageHeader}
        overlay={overlay}
        tint={tint}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            color: "#fff",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {title}
        </h1>
        <div style={{ width: 48, height: 2, background: T.gold, margin: "14px auto 0" }} />
      </div>
    </div>
  );
}
