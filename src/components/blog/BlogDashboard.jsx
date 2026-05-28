import { useState, useMemo } from "react";
import { T } from "../../constants/theme";
import { BLOG_CATEGORIES } from "../../data/blog";
import { getDeletedBlogIds, removeDeletedBlogId } from "../../cms/client";
import { useAdminSyncSignal } from "../../cms/hooks";
import Icon from "../Icon";

/* ──────────────────────────────────────────────────────────
 *  BlogDashboard — Post management list for the staff area.
 *  Shows all posts (published + drafts) with status badges,
 *  category chips, and edit / new post actions.
 * ────────────────────────────────────────────────────────── */

const AUTHORS_MAP = {
  "frassati-davis": "Fr. Frassati Davis, O.P.",
  "charles-rooney": "Fr. Charles Marie Rooney, O.P.",
};

function StatusBadge({ published, featured }) {
  if (published && featured) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 10px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          background: `${T.gold}20`,
          color: "#8B7328",
          borderRadius: 20,
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold }} />
        Featured
      </span>
    );
  }
  if (published) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 10px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          background: "#E8F5E9",
          color: "#2E7D32",
          borderRadius: 20,
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF50" }} />
        Published
      </span>
    );
  }
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        background: "#FFF8E1",
        color: "#F57F17",
        borderRadius: 20,
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFB300" }} />
      Draft
    </span>
  );
}

function CategoryChip({ category }) {
  const cat = BLOG_CATEGORIES[category];
  if (!cat) return null;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        color: cat.color,
        background: `${cat.color}12`,
        padding: "2px 8px",
        borderRadius: 4,
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      {cat.label}
    </span>
  );
}

function RecentlyDeletedPanel() {
  const syncVersion = useAdminSyncSignal();
  // eslint-disable-next-line no-unused-vars
  const _ = syncVersion; // re-render whenever the sync signal bumps
  const ids = getDeletedBlogIds();
  if (ids.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 16,
        padding: "16px 20px",
        background: T.warmWhite,
        borderRadius: 10,
        border: `1px solid ${T.stone}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Icon name="Newspaper" size={16} color={T.warmGray} />
        <strong
          style={{
            fontSize: 13,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: T.warmGray,
            fontFamily: "'Source Sans 3', sans-serif",
          }}
        >
          Recently Deleted ({ids.length})
        </strong>
      </div>
      <p
        style={{
          fontSize: 12.5,
          color: T.warmGray,
          margin: "0 0 12px 0",
          lineHeight: 1.5,
        }}
      >
        Restore brings the post back in this browser. CMS posts will reappear after the next fetch; static posts come back immediately.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {ids.map((id) => (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "8px 12px",
              background: T.cream,
              borderRadius: 6,
              border: `1px solid ${T.stone}`,
            }}
          >
            <code
              style={{
                fontSize: 12,
                color: T.charcoal,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {id}
            </code>
            <button
              type="button"
              onClick={() => removeDeletedBlogId(id)}
              style={{
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                background: "transparent",
                color: T.burgundy,
                border: `1.5px solid ${T.burgundy}`,
                borderRadius: 4,
                cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif",
                flexShrink: 0,
              }}
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BlogDashboard({ posts, onNew, onEdit, loading }) {
  const [filter, setFilter] = useState("all"); // "all" | "published" | "draft"
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = posts || [];
    if (filter === "published") list = list.filter((p) => p.published);
    if (filter === "draft") list = list.filter((p) => !p.published);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.author?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, filter, search]);

  const counts = useMemo(() => {
    const all = posts || [];
    return {
      all: all.length,
      published: all.filter((p) => p.published).length,
      draft: all.filter((p) => !p.published).length,
    };
  }, [posts]);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 28,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              color: T.softBlack,
              margin: 0,
            }}
          >
            Blog Dashboard
          </h2>
          <p
            style={{
              fontSize: 14,
              color: T.warmGray,
              marginTop: 4,
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {counts.published} published &middot; {counts.draft} draft
          </p>
        </div>
        <button
          type="button"
          onClick={onNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            background: T.burgundy,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "'Source Sans 3', sans-serif",
            transition: "opacity 0.2s",
          }}
        >
          <Icon name="BookOpen" size={16} color="#fff" />
          New Post
        </button>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            background: T.cream,
            borderRadius: 8,
            border: `1px solid ${T.stone}`,
            overflow: "hidden",
          }}
        >
          {[
            { key: "all", label: `All (${counts.all})` },
            { key: "published", label: `Published (${counts.published})` },
            { key: "draft", label: `Drafts (${counts.draft})` },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              style={{
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
                background: filter === f.key ? T.burgundy : "transparent",
                color: filter === f.key ? "#fff" : T.warmGray,
                border: "none",
                cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            style={{
              width: "100%",
              padding: "8px 14px",
              fontSize: 13,
              border: `1.5px solid ${T.stone}`,
              borderRadius: 8,
              outline: "none",
              fontFamily: "'Source Sans 3', sans-serif",
              color: T.charcoal,
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = T.gold)}
            onBlur={(e) => (e.target.style.borderColor = T.stone)}
          />
        </div>
      </div>

      {/* ── Post List ── */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: T.warmGray,
            fontSize: 15,
          }}
        >
          Loading posts...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            background: T.warmWhite,
            borderRadius: 12,
            border: `1px solid ${T.stone}`,
          }}
        >
          <Icon name="Newspaper" size={40} color={T.stone} style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 16, color: T.warmGray, marginBottom: 8 }}>
            {search ? "No posts match your search." : "No posts yet."}
          </p>
          <p style={{ fontSize: 14, color: T.warmGray }}>
            Click <strong>New Post</strong> to write your first article.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => onEdit(post)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                background: T.warmWhite,
                border: `1px solid ${T.stone}`,
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "border-color 0.15s, box-shadow 0.15s",
                fontFamily: "'Source Sans 3', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.gold;
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.stone;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Hero thumbnail */}
              {post.heroImage ? (
                <img
                  src={post.heroImage}
                  alt=""
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                    borderRadius: 8,
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    background: T.cream,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="Newspaper" size={20} color={T.stone} />
                </div>
              )}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                    flexWrap: "wrap",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: T.softBlack,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.title || "Untitled"}
                  </h3>
                  <StatusBadge published={post.published} featured={post.featured} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 12,
                    color: T.warmGray,
                    flexWrap: "wrap",
                  }}
                >
                  <span>{AUTHORS_MAP[post.author] || post.author}</span>
                  <span>&middot;</span>
                  <span>{post.date}</span>
                  <CategoryChip category={post.category} />
                </div>
              </div>

              {/* Arrow */}
              <Icon name="BookOpenText" size={16} color={T.warmGray} style={{ flexShrink: 0, opacity: 0.5 }} />
            </button>
          ))}
        </div>
      )}

      {/* ── Quick Tip ── */}
      <div
        style={{
          marginTop: 32,
          padding: "16px 20px",
          background: T.cream,
          borderRadius: 10,
          border: `1px solid ${T.stone}`,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <Icon name="Sparkles" size={18} color={T.gold} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: T.warmGray, lineHeight: 1.7 }}>
          <strong style={{ color: T.charcoal }}>Tip:</strong> You can write directly in the editor
          or link a Google Doc. Changes to linked Google Docs appear automatically within 5 minutes.
          Click any post above to edit it.
        </div>
      </div>

      {/* ── Recently deleted (tombstones) ── */}
      <RecentlyDeletedPanel />
    </div>
  );
}
