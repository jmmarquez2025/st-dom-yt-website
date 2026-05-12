import { useHref, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";

function FooterLink({ to, children, style }) {
  const navigate = useNavigate();
  const href = useHref(to);
  const handleClick = (e) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }
    e.preventDefault();
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(to));
    } else {
      navigate(to);
    }
  };
  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  );
}

const FOOTER_LINKS = [
  { to: "/mass-times", key: "massTimes" },
  { to: "/sacraments", key: "sacraments" },
  { to: "/about", key: "about" },
  { to: "/history", key: "history" },
  { to: "/architecture", key: "architecture" },
  { to: "/staff", key: "staff" },
  { to: "/bulletin", key: "bulletin" },
  { to: "/becoming-catholic", key: "becomingCatholic" },
  { to: "/get-involved", key: "getInvolved" },
  { to: "/register", key: "register" },
  { to: "/blog", key: "blog" },
  { to: "/faith-formation", key: "faithFormation" },
  { to: "/events", key: "events" },
  { to: "/connect", key: "connect" },
  { to: "/contact", key: "contact" },
  { to: "/give", key: "give" },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{ background: T.softBlack, color: "rgba(255,255,255,0.7)", padding: "60px 24px 36px" }}>
      <div
        style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40,
        }}
      >
        {/* About column */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: T.gold, marginBottom: 12 }}>
            St. Dominic
          </div>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, color: "rgba(255,255,255,0.7)" }}>
            {t("footer.subtitle")}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8 }}>{t("footer.description")}</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 style={{ color: T.goldLight, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            {t("footer.quickLinks")}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            {FOOTER_LINKS.map((l) => (
              <div key={l.to}>
                <FooterLink
                  to={l.to}
                  style={{
                    display: "inline-block",
                    color: "rgba(255,255,255,0.7)", textDecoration: "none",
                    fontSize: 14, padding: "6px 0",
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}
                >
                  {t(`nav.${l.key}`)}
                </FooterLink>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ color: T.goldLight, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            {t("footer.contactTitle")}
          </h3>
          <p style={{ fontSize: 14, lineHeight: 2 }}>
            {CONFIG.address}
            <br />
            {CONFIG.city}, {CONFIG.state} {CONFIG.zip}
            <br />
            <a href={CONFIG.phoneLink} className="contact-link">{CONFIG.phone}</a>
            <br />
            <a href={`mailto:${CONFIG.email}`} className="contact-link">{CONFIG.email}</a>
          </p>
          <p style={{ fontSize: 13, marginTop: 8, color: "rgba(255,255,255,0.7)" }}>
            {t("footer.officeHours")}: {CONFIG.officeHours}
          </p>
        </div>
      </div>

      {/* ── Provincial affiliation ── */}
      <div
        style={{
          maxWidth: 1100, margin: "40px auto 0", paddingTop: 32,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 20, flexWrap: "wrap",
        }}
      >
        <a
          href={CONFIG.provinceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 16,
            textDecoration: "none", color: "rgba(255,255,255,0.7)",
            transition: "opacity 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
        >
          <img
            src={PHOTOS.psjShield}
            alt="Dominican Province of St. Joseph Shield"
            style={{ width: 48, height: 48, objectFit: "contain" }}
          />
          <img
            src={PHOTOS.psjWordmarkWhite}
            alt="Dominican Friars — Province of Saint Joseph"
            style={{ height: 32, objectFit: "contain", opacity: 0.85 }}
          />
        </a>
      </div>

      <div
        style={{
          maxWidth: 1100, margin: "20px auto 0", paddingTop: 16,
          textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.55)",
        }}
      >
        © {new Date().getFullYear()} St. Dominic Catholic Church · Youngstown, OH · {t("footer.rights")}
        <span style={{ margin: "0 6px" }}>·</span>
        <FooterLink
          to="/writers-guide"
          style={{
            color: "rgba(255,255,255,0.85)",
            textDecoration: "underline",
            fontSize: 12,
            transition: "color 0.2s",
          }}
        >
          Staff
        </FooterLink>
      </div>
    </footer>
  );
}
