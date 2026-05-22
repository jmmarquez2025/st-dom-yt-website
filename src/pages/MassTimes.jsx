import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import FadeSection from "../components/FadeSection";
import Btn from "../components/Btn";
import ParallaxSection from "../components/ParallaxSection";
import ScaleReveal from "../components/ScaleReveal";
import { useSchedule } from "../cms/hooks";
import Seo from "../components/Seo";
import HeroImage from "../components/HeroImage";
import { PastoralActionPanel } from "../components/PastoralActionPanel";
import { buildMassTimesSchema } from "../utils/seoSchema";
import { ChevronDown } from "lucide-react";

/* ── Schedule Card ── */
function ScheduleCard({ title, rows, accent = T.burgundy, t }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: 28 }}>
        <h3
          style={{
            fontSize: 20,
            fontFamily: "'Cormorant Garamond', serif",
            marginBottom: 16,
            color: T.softBlack,
          }}
        >
          {title}
        </h3>
        {rows.map(([dayKey, time], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom:
                i < rows.length - 1 ? `1px solid ${T.stone}` : "none",
              fontSize: 15,
            }}
          >
            <span style={{ color: T.charcoal }}>{t(`schedule.${dayKey}`)}</span>
            <span style={{ fontWeight: 600, color: T.softBlack }}>{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Blockquote ── */
function Quote({ text, src }) {
  return (
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
      {text}
      <cite
        style={{
          display: "block",
          marginTop: 10,
          fontSize: "clamp(12px, 1.5vw, 14px)",
          fontStyle: "normal",
          fontFamily: "'Source Sans 3', sans-serif",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: T.goldText,
        }}
      >
        {src}
      </cite>
    </blockquote>
  );
}

/* ── Accordion Item ── */
function AccordionItem({ title, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: 12,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "18px 24px",
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "'Cormorant Garamond', serif",
          color: T.burgundy,
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderBottom: open ? `1px solid ${T.stone}` : "none",
        }}
      >
        {title}
        <ChevronDown
          size={20}
          style={{
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            color: T.goldText,
            flexShrink: 0,
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 600 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <ul
          style={{
            padding: "16px 24px 20px 44px",
            margin: 0,
            listStyleType: "disc",
          }}
        >
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: T.charcoal,
                fontFamily: "'Source Sans 3', sans-serif",
                paddingBottom: 4,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Confession Step ── */
function ConfessionStep({ number, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          minWidth: 32,
          height: 32,
          borderRadius: "50%",
          background: T.gold,
          color: T.softBlack,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 14,
          fontFamily: "'Source Sans 3', sans-serif",
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: T.charcoal,
          margin: 0,
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        {text}
      </p>
    </div>
  );
}

export default function MassTimes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: schedule } = useSchedule();
  const { sundayMass, dailyMass, confession, adoration } = schedule;

  const examineItems = useCallback(
    (key) => {
      const items = t(`massTimes.examine.${key}.items`, { returnObjects: true });
      return Array.isArray(items) ? items : [];
    },
    [t]
  );

  const holyDays = t("massTimes.holyDays.days", { returnObjects: true });

  return (
    <div>
      <Seo
        title={t("massTimes.title")}
        description="Sunday and daily Mass schedule, Confession times, Examination of Conscience, and Eucharistic Adoration at St. Dominic Church, Youngstown OH."
        image={PHOTOS.homeHero}
        schema={buildMassTimesSchema(schedule, CONFIG.siteUrl)}
      />

      {/* ════ Section 1: Hero Banner ════ */}
      <section
        style={{
          position: "relative",
          height: "clamp(340px, 50vh, 480px)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 76,
        }}
      >
        <HeroImage
          src={PHOTOS.archSanctuary}
          overlay={0.55}
          tint="rgba(107,29,42,0.7)"
          position="center 40%"
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: T.goldLight,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            {t("massTimes.hero.sub")}
          </div>
          <h1
            style={{
              fontSize: "clamp(30px, 5.5vw, 48px)",
              color: "#fff",
              fontWeight: 600,
              fontFamily: "'Cormorant Garamond', serif",
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            {t("massTimes.title")}
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 2vw, 17px)",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {t("massTimes.hero.desc")}
          </p>
        </div>
      </section>

      <Section bg={T.cream} style={{ padding: "clamp(32px, 6vw, 52px) 24px" }}>
        <PastoralActionPanel
          eyebrow={t("massTimes.visitor.sub")}
          title={t("massTimes.visitor.title")}
          description={t("massTimes.visitor.desc")}
          primaryLabel={t("massTimes.visitor.visit")}
          primaryTo="/visit"
          secondaryLabel={t("massTimes.visitor.contact")}
          secondaryHref={CONFIG.phoneLink}
        />
      </Section>

      {/* ════ Section 2: Mass Schedule ════ */}
      <Section>
        <FadeSection>
          <SectionTitle sub={t("massTimes.mass.sub")}>
            {t("massTimes.mass.title")}
          </SectionTitle>
          <Quote
            text={t("massTimes.mass.quote")}
            src={t("massTimes.mass.quoteSrc")}
          />
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 40px",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {t("massTimes.mass.desc")}
          </p>
          <p
            style={{
              fontSize: 13,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 680,
              margin: "-24px auto 36px",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {t("massTimes.reviewed")}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 28,
            }}
          >
            <ScheduleCard
              title={t("massTimes.mass.sundayTitle")}
              rows={sundayMass}
              accent={T.burgundy}
              t={t}
            />
            <ScheduleCard
              title={t("massTimes.mass.dailyTitle")}
              rows={dailyMass}
              accent={T.burgundy}
              t={t}
            />
          </div>
        </FadeSection>
      </Section>

      {/* ════ Section 3: Parallax — St. Thomas Aquinas ════ */}
      <ParallaxSection image={PHOTOS.dominicanCharism} overlay={0.55}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            {t("massTimes.parallax1.quote")}
          </p>
          <span
            style={{
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: T.goldLight,
            }}
          >
            {t("massTimes.parallax1.src")}
          </span>
        </div>
      </ParallaxSection>

      {/* ════ Section 4: Confession ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <SectionTitle sub={t("massTimes.confession.sub")}>
            {t("massTimes.confession.title")}
          </SectionTitle>
          <Quote
            text={t("massTimes.confession.quote")}
            src={t("massTimes.confession.quoteSrc")}
          />
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 40px",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {t("massTimes.confession.desc")}
          </p>

          {/* Confession schedule card */}
          <div style={{ maxWidth: 480, margin: "0 auto 48px" }}>
            <ScheduleCard
              title={t("massTimes.confession.title")}
              rows={confession}
              accent={T.gold}
              t={t}
            />
          </div>

          {/* How to Go to Confession */}
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto",
              background: "#fff",
              borderRadius: 8,
              padding: "36px 32px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                fontSize: 22,
                fontFamily: "'Cormorant Garamond', serif",
                color: T.softBlack,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {t("massTimes.confession.howToTitle")}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: T.warmGray,
                textAlign: "center",
                marginBottom: 28,
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              {t("massTimes.confession.howToDesc")}
            </p>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <ConfessionStep
                key={n}
                number={n}
                text={t(`massTimes.confession.step${n}`)}
              />
            ))}
          </div>
        </FadeSection>
      </Section>

      {/* ════ Section 5: Examination of Conscience ════ */}
      <Section>
        <FadeSection>
          <SectionTitle sub={t("massTimes.examine.sub")}>
            {t("massTimes.examine.title")}
          </SectionTitle>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 36px",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {t("massTimes.examine.desc")}
          </p>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <AccordionItem
              title={t("massTimes.examine.god.title")}
              items={examineItems("god")}
              defaultOpen
            />
            <AccordionItem
              title={t("massTimes.examine.others.title")}
              items={examineItems("others")}
            />
            <AccordionItem
              title={t("massTimes.examine.self.title")}
              items={examineItems("self")}
            />
            <p
              style={{
                fontSize: 12,
                color: T.warmGray,
                textAlign: "center",
                marginTop: 20,
                fontStyle: "italic",
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              {t("massTimes.examine.source")}
            </p>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Section 6: Parallax — Pope Francis ════ */}
      <ParallaxSection image={PHOTOS.archSideAisle} overlay={0.55}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontStyle: "italic",
              color: "#fff",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            {t("massTimes.parallax2.quote")}
          </p>
          <span
            style={{
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: T.goldLight,
            }}
          >
            {t("massTimes.parallax2.src")}
          </span>
        </div>
      </ParallaxSection>

      {/* ════ Section 7: Adoration & Devotions ════ */}
      <Section bg={T.cream}>
        <FadeSection>
          <SectionTitle sub={t("massTimes.adoration.sub")}>
            {t("massTimes.adoration.title")}
          </SectionTitle>
          <Quote
            text={t("massTimes.adoration.quote")}
            src={t("massTimes.adoration.quoteSrc")}
          />
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 40px",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {t("massTimes.adoration.desc")}
          </p>
        </FadeSection>

        {/* Monstrance ScaleReveal */}
        <ScaleReveal
          src={PHOTOS.monstrance}
          alt="Gold monstrance with the Blessed Sacrament exposed for Eucharistic Adoration"
          maxWidth={900}
        />

        <FadeSection>
          {/* Adoration schedule + devotions */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 28,
              marginTop: 40,
            }}
          >
            <ScheduleCard
              title={t("massTimes.adoration.title")}
              rows={adoration}
              accent={T.gold}
              t={t}
            />
            <div
              style={{
                background: "#fff",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ height: 4, background: T.burgundy }} />
              <div style={{ padding: 28 }}>
                <h3
                  style={{
                    fontSize: 20,
                    fontFamily: "'Cormorant Garamond', serif",
                    marginBottom: 16,
                    color: T.softBlack,
                  }}
                >
                  {t("massTimes.adoration.devotions")}
                </h3>
                {["rosary", "divineMercy", "eveningPrayer"].map((key, i) => (
                  <div
                    key={key}
                    style={{
                      padding: "10px 0",
                      borderBottom:
                        i < 2 ? `1px solid ${T.stone}` : "none",
                      fontSize: 15,
                      color: T.charcoal,
                    }}
                  >
                    {t(`massTimes.adoration.${key}`)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Section 8: Holy Days of Obligation ════ */}
      <Section>
        <FadeSection>
          <SectionTitle sub={t("massTimes.holyDays.sub")}>
            {t("massTimes.holyDays.title")}
          </SectionTitle>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: T.warmGray,
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto 12px",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {t("massTimes.holyDays.desc")}
          </p>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: T.burgundy,
              textAlign: "center",
              marginBottom: 32,
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {t("massTimes.holyDays.schedule")}
          </p>
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              background: "#fff",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ height: 4, background: T.gold }} />
            <div style={{ padding: "24px 32px" }}>
              {Array.isArray(holyDays) &&
                holyDays.map((day, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 0",
                      borderBottom:
                        i < holyDays.length - 1
                          ? `1px solid ${T.stone}`
                          : "none",
                      fontSize: 15,
                      color: T.charcoal,
                      fontFamily: "'Source Sans 3', sans-serif",
                    }}
                  >
                    {day}
                  </div>
                ))}
            </div>
          </div>
        </FadeSection>
      </Section>

      {/* ════ Section 9: Closing CTA ════ */}
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
            <SectionTitle sub={t("massTimes.hero.sub")} light divider={false}>
              {t("massTimes.cta.title")}
            </SectionTitle>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 32,
              }}
            >
              {t("massTimes.cta.desc")}
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Btn variant="gold" onClick={() => navigate("/visit")}>
                {t("massTimes.cta.visit")}
              </Btn>
              <Btn variant="light" onClick={() => navigate("/contact")}>
                {t("massTimes.cta.contact")}
              </Btn>
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}
