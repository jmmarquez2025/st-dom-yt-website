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
  overlay = 0.52,
  tint = "rgba(74,16,25,0.64)",
  tall = false,
}) {
  const location = useLocation();
  const sacramentMatch = location.pathname.match(/^\/sacraments\/(\w+)$/);
  const vtName = sacramentMatch ? `sacrament-${sacramentMatch[1]}` : undefined;
  return (
    <div
      className={`premium-page-header${tall ? " premium-page-header--tall" : ""}`}
      style={{
        ...(vtName ? { viewTransitionName: vtName } : {}),
      }}
    >
      <HeroImage
        src={heroSrc || PHOTOS.pageHeader}
        overlay={overlay}
        tint={tint}
      />
      <div className="premium-page-header__content">
        <h1>{title}</h1>
        <div aria-hidden="true" />
      </div>
    </div>
  );
}
