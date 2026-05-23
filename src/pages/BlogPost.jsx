import { useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { Section, SectionTitle } from "../components/Section";
import FadeSection from "../components/FadeSection";
import ParallaxSection from "../components/ParallaxSection";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import PremiumPageActions from "../components/PremiumPageActions";
import BlogBody from "../components/blog/BlogBody";
import BlogToc from "../components/blog/BlogToc";
import BlogAuthorCard from "../components/blog/BlogAuthorCard";
import BlogShare from "../components/blog/BlogShare";
import BlogPrevNext from "../components/blog/BlogPrevNext";
import BlogCard from "../components/blog/BlogCard";
import BlogReadingProgress from "../components/blog/BlogReadingProgress";
import { BLOG_CATEGORIES } from "../data/blog";
import { friars, staff } from "../data/staff";
import { estimateReadingTime, formatBlogDate, getRelatedPosts } from "../utils/blogUtils";
import { CONFIG } from "../constants/config";
import { useBlogPosts } from "../cms/hooks";

const allPeople = [...friars, ...staff];

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === "es";
  const articleRef = useRef(null);

  const { data: blogPosts } = useBlogPosts();
  const published = blogPosts.filter((p) => p.published);
  const postIndex = published.findIndex((p) => p.id === slug);
  const post = published[postIndex];

  if (!post) return <Navigate to="/blog" replace />;

  const title = isEs && post.titleEs ? post.titleEs : post.title;
  const body = isEs && post.bodyEs ? post.bodyEs : post.body;
  const cat = BLOG_CATEGORIES[post.category] || {};
  const author = allPeople.find((p) => p.id === post.author);
  const readTime = estimateReadingTime(body);
  const dateStr = formatBlogDate(post.date, i18n.language);
  const related = getRelatedPosts(post, published, 3);
  const prev = postIndex < published.length - 1 ? published[postIndex + 1] : null;
  const next = postIndex > 0 ? published[postIndex - 1] : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.heroImage
      ? `${CONFIG.siteUrl}${post.heroImage}`
      : undefined,
    author: author
      ? { "@type": "Person", name: author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "St. Dominic Catholic Church",
    },
  };

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title={post.title}
        description={post.excerpt}
        image={post.heroImage}
        schema={articleSchema}
      />
      <BlogReadingProgress containerRef={articleRef} />

      {/* ════ Hero ════ */}
      <ParallaxSection
        image={post.heroImage}
        height="clamp(300px, 50vh, 480px)"
        overlay={0.55}
        position="center 40%"
      >
        <div style={{ textAlign: "center", maxWidth: 760, padding: "0 24px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#fff",
              background: `${cat.color || T.burgundy}60`,
              backdropFilter: "blur(6px)",
              padding: "4px 14px",
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            <Icon name={cat.icon || "FileText"} size={12} color="#fff" />
            {isEs ? cat.labelEs : cat.label}
          </span>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: 18,
            }}
          >
            {title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
              flexWrap: "wrap",
            }}
          >
            {author && (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {author.photo && (
                  <img
                    src={author.photo}
                    alt={author.name}
                    style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }}
                  />
                )}
                {author.name}
              </span>
            )}
            <span>{dateStr}</span>
            <span>{readTime} {isEs ? "min lectura" : "min read"}</span>
          </div>
        </div>
      </ParallaxSection>

      <PremiumPageActions
        overlap
        eyebrow={t("blog.relatedSub")}
        title={title}
        items={[
          {
            title: t("blog.postActions.readArticle"),
            description: isEs && post.excerptEs ? post.excerptEs : post.excerpt,
            href: "#article",
            icon: cat.icon || "BookOpenText",
            primary: true,
          },
          {
            title: t("blog.postActions.allPosts"),
            description: t("blog.hero.desc"),
            to: "/blog",
            icon: "BookOpenText",
          },
          {
            title: t("nav.faithFormation"),
            description: t("faithFormation.resources.desc"),
            to: "/faith-formation",
            icon: "BookOpen",
          },
        ]}
      />

      {/* ════ Article ════ */}
      <Section id="article" bg={T.warmWhite}>
        <div
          style={{
            display: "flex",
            gap: 48,
            maxWidth: 1060,
            margin: "0 auto",
            justifyContent: "center",
          }}
        >
          {/* Main article column */}
          <article
            ref={articleRef}
            style={{
              flex: "0 1 720px",
              maxWidth: 720,
              minWidth: 0,
            }}
          >
            {/* Mobile TOC — hidden on desktop via CSS */}
            <BlogToc
              blocks={body}
              label={t("blog.toc")}
              variant="mobile"
            />

            <BlogBody blocks={body} />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: T.cream,
                      color: T.warmGray,
                      border: `1px solid ${T.stone}`,
                      fontFamily: "'Source Sans 3', sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <BlogShare title={title} />
            <BlogAuthorCard authorId={post.author} />
            <BlogPrevNext prev={prev} next={next} />
          </article>

          {/* Desktop TOC sidebar — hidden on mobile via CSS */}
          <div className="blog-toc-sidebar">
            <BlogToc blocks={body} label={t("blog.toc")} variant="desktop" />
          </div>
        </div>
      </Section>

      {/* ════ Related Posts ════ */}
      {related.length > 0 && (
        <Section bg={T.cream}>
          <FadeSection>
            <SectionTitle sub={t("blog.relatedSub")}>
              {t("blog.relatedTitle")}
            </SectionTitle>
            <div
              className="stagger-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 28,
                maxWidth: 1000,
                margin: "0 auto",
              }}
            >
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </FadeSection>
        </Section>
      )}
    </div>
  );
}
