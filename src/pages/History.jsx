import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { Section } from "../components/Section";
import FadeSection from "../components/FadeSection";
import HeroImage from "../components/HeroImage";
import StickyHero from "../components/StickyHero";
import StickyScrub from "../components/StickyScrub";
import ParallaxSection from "../components/ParallaxSection";
import ScaleReveal from "../components/ScaleReveal";
import TextReveal from "../components/TextReveal";
import Seo from "../components/Seo";
import PremiumPageActions from "../components/PremiumPageActions";
import { PHOTOS } from "../constants/photos";

function HistoryPhoto({ src, alt, caption, side }) {
  return (
    <figure
      style={{
        margin: "36px 0",
        textAlign: side === "left" ? "left" : side === "right" ? "right" : "center",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          maxWidth: 680,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      />
      {caption && (
        <figcaption
          style={{
            fontSize: 13,
            color: T.warmGray,
            fontStyle: "italic",
            marginTop: 10,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function TwoPhotos({ left, right }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        margin: "36px 0",
      }}
      className="history-two-photos"
    >
      <figure style={{ margin: 0, textAlign: "center" }}>
        <img
          src={left.src}
          alt={left.alt}
          loading="lazy"
          style={{ width: "100%", borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
        />
        {left.caption && (
          <figcaption style={{ fontSize: 12, color: T.warmGray, fontStyle: "italic", marginTop: 8 }}>
            {left.caption}
          </figcaption>
        )}
      </figure>
      <figure style={{ margin: 0, textAlign: "center" }}>
        <img
          src={right.src}
          alt={right.alt}
          loading="lazy"
          style={{ width: "100%", borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
        />
        {right.caption && (
          <figcaption style={{ fontSize: 12, color: T.warmGray, fontStyle: "italic", marginTop: 8 }}>
            {right.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

const P = (props) => (
  <p style={{ fontSize: 16, lineHeight: 1.8, color: T.warmGray, marginBottom: 20 }} {...props} />
);

export default function History() {
  const { t } = useTranslation();

  return (
    <div>
      <Seo
        title="Church History"
        description="Over 100 years of faith — the history of St. Dominic Catholic Church, founded by the Dominican Friars in 1923 in Youngstown, Ohio."
        image={PHOTOS.homeHero}
      />

      <style>{`
        .history-section { max-width: 800px; margin: 0 auto; }
        .history-era { display: flex; align-items: baseline; gap: 16px; margin-bottom: 16px; }
        .history-year {
          font-size: clamp(48px, 8vw, 72px);
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; color: ${T.stone}; line-height: 1; flex-shrink: 0;
        }
        .history-era-label {
          font-size: 14px; letter-spacing: 3px; text-transform: uppercase;
          color: ${T.goldText}; font-weight: 600;
        }
        @media (max-width: 600px) {
          .history-two-photos { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ════ Hero — Apple-style Sticky with Scroll Fade ════ */}
      <StickyHero
        image={PHOTOS.pageHeader}
        overlay={0.5}
        tint="rgba(30,20,15,0.6)"
        height="130vh"
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: T.goldText,
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          {t("history.sub")}
        </div>
        <h1
          style={{
            fontSize: "clamp(44px, 8vw, 72px)",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#fff",
            textShadow: "0 2px 30px rgba(0,0,0,0.6)",
          }}
        >
          {t("history.title")}
        </h1>
        <div style={{ width: 56, height: 3, background: T.gold, margin: "20px auto 0" }} />
        <p
          style={{
            fontSize: 18,
            maxWidth: 540,
            margin: "24px auto 0",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
          }}
        >
          {t("history.heroDesc")}
        </p>
      </StickyHero>

      <PremiumPageActions
        overlap
        eyebrow={t("history.sub")}
        title={t("history.title")}
        items={[
          {
            title: t("nav.architecture"),
            description: t("arch.hero.desc"),
            to: "/architecture",
            icon: "Building",
            primary: true,
          },
          {
            title: t("nav.gallery"),
            description: t("gallery.title"),
            to: "/gallery",
            icon: "Maximize",
          },
          {
            title: t("nav.visit"),
            description: t("visit.hero.desc"),
            to: "/visit",
            icon: "MapPin",
          },
        ]}
      />

      <StickyScrub
        image={PHOTOS.historyExteriorBw || PHOTOS.historyHero}
        overlay={0.55}
        panels={[
          {
            id: "h-1923",
            title: "1923",
            body: "St. Dominic parish is established on Youngstown's south side, gathering immigrant families around the Eucharist.",
          },
          {
            id: "h-friars",
            title: "The Friars Arrive",
            body: "The Dominican Friars of the Province of St. Joseph are entrusted with the parish — preaching, prayer, study, and community become the rhythm of life here.",
          },
          {
            id: "h-today",
            title: "A Century On",
            body: "Over one hundred years later, St. Dominic remains a beacon of sacramental life and Dominican witness in the Mahoning Valley.",
          },
        ]}
        height="300vh"
      />

      {/* ════ 1923 — The Founding ════ */}
      <Section>
        <FadeSection>
          <div className="history-section">
            <div className="history-era">
              <div className="history-year">1923</div>
              <div className="history-era-label">{t("history.founding.label")}</div>
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600, marginBottom: 20, color: T.softBlack,
              }}
            >
              {t("history.founding.title")}
            </h2>
            <P>{t("history.founding.p1")}</P>

            <HistoryPhoto
              src={PHOTOS.historyStorefront}
              alt={t("history.founding.storeAlt")}
              caption={t("history.founding.storeCap")}
            />

            <P>{t("history.founding.p2")}</P>
            <P>{t("history.founding.p3")}</P>
          </div>
        </FadeSection>
      </Section>

      {/* ════ 1950s — Building the Church ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <div className="history-section">
            <div className="history-era">
              <div className="history-year">1952</div>
              <div className="history-era-label">{t("history.building.label")}</div>
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600, marginBottom: 20, color: T.softBlack,
              }}
            >
              {t("history.building.title")}
            </h2>
            <P>{t("history.building.p1")}</P>

            <TwoPhotos
              left={{
                src: PHOTOS.historyFoundation,
                alt: t("history.building.foundationAlt"),
                caption: t("history.building.foundationCap"),
              }}
              right={{
                src: PHOTOS.historyConstruction,
                alt: t("history.building.constructAlt"),
                caption: t("history.building.constructCap"),
              }}
            />

            <P>{t("history.building.p2")}</P>

            <HistoryPhoto
              src={PHOTOS.historyConstructionExt}
              alt={t("history.building.exteriorAlt")}
              caption={t("history.building.exteriorCap")}
            />

            <P>{t("history.building.p3")}</P>
          </div>
        </FadeSection>
      </Section>

      {/* ════ 1957 — Dedication ════ */}
      <Section>
        <FadeSection>
          <div className="history-section">
            <div className="history-era">
              <div className="history-year">1957</div>
              <div className="history-era-label">{t("history.dedication.label")}</div>
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600, marginBottom: 20, color: T.softBlack,
              }}
            >
              {t("history.dedication.title")}
            </h2>
            <P>{t("history.dedication.p1")}</P>

            <HistoryPhoto
              src={PHOTOS.historyExteriorBw}
              alt={t("history.dedication.completedAlt")}
              caption={t("history.dedication.completedCap")}
            />

            <P>{t("history.dedication.p2")}</P>

            <ScaleReveal
              src={PHOTOS.historyAltarboys}
              alt={t("history.dedication.altarboysAlt")}
              caption={t("history.dedication.altarboysCap")}
            />
          </div>
        </FadeSection>
      </Section>

      {/* ════ Dominican Motto — Parallax Banner ════ */}
      <ParallaxSection
        image={PHOTOS.historyInteriorVintage}
        height="auto"
        speed={0.3}
        overlay={0.65}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "clamp(48px, 8vw, 80px) 0" }}>
          <blockquote
            style={{
              fontSize: "clamp(24px, 5vw, 36px)",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              lineHeight: 1.5,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            {t("about.history.motto")}
          </blockquote>
          <cite
            style={{
              display: "block",
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: T.goldText,
              fontStyle: "normal",
            }}
          >
            {t("about.history.mottoSrc")}
          </cite>
        </div>
      </ParallaxSection>

      {/* ════ Growth & Change ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <div className="history-section">
            <div className="history-era">
              <div className="history-year">1960s</div>
              <div className="history-era-label">{t("history.growth.label")}</div>
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600, marginBottom: 20, color: T.softBlack,
              }}
            >
              {t("history.growth.title")}
            </h2>
            <P>{t("history.growth.p1")}</P>

            <HistoryPhoto
              src={PHOTOS.historyMass1979}
              alt={t("history.growth.massAlt")}
              caption={t("history.growth.massCap")}
            />

            <P>{t("history.growth.p2")}</P>
            <P>{t("history.growth.p3")}</P>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Renewal & Today ════ */}
      <Section>
        <FadeSection>
          <div className="history-section">
            <div className="history-era">
              <div className="history-year" style={{ color: T.gold }}>{t("history.today.year")}</div>
              <div className="history-era-label">{t("history.today.label")}</div>
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600, marginBottom: 20, color: T.softBlack,
              }}
            >
              {t("history.today.title")}
            </h2>
            <P>{t("history.today.p1")}</P>
            <P>{t("history.today.p2")}</P>

            <ScaleReveal
              src={PHOTOS.historyHero}
              alt={t("history.today.aerialAlt")}
              caption={t("history.today.aerialCap")}
            />

            <P>{t("history.today.p3")}</P>
          </div>
        </FadeSection>
      </Section>
    </div>
  );
}
