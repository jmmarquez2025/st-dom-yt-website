import { T } from "../constants/theme";

export function Section({ children, bg = T.warmWhite, style: s = {}, id }) {
  return (
    <section
      id={id}
      className="cv-section"
      style={{ padding: "clamp(48px, 10vw, 80px) 24px", background: bg, ...s }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

export function SectionTitle({ children, sub, light, center = true, divider = true }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 40 }}>
      {sub && (
        <div
          style={{
            fontSize: 12,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: light ? T.goldLight : T.goldText,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {sub}
        </div>
      )}
      <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", color: light ? "#fff" : T.softBlack, fontWeight: 600 }}>
        {children}
      </h2>
      {divider && (
        <div
          className="gold-divider"
          style={{
            width: 48,
            height: 2,
            background: T.gold,
            margin: center ? "14px auto 0" : "14px 0 0",
            borderRadius: 1,
          }}
        />
      )}
    </div>
  );
}
