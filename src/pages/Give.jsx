import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import PageHeader from "../components/PageHeader";
import ParallaxSection from "../components/ParallaxSection";
import DominicanDivider from "../components/DominicanDivider";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import { NextSteps, PastoralActionPanel } from "../components/PastoralActionPanel";

export default function Give() {
  const { t } = useTranslation();

  const hasGivingPortal = Boolean(CONFIG.flocknoteGivingUrl);
  const portalFeatures = [
    { key: "oneTime", icon: "Gift" },
    { key: "recurring", icon: "Repeat2" },
    { key: "payments", icon: "CreditCard" },
    { key: "statements", icon: "FileText" },
  ];
  const donationSectionStyle = { contentVisibility: "visible" };

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo title="Online Giving" description="Support St. Dominic Catholic Church through online giving. Your generosity sustains our ministries and community outreach." image={PHOTOS.stockGiving} />
      <PageHeader title={t("give.title")} heroSrc={PHOTOS.stockGiving} tall />

      <Section bg={T.warmWhite} style={donationSectionStyle}>
        <SectionTitle sub={t("give.sub")}>{t("give.heading")}</SectionTitle>
        <blockquote
          style={{
            fontSize: "clamp(17px, 2.5vw, 21px)",
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            lineHeight: 1.6,
            color: T.warmGray,
            borderLeft: `3px solid ${T.gold}`,
            paddingLeft: 20,
            margin: "0 auto 28px",
            maxWidth: 640,
          }}
        >
          {t("give.quote")}
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
            {t("give.quoteSrc")}
          </cite>
        </blockquote>
        <p style={{ fontSize: 16, color: T.warmGray, lineHeight: 1.8, textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          {t("give.desc")}
        </p>
        <PastoralActionPanel
          eyebrow={t("give.sub")}
          title={t("give.clarityTitle")}
          description={t("give.clarityDesc")}
          primaryLabel={t("give.flocknoteBtn")}
          primaryHref={CONFIG.flocknoteGivingUrl}
          secondaryLabel={t("give.next.office.title")}
          secondaryHref={CONFIG.phoneLink}
        />
      </Section>

      {/* Flocknote Online Giving */}
      <Section bg={T.cream} style={donationSectionStyle}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: T.warmWhite, border: `1px solid ${T.stone}`, borderRadius: 4, padding: 48 }}>
            <div style={{ marginBottom: 16 }} aria-hidden="true">
              <Icon name="Gift" size={48} color={T.burgundy} />
            </div>
            <h3 style={{ fontSize: 28, color: T.burgundy, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>
              {t("give.onlineTitle")}
            </h3>
            <p style={{ fontSize: 15, color: T.warmGray, lineHeight: 1.8, marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
              {t("give.onlineDesc")}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
                gap: 12,
                margin: "0 auto 28px",
                maxWidth: 560,
                textAlign: "left",
              }}
            >
              {portalFeatures.map(({ key, icon }) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    background: T.cream,
                    border: `1px solid ${T.stone}`,
                    borderRadius: 4,
                    padding: 14,
                    minHeight: 88,
                  }}
                >
                  <Icon name={icon} size={20} color={T.burgundy} />
                  <div>
                    <h4 style={{ fontSize: 13, color: T.softBlack, marginBottom: 4, fontWeight: 700 }}>
                      {t(`give.portalFeatures.${key}.title`)}
                    </h4>
                    <p style={{ fontSize: 12, color: T.warmGray, lineHeight: 1.45, margin: 0 }}>
                      {t(`give.portalFeatures.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {hasGivingPortal ? (
              <a
                href={CONFIG.flocknoteGivingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 40px", background: T.gold,
                  color: T.softBlack, fontSize: 15, fontWeight: 600, letterSpacing: 1,
                  textTransform: "uppercase", borderRadius: 2, textDecoration: "none",
                  fontFamily: "'Source Sans 3', sans-serif",
                }}
              >
                {t("give.flocknoteBtn")}
                <Icon name="ExternalLink" size={16} color={T.softBlack} strokeWidth={2} />
              </a>
            ) : (
              <div style={{ background: T.cream, borderRadius: 4, padding: 24, border: `1px solid ${T.stone}` }}>
                <p style={{ fontSize: 15, color: T.warmGray, lineHeight: 1.7 }}>
                  {t("give.comingSoon")}
                </p>
                <p style={{ fontSize: 14, color: T.warmGray, marginTop: 8 }}>
                  {t("give.contactOffice")}
                </p>
              </div>
            )}
            <p style={{ fontSize: 12, color: T.warmGray, marginTop: 20, fontStyle: "italic" }}>
              {t("give.flocknoteNote")}
            </p>
            <p style={{ fontSize: 12, color: T.warmGray, marginTop: 8 }}>
              {t("give.feeNote")}
            </p>
          </div>
        </div>
      </Section>

      {/* Parallax visual break */}
      <ParallaxSection
        image={PHOTOS.stockCandles}
        height="30vh"
        overlay={0.45}
      >
        <DominicanDivider color={T.goldLight} width={160} />
      </ParallaxSection>

      {/* Other giving methods */}
      <Section bg={T.warmWhite} style={donationSectionStyle}>
        <SectionTitle sub={t("give.otherSub")}>{t("give.otherTitle")}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {["offertory", "mail", "stock"].map((key) => (
            <div key={key} className="hover-lift" style={{ background: T.cream, padding: 32, borderRadius: 4, textAlign: "center", border: `1px solid ${T.stone}` }}>
              <div style={{ marginBottom: 12 }} aria-hidden="true">
                <Icon name={key === "offertory" ? "Church" : key === "mail" ? "Mail" : "TrendingUp"} size={32} color={T.burgundy} />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8, color: T.burgundy }}>{t(`give.methods.${key}.title`)}</h3>
              <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.7 }}>{t(`give.methods.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tax info */}
      <Section bg={T.cream} style={donationSectionStyle}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: T.warmGray, lineHeight: 1.8 }}>
            {t("give.taxNote")}
          </p>
          <p style={{ fontSize: 14, color: T.warmGray, marginTop: 12 }}>
            {t("give.questions")}{" "}
            <a href={CONFIG.phoneLink} className="contact-link" style={{ color: T.burgundy, fontWeight: 600 }}>{CONFIG.phone}</a>
          </p>
        </div>
      </Section>

      <NextSteps
        eyebrow={t("give.nextSub")}
        title={t("give.nextTitle")}
        items={[
          {
            icon: "Phone",
            title: t("give.next.office.title"),
            description: t("give.next.office.desc"),
            href: CONFIG.phoneLink,
          },
          {
            icon: "Church",
            title: t("give.next.mass.title"),
            description: t("give.next.mass.desc"),
            to: "/mass-times",
          },
          {
            icon: "ClipboardList",
            title: t("give.next.register.title"),
            description: t("give.next.register.desc"),
            to: "/register",
          },
        ]}
      />
    </div>
  );
}
