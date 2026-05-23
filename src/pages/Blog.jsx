import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { PHOTOS } from "../constants/photos";
import { Section, SectionTitle } from "../components/Section";
import FadeSection from "../components/FadeSection";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import PremiumPageActions from "../components/PremiumPageActions";
import BlogCard from "../components/blog/BlogCard";
import { BLOG_CATEGORIES } from "../data/blog";
import { useBlogPosts } from "../cms/hooks";

const POSTS_PER_PAGE = 9;
const FILTERS = ["all", ...Object.keys(BLOG_CATEGORIES)];

export default function Blog() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === "es";
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const { data: blogPosts } = useBlogPosts();
  const published = blogPosts.filter((p) => p.published);
  const featured = published.find((p) => p.featured);

  const filtered = useMemo(() => {
    let list = published;
    if (filter !== "all") list = list.filter((p) => p.category === filter);
    if (search.trim().length >= 2) {
      const q = search.toLowerCase();
      list = list.filter((p) => {
        const title = (isEs && p.titleEs ? p.titleEs : p.title).toLowerCase();
        const excerpt = (isEs && p.excerptEs ? p.excerptEs : p.excerpt).toLowerCase();
        const tags = p.tags.join(" ").toLowerCase();
        return title.includes(q) || excerpt.includes(q) || tags.includes(q);
      });
    }
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filter, search, isEs, published]);

  // Non-featured posts for the grid
  const gridPosts = filtered.filter((p) => !p.featured || filter !== "all" || search.trim().length >= 2);
  const visiblePosts = gridPosts.slice(0, visibleCount);
  const hasMore = visibleCount < gridPosts.length;

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Blog & Reflections"
        description="Homilies, Dominican spirituality, parish news, and theological reflections from the friars of St. Dominic Catholic Church."
        image={PHOTOS.homeHero}
      />

      {/* ════ Hero ════ */}
      <div
        className="animated-gradient"
        style={{
          padding: "clamp(48px, 8vh, 80px) 24px clamp(40px, 6vh, 64px)",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <FadeSection>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
              color: T.goldText,
              marginBottom: 14,
            }}
          >
            {t("blog.hero.sub")}
          </div>
          <h1
            style={{
              fontSize: "clamp(34px, 6vw, 56px)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 14,
            }}
          >
            {t("blog.title")}
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {t("blog.hero.desc")}
          </p>
        </FadeSection>
      </div>

      <PremiumPageActions
        overlap
        eyebrow={t("blog.hero.sub")}
        title={t("blog.title")}
        items={[
          {
            title: t("blog.filterAll"),
            description: t("blog.hero.desc"),
            href: "#posts",
            icon: "BookOpenText",
            primary: true,
          },
          {
            title: t("nav.faithFormation"),
            description: t("faithFormation.resources.desc"),
            to: "/faith-formation",
            icon: "BookOpen",
          },
          {
            title: t("nav.bulletin"),
            description: t("bulletin.hero.desc"),
            to: "/bulletin",
            icon: "Newspaper",
          },
        ]}
      />

      {/* ════ Featured Post ════ */}
      {featured && filter === "all" && search.trim().length < 2 && (
        <Section bg={T.warmWhite}>
          <FadeSection>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                fontWeight: 700,
                color: T.goldText,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {t("blog.featured")}
            </div>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <BlogCard post={featured} featured />
            </div>
          </FadeSection>
        </Section>
      )}

      {/* ════ Filter & Search ════ */}
      <div
        style={{
          position: "sticky",
          top: 64,
          zIndex: 100,
          background: "rgba(255,253,249,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${T.stone}`,
          padding: "14px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1 }}>
            {FILTERS.map((f) => {
              const cat = BLOG_CATEGORIES[f];
              const label = f === "all"
                ? t("blog.filterAll")
                : isEs ? cat?.labelEs : cat?.label;
              return (
                <button
                  key={f}
                  className={`filter-btn${filter === f ? " active" : ""}`}
                  onClick={() => { setFilter(f); setVisibleCount(POSTS_PER_PAGE); }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(POSTS_PER_PAGE); }}
            placeholder={isEs ? "Buscar..." : "Search posts..."}
            aria-label="Search blog posts"
            style={{
              border: `1px solid ${T.stone}`,
              borderRadius: 4,
              padding: "7px 12px",
              fontSize: 13,
              fontFamily: "'Source Sans 3', sans-serif",
              width: 180,
              background: "transparent",
              color: T.charcoal,
              outline: "none",
            }}
          />
        </div>
      </div>

      <style>{`
        .filter-btn {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid ${T.stone};
          background: #fff;
          font-size: 11px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          color: ${T.warmGray};
        }
        .filter-btn:hover { border-color: ${T.burgundy}; color: ${T.burgundy}; }
        .filter-btn.active { background: ${T.burgundy}; border-color: ${T.burgundy}; color: #fff; }
      `}</style>

      {/* ════ Post Grid ════ */}
      <Section id="posts" bg={T.cream}>
        <FadeSection>
          {visiblePosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", color: T.warmGray }}>
              <Icon name="FileText" size={48} color={T.stone} />
              <p style={{ marginTop: 16, fontSize: 16 }}>{t("blog.noResults")}</p>
            </div>
          ) : (
            <>
              <div
                className="stagger-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 28,
                  maxWidth: 1100,
                  margin: "0 auto",
                }}
              >
                {visiblePosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {hasMore && (
                <div style={{ textAlign: "center", marginTop: 44 }}>
                  <button
                    onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
                    className="btn-hover"
                    style={{
                      padding: "12px 32px",
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: "'Source Sans 3', sans-serif",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: T.burgundy,
                      background: "none",
                      border: `2px solid ${T.burgundy}`,
                      borderRadius: 3,
                      cursor: "pointer",
                    }}
                  >
                    {t("blog.loadMore")}
                  </button>
                </div>
              )}
            </>
          )}
        </FadeSection>
      </Section>
    </div>
  );
}
