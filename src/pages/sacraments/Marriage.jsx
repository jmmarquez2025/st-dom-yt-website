import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../../constants/theme";
import { CONFIG } from "../../constants/config";
import { PHOTOS } from "../../constants/photos";
import { Section, SectionTitle } from "../../components/Section";
import FadeSection from "../../components/FadeSection";
import Btn from "../../components/Btn";
import PageHeader from "../../components/PageHeader";
import Seo from "../../components/Seo";
import DominicanDivider from "../../components/DominicanDivider";

export default function Marriage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo title="Marriage" description="Planning a Catholic wedding at St. Dominic Church? Learn about marriage preparation, requirements, and scheduling." image={PHOTOS.marriageHero} />
      <PageHeader title={t("sacraments.marriage.title")} heroSrc={PHOTOS.marriageHero} tall />

      <Section bg={T.warmWhite}>
        <FadeSection>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionTitle sub={t("sacraments.marriage.sub")}>{t("sacraments.marriage.heading")}</SectionTitle>
            <blockquote
              style={{
                fontSize: "clamp(17px, 2.5vw, 21px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                lineHeight: 1.6,
                color: T.warmGray,
                borderLeft: `3px solid ${T.gold}`,
                paddingLeft: 20,
                margin: "0 0 28px",
                maxWidth: 640,
              }}
            >
              {t("sacraments.marriage.quote")}
              <cite
                style={{
                  display: "block",
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: T.goldText,
                  fontStyle: "normal",
                  marginTop: 10,
                }}
              >
                {t("sacraments.marriage.quoteSrc")}
              </cite>
            </blockquote>
            <div style={{ fontSize: 16, color: T.warmGray, lineHeight: 2 }}>
              <p style={{ marginBottom: 20 }}>{t("sacraments.marriage.p1")}</p>
              <p style={{ marginBottom: 20 }}>{t("sacraments.marriage.p2")}</p>
            </div>
          </div>
        </FadeSection>
      </Section>

      <Section bg={T.cream}>
        <FadeSection>
          <SectionTitle sub={t("sacraments.marriage.stepsSub")}>{t("sacraments.marriage.stepsTitle")}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {["step1", "step2", "step3"].map((key) => (
              <div key={key} style={{ background: T.warmWhite, padding: 28, borderRadius: 4, border: `1px solid ${T.stone}`, borderTop: `4px solid ${T.gold}` }}>
                <h4 style={{ fontSize: 18, color: T.burgundy, marginBottom: 8 }}>{t(`sacraments.marriage.${key}.title`)}</h4>
                <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>{t(`sacraments.marriage.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </FadeSection>
      </Section>

      <Section bg={T.warmWhite}>
        <FadeSection>
          <DominicanDivider style={{ marginBottom: 16 }} />
          <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
            <h3 style={{ fontSize: 26, color: T.softBlack, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>
              {t("sacraments.marriage.cta")}
            </h3>
            <p style={{ fontSize: 15, color: T.warmGray, marginBottom: 24, lineHeight: 1.7 }}>{t("sacraments.marriage.ctaDesc")}</p>
            <Btn onClick={() => navigate("/contact")}>{t("sacraments.contactUs")}</Btn>
            <p style={{ fontSize: 14, color: T.warmGray, marginTop: 16 }}>
              <a href={CONFIG.phoneLink} className="contact-link" style={{ color: T.burgundy }}>{CONFIG.phone}</a>
            </p>
          </div>
        </FadeSection>
      </Section>
    </div>
  );
}
