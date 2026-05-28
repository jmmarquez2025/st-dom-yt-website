import { useTranslation } from "react-i18next";
import PullQuote from "../../components/PullQuote";
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
import SacramentPageActions from "../../components/SacramentPageActions";

export default function FirstCommunion() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo title="First Holy Communion" description="First Holy Communion preparation at St. Dominic Church. Program details, requirements, and registration information." image={PHOTOS.stockEucharist} />
      <PageHeader title={t("sacraments.firstCommunion.title")} heroSrc={PHOTOS.stockEucharist} tall />
      <SacramentPageActions sacramentKey="firstCommunion" icon="Wheat" />

      <Section bg={T.warmWhite}>
        <FadeSection>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionTitle sub={t("sacraments.firstCommunion.sub")}>{t("sacraments.firstCommunion.heading")}</SectionTitle>
            <PullQuote
              text={t("sacraments.firstCommunion.quote")}
              src={t("sacraments.firstCommunion.quoteSrc")}
            />
            <div style={{ fontSize: 16, color: T.warmGray, lineHeight: 2 }}>
              <p style={{ marginBottom: 20 }}>{t("sacraments.firstCommunion.p1")}</p>
              <p style={{ marginBottom: 20 }}>{t("sacraments.firstCommunion.p2")}</p>
            </div>
          </div>
        </FadeSection>
      </Section>

      <Section bg={T.cream}>
        <FadeSection>
          <SectionTitle sub={t("sacraments.firstCommunion.prepSub")}>{t("sacraments.firstCommunion.prepTitle")}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {["prep1", "prep2", "prep3"].map((key) => (
              <div key={key} style={{ background: T.warmWhite, padding: 28, borderRadius: 4, border: `1px solid ${T.stone}` }}>
                <h3 style={{ fontSize: 18, color: T.burgundy, marginBottom: 8 }}>{t(`sacraments.firstCommunion.${key}.title`)}</h3>
                <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>{t(`sacraments.firstCommunion.${key}.desc`)}</p>
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
              {t("sacraments.firstCommunion.cta")}
            </h3>
            <p style={{ fontSize: 15, color: T.warmGray, marginBottom: 24, lineHeight: 1.7 }}>{t("sacraments.firstCommunion.ctaDesc")}</p>
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
