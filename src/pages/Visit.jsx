import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Section, SectionTitle } from "../components/Section";
import FadeSection from "../components/FadeSection";
import Btn from "../components/Btn";

import Seo from "../components/Seo";
import ScrollColorNum from "../components/ScrollColorNum";
import Icon from "../components/Icon";
import HeroImage from "../components/HeroImage";
import { PHOTOS } from "../constants/photos";
import PremiumPageActions from "../components/PremiumPageActions";

export default function Visit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${CONFIG.mapsQuery}`;

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Plan Your Visit"
        description="Planning to visit St. Dominic Church? Everything you need to know — what to expect, Mass times, parking, and a warm welcome."
        image={PHOTOS.visitHero}
      />

      {/* ════ Hero Banner ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(160deg, ${T.burgundyDark} 0%, ${T.burgundy} 60%, #8B2E3F 100%)`,
          color: "#fff",
          padding: "clamp(64px, 12vw, 120px) 24px clamp(48px, 10vw, 100px)",
          textAlign: "center",
        }}
      >
        <HeroImage src={PHOTOS.visitHero} overlay={0.5} tint="rgba(107,29,42,0.5)" />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: T.goldLight,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            {t("visit.hero.sub")}
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 20,
              color: "#fff",
            }}
          >
            {t("visit.hero.title")}
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {t("visit.hero.desc")}
          </p>
        </div>
      </section>

      <PremiumPageActions
        overlap
        eyebrow={t("visit.hero.sub")}
        items={[
          {
            icon: "Church",
            title: t("visit.schedule.cta"),
            description: t("visit.schedule.confessionNote"),
            to: "/mass-times",
            primary: true,
          },
          {
            icon: "MapPin",
            title: t("visit.directions.cta"),
            description: `${CONFIG.address}, ${CONFIG.city}`,
            href: mapsHref,
            external: true,
          },
          {
            icon: "Phone",
            title: t("visit.cta.contact"),
            description: CONFIG.phone,
            to: "/contact",
          },
        ]}
      />

      {/* ════ Sunday at St. Dominic ════ */}
      <Section>
        <FadeSection>
          <SectionTitle sub={t("visit.steps.sub")}>{t("visit.steps.title")}</SectionTitle>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: T.warmGray,
              lineHeight: 1.7,
              textAlign: "center",
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            {t("visit.steps.intro")}
          </p>
        </FadeSection>
      </Section>

      {/* ════ What to Know — interactive cards ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <SectionTitle sub={t("visit.know.sub")}>{t("visit.know.title")}</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {[
              { key: "dress", icon: "Users", accent: T.burgundy },
              { key: "children", icon: "Baby", accent: "#2E7D32" },
              { key: "language", icon: "Globe", accent: "#C0392B" },
              { key: "parking", icon: "Car", accent: "#1565C0" },
            ].map((item) => (
              <div
                key={item.key}
                className="glass-card"
                style={{
                  padding: 32,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* colored accent top bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: item.accent,
                  }}
                />
                <div
                  style={{
                    marginBottom: 12,
                  }}
                  aria-hidden="true"
                >
                  <Icon name={item.icon} size={28} color={item.accent} />
                </div>
                <ScrollColorNum
                  as="h3"
                  colorFrom={T.warmGray}
                  colorTo={item.accent}
                  style={{
                    fontSize: 18,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  {t(`visit.know.${item.key}.title`)}
                </ScrollColorNum>
                <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
                  {t(`visit.know.${item.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </FadeSection>
      </Section>

      {/* ════ Quick Mass Schedule ════ */}
      <Section>
        <FadeSection>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 36,
              alignItems: "center",
            }}
          >
            <div>
              <SectionTitle sub={t("visit.schedule.sub")} center={false}>
                {t("visit.schedule.title")}
              </SectionTitle>
              <Btn variant="primary" onClick={() => navigate("/mass-times")}>
                {t("visit.schedule.cta")}
              </Btn>
            </div>

            <div
              className="glass-card--dark"
              style={{
                color: "#fff",
                padding: 32,
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  color: T.goldLight,
                  fontFamily: "'Cormorant Garamond', serif",
                  marginBottom: 16,
                }}
              >
                {t("visit.schedule.sundayTitle")}
              </h3>
              {[
                [t("visit.schedule.satVigil"), "5:00 PM"],
                [t("visit.schedule.sun"), "8:00 AM"],
                [t("visit.schedule.sun"), "10:30 AM"],
                [t("visit.schedule.sunEs"), "12:30 PM"],
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
                  <ScrollColorNum
                    as="span"
                    colorFrom="#FFFFFF"
                    colorTo="#E8D5A3"
                    style={{ fontWeight: 600 }}
                  >
                    {time}
                  </ScrollColorNum>
                </div>
              ))}
              <p
                style={{
                  fontSize: 13,
                  marginTop: 16,
                  color: "rgba(255,255,255,0.6)",
                  fontStyle: "italic",
                }}
              >
                {t("visit.schedule.confessionNote")}
              </p>
            </div>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Directions Card ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: T.goldText,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              {t("visit.directions.sub")}
            </div>
            <h2
              style={{
                fontSize: "clamp(24px, 4vw, 34px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                color: T.softBlack,
                marginBottom: 16,
              }}
            >
              {t("visit.directions.title")}
            </h2>

            <div
              className="glass-card"
              style={{
                padding: 32,
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: T.softBlack,
                  marginBottom: 4,
                }}
              >
                {CONFIG.address}
              </p>
              <p
                style={{
                  fontSize: 16,
                  color: T.warmGray,
                  marginBottom: 20,
                }}
              >
                {CONFIG.city}, {CONFIG.state} {CONFIG.zip}
              </p>
              <Btn
                variant="primary"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${CONFIG.mapsQuery}`,
                    "_blank"
                  )
                }
              >
                {t("visit.directions.cta")}
              </Btn>
            </div>

            <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
              {t("visit.directions.parking")}
            </p>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Pastor Welcome CTA ════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${T.burgundyDark}, ${T.burgundy})`,
          padding: "clamp(48px, 10vw, 80px) 24px",
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: 650, margin: "0 auto" }}>
          <FadeSection>
            <h2
              style={{
                fontSize: "clamp(26px, 5vw, 38px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                color: "#fff",
                marginBottom: 16,
                lineHeight: 1.3,
              }}
            >
              {t("visit.cta.title")}
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 32,
              }}
            >
              {t("visit.cta.desc")}
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Btn variant="gold" onClick={() => navigate("/contact")}>
                {t("visit.cta.contact")}
              </Btn>
              <Btn variant="light" onClick={() => navigate("/becoming-catholic")}>
                {t("visit.cta.becoming")}
              </Btn>
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}
