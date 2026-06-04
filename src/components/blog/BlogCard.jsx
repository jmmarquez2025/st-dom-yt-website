import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { T } from "../../constants/theme";
import { BLOG_CATEGORIES } from "../../data/blog";
import { friars, staff, initials } from "../../data/staff";
import { estimateReadingTime, formatBlogDate } from "../../utils/blogUtils";
import Icon from "../Icon";

const allPeople = [...friars, ...staff];

export default function BlogCard({ post, featured = false }) {
  const { i18n } = useTranslation();
  const isEs = i18n.language === "es";
  const cat = BLOG_CATEGORIES[post.category] || {};
  const author = allPeople.find((p) => p.id === post.author);
  const readTime = estimateReadingTime(isEs ? post.bodyEs : post.body);
  const title = isEs && post.titleEs ? post.titleEs : post.title;
  const excerpt = isEs && post.excerptEs ? post.excerptEs : post.excerpt;
  const dateStr = formatBlogDate(post.date, i18n.language);

  if (featured) {
    return (
      <Link
        to={`/blog/${post.id}`}
        className="glass-card hover-lift"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          textDecoration: "none",
          color: "inherit",
          overflow: "hidden",
          minHeight: 340,
        }}
      >
        <div
          style={{
            backgroundImage: post.heroImage ? `url(${post.heroImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 260,
          }}
        />
        <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span
            className="chip chip--dynamic"
            style={{
              "--chip-color": cat.color,
              alignSelf: "flex-start",
              marginBottom: 12,
            }}
          >
            <Icon name={cat.icon} size={12} color={cat.color} />
            {isEs ? cat.labelEs : cat.label}
          </span>
          <h2
            style={{
              fontSize: "clamp(22px, 3vw, 28px)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              color: T.softBlack,
              lineHeight: 1.25,
              marginBottom: 12,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: T.warmGray,
              marginBottom: 16,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
          <AuthorRow author={author} dateStr={dateStr} readTime={readTime} isEs={isEs} />
        </div>

        <style>{`
          @media (max-width: 768px) {
            .glass-card[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${post.id}`}
      className="glass-card hover-lift"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
      }}
    >
      {post.heroImage && (
        <div
          style={{
            height: 200,
            backgroundImage: `url(${post.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div style={{ padding: "20px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <span
          className="chip chip--dynamic"
          style={{ "--chip-color": cat.color, alignSelf: "flex-start", marginBottom: 8 }}
        >
          <Icon name={cat.icon} size={12} color={cat.color} />
          {isEs ? cat.labelEs : cat.label}
        </span>
        <h3
          style={{
            fontSize: 20,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            color: T.softBlack,
            lineHeight: 1.3,
            marginBottom: 8,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: T.warmGray,
            flex: 1,
            marginBottom: 16,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {excerpt}
        </p>
        <AuthorRow author={author} dateStr={dateStr} readTime={readTime} isEs={isEs} />
      </div>
    </Link>
  );
}

function AuthorRow({ author, dateStr, readTime, isEs }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: T.warmGray }}>
      {author?.photo ? (
        <img
          src={author.photo}
          alt=""
          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: T.burgundy,
            color: T.goldLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {author ? initials(author.name) : "SD"}
        </div>
      )}
      <div style={{ lineHeight: 1.3 }}>
        <div style={{ fontWeight: 600, color: T.charcoal, fontSize: 13 }}>
          {author?.name || "St. Dominic Church"}
        </div>
        <div style={{ fontSize: 12, color: T.warmGray }}>
          {dateStr} · {readTime} {isEs ? "min lectura" : "min read"}
        </div>
      </div>
    </div>
  );
}
