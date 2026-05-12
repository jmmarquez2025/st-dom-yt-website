import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Section, SectionTitle } from "../components/Section";
import FadeSection from "../components/FadeSection";
import Btn from "../components/Btn";

import { useAnnouncements, useEvents, useSchedule } from "../cms/hooks";
import Seo from "../components/Seo";
import NextMass from "../components/NextMass";
import CountUp from "../components/CountUp";
import DailyQuote from "../components/DailyQuote";
import LiturgicalBanner from "../components/LiturgicalBanner";
import VaticanNews from "../components/VaticanNews";
import YouTubeChannel from "../components/YouTubeChannel";
import Icon from "../components/Icon";
import HeroImage from "../components/HeroImage";
import StickyHero from "../components/StickyHero";
import ParallaxSection from "../components/ParallaxSection";
import TextReveal from "../components/TextReveal";
import { AnimatedDivider } from "../components/TextReveal";
import { PHOTOS } from "../constants/photos";

const WEEKDAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function rowsForToday(rows = [], todayKey) {
  return rows.filter(([key]) => {
    if (key === todayKey) return true;
    if (todayKey === "sunday" && key === "sundayEspanol") return true;
    if (todayKey === "saturday" && key === "saturdayVigil") return true;
    return false;
  });
}

function joinTimes(rows) {
  return rows.map(([, time]) => time).filter(Boolean).join(" · ");
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: announcements } = useAnnouncements();
  const { data: events } = useEvents();
  const { data: schedule } = useSchedule();
  const todayKey = WEEKDAY_KEYS[new Date().getDay()];
  const todayMasses = joinTimes([
    ...rowsForToday(schedule?.dailyMass, todayKey),
    ...rowsForToday(schedule?.sundayMass, todayKey),
  ]);
  const todayConfessions = joinTimes(rowsForToday(schedule?.confession, todayKey));
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${CONFIG.mapsQuery}`;

  return (
    <div>
      <Seo description="St. Dominic Catholic Church in Youngstown, Ohio. Served by the Dominican Friars since 1923. Mass times, sacraments, and community life." image={PHOTOS.homeHero} />

      {/* ═══ Liturgical Season Strip ═══ */}
      <LiturgicalBanner />

      {/* ════ Hero — Apple-style Sticky with Scroll Fade ════ */}
      <StickyHero
        image={PHOTOS.homeHero}
        overlay={0.5}
        tint="rgba(107,29,42,0.6)"
        height="calc(100vh - 120px)"
        viewportHeight="calc(100vh - 120px)"
      >
        <div
          className="home-hero-subtitle"
          style={{
            fontSize: 12,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: T.goldLight,
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          {t("home.hero.subtitle")}
        </div>

        <h1
          className="home-hero-title"
          style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 12,
            color: "#fff",
          }}
        >
          {t("home.hero.title")}
        </h1>

        <div
          className="home-hero-location"
          style={{
            fontSize: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: T.goldLight,
            marginBottom: 40,
          }}
        >
          {t("home.hero.location")}
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="gold" onClick={() => navigate("/visit")}>
            {t("home.hero.ctaVisit")}
          </Btn>
          <Btn variant="light" onClick={() => navigate("/mass-times")}>
            {t("home.hero.ctaMass")}
          </Btn>
        </div>

        {/* ── Bilingual invite ── */}
        {i18n.language !== "es" && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => { i18n.changeLanguage("es"); localStorage.setItem("lang", "es"); }}
              style={{
                background: "rgba(197,165,90,0.12)",
                border: "1px solid rgba(197,165,90,0.45)",
                borderRadius: 3,
                color: T.goldLight,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'Source Sans 3', sans-serif",
                letterSpacing: 0.6,
                padding: "7px 16px",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(197,165,90,0.22)"; e.currentTarget.style.borderColor = "rgba(197,165,90,0.75)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(197,165,90,0.12)"; e.currentTarget.style.borderColor = "rgba(197,165,90,0.45)"; }}
            >
              🌐 &nbsp;También disponible en Español
            </button>
          </div>
        )}

        <div className="home-hero-next-mass" style={{ marginTop: 32 }}>
          <NextMass />
        </div>
      </StickyHero>

      {/* ════ Parish Essentials ════ */}
      <section
        style={{
          background: T.warmWhite,
          borderBottom: `1px solid ${T.stone}`,
          padding: "clamp(28px, 5vw, 48px) 24px",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 22,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: T.goldText,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {t("home.essentials.sub")}
              </div>
              <h2
                style={{
                  fontSize: "clamp(24px, 4vw, 34px)",
                  fontFamily: "'Cormorant Garamond', serif",
                  color: T.softBlack,
                  fontWeight: 600,
                }}
              >
                {t("home.essentials.title")}
              </h2>
            </div>
            <div style={{ fontSize: 13, color: T.warmGray }}>
              {t("home.essentials.reviewed")}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                icon: "Church",
                label: t("home.essentials.today"),
                value: todayMasses || t("home.essentials.noMassToday"),
                onClick: () => navigate("/mass-times"),
              },
              {
                icon: "Cross",
                label: t("home.essentials.confession"),
                value: todayConfessions || t("home.essentials.noConfessionToday"),
                onClick: () => navigate("/mass-times"),
              },
              {
                icon: "MapPin",
                label: t("home.essentials.directions"),
                value: t("home.essentials.directionsDesc"),
                href: mapsHref,
              },
              {
                icon: "Newspaper",
                label: t("home.essentials.bulletin"),
                value: t("home.essentials.bulletinDesc"),
                onClick: () => navigate("/bulletin"),
              },
              {
                icon: "Phone",
                label: t("home.essentials.contact"),
                value: CONFIG.phone,
                href: CONFIG.phoneLink,
              },
            ].map((item) => {
              const content = (
                <>
                  <Icon name={item.icon} size={22} color={T.burgundy} />
                  <span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 11,
                        letterSpacing: 1.7,
                        textTransform: "uppercase",
                        color: T.goldText,
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: 15,
                        lineHeight: 1.45,
                        color: T.softBlack,
                        fontWeight: 600,
                      }}
                    >
                      {item.value}
                    </span>
                  </span>
                </>
              );
              const sharedStyle = {
                minHeight: 108,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "18px 18px",
                background: "#fff",
                border: `1px solid ${T.stone}`,
                borderRadius: 8,
                textDecoration: "none",
                textAlign: "left",
                boxShadow: "0 2px 10px rgba(0,0,0,0.035)",
                cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif",
              };
              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="hover-lift-sm"
                    style={sharedStyle}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="hover-lift-sm"
                  style={sharedStyle}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ Church Stats Band ════ */}
      <section
        style={{
          background: T.softBlack,
          color: "#fff",
          padding: "0",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {[
            { end: 100, suffix: "+", labelKey: "home.stats.years" },
            { end: 4, suffix: "", labelKey: "home.stats.masses" },
            { end: 12, suffix: "", labelKey: "home.stats.ministries" },
            { end: 2, suffix: "", labelKey: "home.stats.languages" },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <div
                style={{
                  fontSize: "clamp(32px, 5vw, 48px)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 700,
                  color: T.gold,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                <CountUp end={stat.end} suffix={stat.suffix} duration={2000 + i * 300} />
              </div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ Welcome ════ */}
      <Section>
        <FadeSection>
          <SectionTitle sub={t("home.welcome.sub")}>{t("home.welcome.title")}</SectionTitle>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: T.warmGray, marginBottom: 20 }}>
              {t("home.welcome.p1")}
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: T.warmGray, marginBottom: 32 }}>
              {t("home.welcome.p2")}
            </p>
            <Btn variant="primary" onClick={() => navigate("/about")}>
              {t("home.welcome.cta")}
            </Btn>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Daily Quote ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <DailyQuote />
        </FadeSection>
      </Section>

      {/* ════ Mass CTA ════ */}
      <Section>
        <FadeSection>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* left text */}
            <div>
              <SectionTitle sub={t("home.massCta.sub")} center={false} divider={false}>
                {t("home.massCta.title")}
              </SectionTitle>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: T.warmGray, marginBottom: 28 }}>
                {t("home.massCta.desc")}
              </p>
              <Btn variant="primary" onClick={() => navigate("/mass-times")}>
                {t("home.massCta.cta")}
              </Btn>
            </div>

            {/* right card — glassmorphic dark */}
            <div
              className="glass-card--dark"
              style={{
                color: "#fff",
                padding: 36,
              }}
            >
              <h3
                style={{
                  fontSize: 22,
                  color: T.goldLight,
                  fontFamily: "'Cormorant Garamond', serif",
                  marginBottom: 20,
                }}
              >
                {t("home.massCta.sundayMass")}
              </h3>
              {[
                [t("home.massCta.satVigil"), "5:00 PM"],
                [t("home.massCta.sun"), "8:00 AM"],
                [t("home.massCta.sun"), "10:30 AM"],
                [t("home.massCta.sunEspanol"), "1:00 PM"],
              ].map(([label, time], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    fontSize: 15,
                  }}
                >
                  <span>{label}</span>
                  <span style={{ fontWeight: 600 }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Dominican Charism — Editorial Cinematic Band ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: T.softBlack,
          color: "#fff",
          padding: "clamp(60px, 12vw, 120px) 24px",
        }}
      >
        <HeroImage src={PHOTOS.dominicanCharism} overlay={0.7} position="center top" />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeSection>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 48,
                alignItems: "center",
              }}
              className="editorial-grid"
            >
              <style>{`
                @media (min-width: 768px) {
                  .editorial-grid { grid-template-columns: 1.2fr 1fr !important; }
                }
              `}</style>

              {/* Left — large editorial quote */}
              <div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    color: T.goldText,
                    marginBottom: 20,
                    fontWeight: 600,
                  }}
                >
                  {t("home.priests.sub")}
                </div>
                <blockquote
                  style={{
                    fontSize: "clamp(28px, 4vw, 44px)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "#fff",
                    lineHeight: 1.3,
                    marginBottom: 16,
                    borderLeft: `3px solid ${T.gold}`,
                    paddingLeft: 24,
                  }}
                >
                  {t("home.priests.quote")}
                </blockquote>
                <cite
                  style={{
                    fontSize: 13,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: T.goldText,
                    fontStyle: "normal",
                    paddingLeft: 28,
                  }}
                >
                  {t("home.priests.quoteSrc")}
                </cite>
              </div>

              {/* Right — text + CTA */}
              <div>
                <h2
                  style={{
                    fontSize: "clamp(26px, 4vw, 36px)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    marginBottom: 20,
                    color: "#fff",
                  }}
                >
                  {t("home.priests.title")}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.7)", marginBottom: 28 }}>
                  {t("home.priests.desc")}
                </p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <Btn variant="gold" onClick={() => navigate("/staff")}>
                    {t("home.priests.cta")}
                  </Btn>
                  <Btn
                    variant="light"
                    onClick={() => window.open(CONFIG.provinceUrl, "_blank")}
                  >
                    {t("home.priests.province")}
                  </Btn>
                </div>
                <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14, opacity: 0.75 }}>
                  <img
                    src={PHOTOS.psjShield}
                    alt="Province of St. Joseph Shield"
                    style={{ width: 40, height: 40, objectFit: "contain" }}
                  />
                  <span style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                    Dominican Province of St. Joseph
                  </span>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ════ Pillars of Faith — 3-column feature cards ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <SectionTitle sub={t("home.pillars.sub")}>{t("home.pillars.title")}</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                iconName: "BookOpenText",
                titleKey: "home.pillars.word.title",
                descKey: "home.pillars.word.desc",
                link: "/about",
              },
              {
                iconName: "Church",
                titleKey: "home.pillars.sacrament.title",
                descKey: "home.pillars.sacrament.desc",
                link: "/sacraments",
              },
              {
                iconName: "Handshake",
                titleKey: "home.pillars.service.title",
                descKey: "home.pillars.service.desc",
                link: "/get-involved",
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: 36,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => navigate(pillar.link)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(pillar.link)}
              >
                <div style={{ marginBottom: 16 }}>
                  <Icon name={pillar.iconName} size={40} color={T.gold} />
                </div>
                <h3
                  style={{
                    fontSize: 22,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    marginBottom: 12,
                    color: T.softBlack,
                  }}
                >
                  {t(pillar.titleKey)}
                </h3>
                <p style={{ fontSize: 15, color: T.warmGray, lineHeight: 1.7 }}>
                  {t(pillar.descKey)}
                </p>
              </div>
            ))}
          </div>
        </FadeSection>
      </Section>

      {/* ════ Get Involved CTA ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${T.burgundyDark}, ${T.burgundy})`,
          padding: "clamp(48px, 10vw, 80px) 24px",
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <FadeSection>
            <SectionTitle sub={t("home.involved.sub")} light divider={false}>
              {t("home.involved.title")}
            </SectionTitle>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 32,
              }}
            >
              {t("home.involved.desc")}
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn variant="gold" onClick={() => navigate("/register")}>
                {t("home.involved.ctaRegister")}
              </Btn>
              <Btn variant="light" onClick={() => navigate("/bulletin")}>
                {t("home.involved.ctaBulletin")}
              </Btn>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ════ Announcements ════ */}
      {announcements.length > 0 && (
        <Section>
          <FadeSection>
            <SectionTitle sub={t("home.announcements.sub")}>
              {t("home.announcements.title")}
            </SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                marginBottom: 32,
              }}
            >
              {announcements.slice(0, 3).map((a, i) => (
                <div
                  key={a.title || i}
                  className="glass-card"
                  style={{ padding: 28 }}
                >
                  {a.date && (
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: T.burgundy,
                        background: `${T.burgundy}12`,
                        padding: "4px 10px",
                        borderRadius: 3,
                        marginBottom: 12,
                      }}
                    >
                      {t("home.announcements.upcoming")} · {new Date(a.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: 19,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 600,
                      marginBottom: 8,
                      color: T.softBlack,
                    }}
                  >
                    {a.title}
                  </h3>
                  <p style={{ fontSize: 15, color: T.warmGray, lineHeight: 1.7 }}>
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <Btn variant="primary" onClick={() => navigate("/bulletin")}>
                {t("home.announcements.ctaBulletin")}
              </Btn>
            </div>
          </FadeSection>
        </Section>
      )}

      {/* ════ Upcoming Events ════ */}
      {(() => {
        const today = new Date(); today.setHours(0,0,0,0);
        const upcoming = events.filter((e) => new Date(e.date + "T00:00:00") >= today).slice(0, 3);
        if (!upcoming.length) return null;
        const CATEGORY_COLORS = { mass: T.burgundy, sacrament: T.gold, education: "#4A7C59", social: "#5B7FA6", prayer: "#7B5EA7", other: T.warmGray };
        return (
          <Section>
            <FadeSection>
              <SectionTitle sub={t("events.sub")}>{t("events.upcomingTitle")}</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto 32px" }}>
                {upcoming.map((evt, i) => {
                  const d = new Date(evt.date + "T00:00:00");
                  const color = CATEGORY_COLORS[evt.category] ?? T.warmGray;
                  return (
                    <div key={i} className="glass-card" style={{ padding: 24, borderTop: `3px solid ${color}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                        <div style={{ textAlign: "center", minWidth: 48 }}>
                          <div style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, color, textTransform: "uppercase" }}>
                            {d.toLocaleDateString("en-US", { month: "short" })}
                          </div>
                          <div style={{ fontSize: 30, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: T.softBlack, lineHeight: 1 }}>
                            {d.getDate()}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ fontSize: 17, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: T.softBlack, marginBottom: 3 }}>
                            {evt.title}
                          </h3>
                          <div style={{ fontSize: 13, color: T.warmGray }}>
                            {evt.time}{evt.location ? ` · ${evt.location}` : ""}
                          </div>
                        </div>
                      </div>
                      {evt.description && (
                        <p style={{ fontSize: 13.5, color: T.warmGray, lineHeight: 1.65 }}>
                          {evt.description.length > 100 ? evt.description.slice(0, 97) + "…" : evt.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ textAlign: "center" }}>
                <Btn variant="primary" onClick={() => navigate("/events")}>{t("home.events.cta")}</Btn>
              </div>
            </FadeSection>
          </Section>
        );
      })()}

      {/* ════ Vatican News ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <SectionTitle sub={t("home.vatican.sub")}>{t("home.vatican.title")}</SectionTitle>
          <VaticanNews />
        </FadeSection>
      </Section>

      {/* ════ Fray Nelson — YouTube Channel ════ */}
      <Section>
        <FadeSection>
          <SectionTitle sub={t("youtube.sub")} divider={false}>{t("youtube.title")}</SectionTitle>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 640,
              margin: "0 auto 32px",
            }}
          >
            {t("youtube.desc")}
          </p>
          <YouTubeChannel />
        </FadeSection>
      </Section>

      {/* ════ Quick Info Cards ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                key: "visit",
                iconName: "MapPin",
                content: (
                  <>
                    <p style={{ fontSize: 15, fontWeight: 600, color: T.softBlack, marginBottom: 2 }}>
                      {CONFIG.address}
                    </p>
                    <p style={{ fontSize: 14, color: T.warmGray }}>
                      {CONFIG.city}, {CONFIG.state} {CONFIG.zip}
                    </p>
                  </>
                ),
              },
              {
                key: "call",
                iconName: "Phone",
                content: (
                  <a href={CONFIG.phoneLink} className="contact-link" style={{ fontSize: 16, fontWeight: 600, color: T.burgundy }}>
                    {CONFIG.phone}
                  </a>
                ),
              },
              {
                key: "hours",
                iconName: "Clock",
                content: (
                  <>
                    <p style={{ fontSize: 15, fontWeight: 600, color: T.softBlack, marginBottom: 2 }}>
                      {t("home.cards.hoursDays")}
                    </p>
                    <p style={{ fontSize: 14, color: T.warmGray }}>
                      {t("home.cards.hoursTime")}
                    </p>
                  </>
                ),
              },
              {
                key: "email",
                iconName: "Mail",
                content: (
                  <a href={`mailto:${CONFIG.email}`} className="contact-link" style={{ fontSize: 14, color: T.burgundy, wordBreak: "break-all" }}>
                    {CONFIG.email}
                  </a>
                ),
              },
            ].map((card) => (
              <div
                key={card.key}
                className="glass-card"
                style={{ padding: 32, textAlign: "center" }}
              >
                <div style={{ marginBottom: 12 }}>
                  <Icon name={card.iconName} size={32} color={T.burgundy} />
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontFamily: "'Cormorant Garamond', serif",
                    marginBottom: 10,
                    color: T.softBlack,
                  }}
                >
                  {t(`home.cards.${card.key}Title`)}
                </h3>
                {card.content}
              </div>
            ))}
          </div>
        </FadeSection>
      </Section>
    </div>
  );
}
