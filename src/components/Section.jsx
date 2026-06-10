import { T } from "../constants/theme";

const WIDTHS = { narrow: 800, default: 1140, wide: 1320 };

export function Section({ children, bg = T.warmWhite, style: s = {}, id, width = "default" }) {
  return (
    <section
      id={id}
      className="cv-section"
      style={{ padding: "clamp(48px, 10vw, 80px) 24px", background: bg, ...s }}
    >
      <div style={{ maxWidth: WIDTHS[width] || WIDTHS.default, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

/**
 * Section heading, editorial anatomy: a run-in kicker (hairline rule +
 * small caps) over a left-set serif title. Left-aligned by default — pass
 * `center` only for a deliberately ceremonial moment (at most one per page).
 * `index` renders an oldstyle section number before the kicker ("01 · …")
 * for long, numbered pages. The old centered gold divider bar is gone; the
 * `divider` prop is accepted for call-site compatibility and ignored.
 */
export function SectionTitle({ children, sub, light, center = false, index }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 36 }}>
      {sub && (
        <div
          className={`kicker${light ? " kicker--light" : ""}${index ? " kicker--index" : ""}`}
          style={center ? { justifyContent: "center" } : undefined}
        >
          {index && (
            <span className="kicker__num" aria-hidden="true">
              {index}
            </span>
          )}
          {sub}
        </div>
      )}
      <h2
        style={{
          marginTop: sub ? 10 : 0,
          fontSize: "clamp(28px, 4.5vw, 40px)",
          color: light ? "#fff" : T.softBlack,
          fontWeight: 600,
          letterSpacing: "var(--tracking-display)",
          textWrap: "balance",
        }}
      >
        {children}
      </h2>
    </div>
  );
}
