import { useTranslation } from "react-i18next";
import PullQuote from "../components/PullQuote";
import { Link, useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import FadeSection from "../components/FadeSection";
import PageHeader from "../components/PageHeader";
import ParallaxSection from "../components/ParallaxSection";
import DominicanDivider from "../components/DominicanDivider";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import PremiumPageActions from "../components/PremiumPageActions";

const SACRAMENT_LINKS = [
  { to: "/sacraments/baptism", key: "baptism", icon: "Droplets" },
  { to: "/sacraments/first-communion", key: "firstCommunion", icon: "Wheat" },
  { to: "/sacraments/confirmation", key: "confirmation", icon: "Flame" },
  { to: "/sacraments/marriage", key: "marriage", icon: "Gem" },
  { to: "/sacraments/anointing", key: "anointing", icon: "HandHeart" },
  { to: "/sacraments/funerals", key: "funerals", icon: "Cross" },
];

export default function Sacraments() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo title="The Sacraments" description="Learn about the seven sacraments celebrated at St. Dominic Church — Baptism, Eucharist, Confirmation, Marriage, and more." image={PHOTOS.stockSacraments} />
      <PageHeader title={t("sacraments.title")} heroSrc={PHOTOS.stockSacraments} tall />

      <PremiumPageActions
        overlap
        eyebrow={t("sacraments.sub")}
        title={t("sacraments.heading")}
        items={[
          {
            icon: "Droplets",
            title: t("sacraments.baptism.title"),
            description: t("sacraments.baptism.brief"),
            to: "/sacraments/baptism",
            primary: true,
          },
          {
            icon: "Gem",
            title: t("sacraments.marriage.title"),
            description: t("sacraments.marriage.brief"),
            to: "/sacraments/marriage",
          },
          {
            icon: "Phone",
            title: t("sacraments.contactUs"),
            description: t("contact.formDesc"),
            to: "/contact",
          },
        ]}
      />

      <Section bg={T.warmWhite}>
        <FadeSection>
          <SectionTitle sub={t("sacraments.sub")}>{t("sacraments.heading")}</SectionTitle>
          <PullQuote
            text={t("sacraments.quote")}
            src={t("sacraments.quoteSrc")}
          />
          <p style={{ fontSize: 16, color: T.warmGray, lineHeight: 1.9, textAlign: "center", maxWidth: 700, margin: "0 auto 48px" }}>
            {t("sacraments.desc")}
          </p>
        </FadeSection>
      </Section>

      {/* Parallax visual break */}
      <ParallaxSection
        image={PHOTOS.stockChaliceCruets}
        height="35vh"
        overlay={0.45}
      >
        <DominicanDivider color="#fff" width={160} />
      </ParallaxSection>

      <Section bg={T.cream}>
        <FadeSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {SACRAMENT_LINKS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                onClick={(e) => {
                  if (document.startViewTransition) {
                    e.preventDefault();
                    document.startViewTransition(() => navigate(s.to));
                  }
                }}
                className="hover-lift"
                style={{
                  textDecoration: "none", background: T.warmWhite, padding: 36,
                  borderRadius: 4, border: `1px solid ${T.stone}`, borderTop: `4px solid ${T.burgundy}`,
                  display: "block",
                  viewTransitionName: `sacrament-${s.key}`,
                }}
              >
                <div style={{ marginBottom: 12 }} aria-hidden="true">
                  <Icon name={s.icon} size={36} color={T.burgundy} />
                </div>
                <h3 style={{ fontSize: 22, color: T.burgundy, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>
                  {t(`sacraments.${s.key}.title`)}
                </h3>
                <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>
                  {t(`sacraments.${s.key}.brief`)}
                </p>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.goldText, letterSpacing: 1, textTransform: "uppercase", marginTop: 16 }}>
                  {t("sacraments.learnMore")} →
                </div>
              </Link>
            ))}
          </div>
        </FadeSection>
      </Section>
    </div>
  );
}
