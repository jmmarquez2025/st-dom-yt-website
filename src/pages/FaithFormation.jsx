import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import FadeSection from "../components/FadeSection";
import PageHeader from "../components/PageHeader";
import ParallaxSection from "../components/ParallaxSection";
import DominicanDivider from "../components/DominicanDivider";
import Seo from "../components/Seo";
import { BookOpen, Headphones, GraduationCap, Church, ExternalLink } from "lucide-react";

const RESOURCES = [
  {
    key: "thomistic",
    icon: GraduationCap,
    url: "https://thomisticinstitute.org",
    color: T.burgundy,
  },
  {
    key: "godsplaining",
    icon: Headphones,
    url: "https://godsplaining.org",
    color: "#2D6A4F",
  },
  {
    key: "rosary",
    icon: Headphones,
    url: "https://hfrrosary.com",
    color: "#3A5BA0",
  },
  {
    key: "dominicana",
    icon: BookOpen,
    url: "https://www.dominicanajournal.org",
    color: "#5C3D2E",
  },
  {
    key: "saintsAlive",
    icon: Headphones,
    url: "https://www.saintsalivepodcast.com",
    color: "#8B6914",
  },
  {
    key: "catechism",
    icon: Church,
    url: "https://www.usccb.org/beliefs-and-teachings/what-we-believe/catechism/catechism-of-the-catholic-church",
    color: "#1B4332",
  },
];

const cardStyle = {
  background: "#fff",
  borderRadius: 10,
  overflow: "hidden",
  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  flexDirection: "column",
};

export default function FaithFormation() {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Faith Formation"
        description="Deepen your faith with Dominican resources — podcasts, theology, catechesis, and more at St. Dominic Catholic Church."
        image={PHOTOS.faithFormationHero}
      />
      <PageHeader
        title={t("faithFormation.title")}
        heroSrc={PHOTOS.faithFormationHero}
        tall
      />

      {/* ════ Intro ════ */}
      <Section bg={T.warmWhite}>
        <FadeSection>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <SectionTitle sub={t("faithFormation.intro.sub")}>
              {t("faithFormation.intro.title")}
            </SectionTitle>
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
              {t("faithFormation.quote")}
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
                {t("faithFormation.quoteSrc")}
              </cite>
            </blockquote>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: T.warmGray,
                maxWidth: 720,
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              {t("faithFormation.intro.desc")}
            </p>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Why Learn More ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <SectionTitle sub={t("faithFormation.why.sub")}>
              {t("faithFormation.why.title")}
            </SectionTitle>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.9,
                color: T.warmGray,
                marginBottom: 20,
              }}
            >
              {t("faithFormation.why.p1")}
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.9, color: T.warmGray }}>
              {t("faithFormation.why.p2")}
            </p>
          </div>
        </FadeSection>
      </Section>

      {/* Parallax visual break */}
      <ParallaxSection
        image={PHOTOS.stockBibleGolden}
        height="30vh"
        overlay={0.45}
        position="center 80%"
      >
        <DominicanDivider color="#fff" width={160} />
      </ParallaxSection>

      {/* ════ Dominican Resources ════ */}
      <Section bg={T.warmWhite}>
        <FadeSection>
          <SectionTitle sub={t("faithFormation.resources.sub")}>
            {t("faithFormation.resources.title")}
          </SectionTitle>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              maxWidth: 680,
              margin: "0 auto 40px",
              textAlign: "center",
            }}
          >
            {t("faithFormation.resources.desc")}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 28,
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            {RESOURCES.map(({ key, icon: Icon, url, color }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...cardStyle,
                  textDecoration: "none",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 16px rgba(0,0,0,0.06)";
                }}
              >
                <div
                  style={{
                    height: 5,
                    background: color,
                  }}
                />
                <div style={{ padding: "28px 28px 24px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: `${color}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={color} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: 19,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 700,
                          color: T.softBlack,
                          margin: 0,
                        }}
                      >
                        {t(`faithFormation.resources.${key}.title`)}
                      </h3>
                      <span
                        style={{
                          fontSize: 11,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                          color,
                          fontWeight: 600,
                        }}
                      >
                        {t(`faithFormation.resources.${key}.tag`)}
                      </span>
                    </div>
                    <ExternalLink
                      size={15}
                      color={T.stone}
                      style={{ flexShrink: 0 }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: T.warmGray,
                      margin: 0,
                    }}
                  >
                    {t(`faithFormation.resources.${key}.desc`)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </FadeSection>
      </Section>

      {/* ════ Embedded Podcasts ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <SectionTitle sub={t("faithFormation.listen.sub")}>
            {t("faithFormation.listen.title")}
          </SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 28,
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            {/* Godsplaining */}
            <div style={cardStyle}>
              <div style={{ padding: 24 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontFamily: "'Cormorant Garamond', serif",
                    color: T.softBlack,
                    marginBottom: 12,
                  }}
                >
                  Godsplaining
                </h3>
                <iframe
                  src="https://open.spotify.com/embed/show/0aIOz3chYeQZxsdjyJzlOb?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: 8 }}
                  title="Godsplaining Podcast"
                />
              </div>
            </div>

            {/* Rosary in a Year */}
            <div style={cardStyle}>
              <div style={{ padding: 24 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontFamily: "'Cormorant Garamond', serif",
                    color: T.softBlack,
                    marginBottom: 12,
                  }}
                >
                  Rosary in a Year
                </h3>
                <iframe
                  src="https://open.spotify.com/embed/show/3Rx1puBjE0xZBiuy4BT4i7?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: 8 }}
                  title="Rosary in a Year Podcast"
                />
              </div>
            </div>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Getting Started CTA ════ */}
      <Section bg={T.warmWhite}>
        <FadeSection>
          <DominicanDivider style={{ marginBottom: 16 }} />
          <div
            style={{
              textAlign: "center",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <h3
              style={{
                fontSize: "clamp(24px, 4vw, 32px)",
                fontFamily: "'Cormorant Garamond', serif",
                color: T.softBlack,
                marginBottom: 14,
              }}
            >
              {t("faithFormation.cta.title")}
            </h3>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: T.warmGray,
                marginBottom: 8,
              }}
            >
              {t("faithFormation.cta.desc")}
            </p>
          </div>
        </FadeSection>
      </Section>
    </div>
  );
}
