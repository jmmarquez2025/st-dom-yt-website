import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { T } from "../constants/theme";
import { Section, SectionTitle } from "../components/Section";
import FadeSection from "../components/FadeSection";
import PageHeader from "../components/PageHeader";
import DominicanDivider from "../components/DominicanDivider";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import { PHOTOS } from "../constants/photos";
import { useBlogPosts } from "../cms/hooks";
import { submitBlogPost, deleteBlogPost } from "../cms/client";
import { save as saveAnnouncement, remove as removeAnnouncement } from "../announcements/store";
import { useAllAnnouncements } from "../announcements/useAnnouncements";

// Each dashboard is loaded the first time its tab is opened, so admins
// who only edit one section don't pay for the other eight.
const BlogDashboard = lazy(() => import("../components/blog/BlogDashboard"));
const BlogComposer = lazy(() => import("../components/blog/BlogComposer"));
const AnnouncementDashboard = lazy(() => import("../announcements/AnnouncementDashboard"));
const AnnouncementComposer = lazy(() => import("../announcements/AnnouncementComposer"));
const BulletinDashboard = lazy(() => import("../bulletins/BulletinDashboard"));
const EventDashboard = lazy(() => import("../events/EventDashboard"));
const ScheduleDashboard = lazy(() => import("../schedule-admin/ScheduleDashboard"));
const StaffDirectoryDashboard = lazy(() => import("../staff-admin/StaffDirectoryDashboard"));
const MinistriesDashboard = lazy(() => import("../ministries-admin/MinistriesDashboard"));
const SettingsDashboard = lazy(() => import("../settings/SettingsDashboard"));
const DataHelpDashboard = lazy(() => import("../admin/DataHelpDashboard"));
import {
  Megaphone,
  BookOpen as BlogIcon,
  Newspaper,
  Calendar,
  Clock,
  Users,
  HandHeart,
  Settings,
  LifeBuoy,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
 *  WritersGuide — Staff-only management dashboard.
 *
 *  Passphrase gate → Section tabs (Blog | Announcements)
 *
 *  Blog: create/edit posts via built-in editor or Google Doc link
 *  Announcements: create/schedule header banners and popup cards
 * ────────────────────────────────────────────────────────── */

const STORAGE_KEY = "stdom_staff_auth";
const TOKEN_KEY = "stdom_staff_token";
// Soft gate, not auth — the value lives in the client bundle either way.
// Override per-deployment via VITE_STAFF_PASSPHRASE; the default is "veritas"
// (the Dominican motto) to match what's documented in docs/admin-guide.md.
const PASSPHRASE = (import.meta.env.VITE_STAFF_PASSPHRASE || "veritas").toLowerCase();

// ── Passphrase Gate ──
function PassphraseGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === PASSPHRASE) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo title="Staff Area" description="" />
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: T.warmWhite,
          padding: 24,
        }}
      >
        <form
          onSubmit={handleUnlock}
          style={{
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            padding: 48,
            background: "#fff",
            borderRadius: 12,
            border: `1px solid ${T.stone}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `${T.burgundy}10`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Icon name="Shield" size={28} color={T.burgundy} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              color: T.softBlack,
              marginBottom: 8,
            }}
          >
            Staff Dashboard
          </h1>
          <p
            style={{
              fontSize: 14,
              color: T.warmGray,
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            This page is for parish staff and friars.
            <br />
            Enter the passphrase to continue.
          </p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Passphrase"
            aria-label="Staff passphrase"
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 15,
              border: `1.5px solid ${error ? "#c0392b" : T.stone}`,
              borderRadius: 6,
              outline: "none",
              fontFamily: "'Source Sans 3', sans-serif",
              textAlign: "center",
              letterSpacing: 2,
              transition: "border-color 0.2s",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              if (!error) e.target.style.borderColor = T.gold;
            }}
            onBlur={(e) => {
              if (!error) e.target.style.borderColor = T.stone;
            }}
            autoFocus
          />
          {error && (
            <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>
              Incorrect passphrase. Please try again.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              background: T.burgundy,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard tab loader (shown while a tab's chunk fetches) ──
function DashboardLoader() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}
    >
      <div
        className="skeleton-block"
        style={{ width: "min(640px, 100%)", height: 220, borderRadius: 10 }}
      />
    </div>
  );
}

// ── Success Toast ──
function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 24px",
        background: type === "error" ? "#c0392b" : "#2E7D32",
        color: "#fff",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "'Source Sans 3', sans-serif",
        animation: "fadeInUp 0.3s ease",
      }}
      role="status"
      aria-live="polite"
    >
      <Icon
        name={type === "error" ? "Flame" : "Sparkles"}
        size={18}
        color="#fff"
      />
      {message}
    </div>
  );
}

// ── Section Tab Bar ──
function SectionTabs({ active, onChange }) {
  const tabs = [
    { key: "blog", label: "Blog", Icon: BlogIcon },
    { key: "announcements", label: "Announcements", Icon: Megaphone },
    { key: "bulletins", label: "Bulletins", Icon: Newspaper },
    { key: "events", label: "Events", Icon: Calendar },
    { key: "schedule", label: "Mass Schedule", Icon: Clock },
    { key: "staff", label: "Staff", Icon: Users },
    { key: "ministries", label: "Ministries", Icon: HandHeart },
    { key: "settings", label: "Settings", Icon: Settings },
    { key: "data", label: "Data & Help", Icon: LifeBuoy },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderBottom: `1px solid ${T.stone}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          gap: 0,
          flexWrap: "wrap",
          overflowX: "auto",
        }}
      >
        {tabs.map(({ key, label, Icon: TabIcon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 20px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${isActive ? T.burgundy : "transparent"}`,
                color: isActive ? T.burgundy : T.warmGray,
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "'Source Sans 3', sans-serif",
                cursor: "pointer",
                transition: "all 0.15s",
                marginBottom: -1, // overlap the border-bottom of the container
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = T.charcoal;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = T.warmGray;
              }}
            >
              <TabIcon size={15} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Staff Dashboard ──
export default function WritersGuide() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const handleUnlock = useCallback(() => {
    setAuthed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      sessionStorage.setItem(TOKEN_KEY, PASSPHRASE);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    try {
      if (!sessionStorage.getItem(TOKEN_KEY)) {
        sessionStorage.setItem(TOKEN_KEY, PASSPHRASE);
      }
    } catch {
      /* ignore */
    }
  }, [authed]);

  if (!authed) {
    return <PassphraseGate onUnlock={handleUnlock} />;
  }

  return <StaffDashboard />;
}

const HINT_DISMISSED_KEY = "stdom_staff_welcome_hint_dismissed";

function WelcomeHint({ onGoToData, onDismiss }) {
  return (
    <div
      style={{
        background: `${T.gold}18`,
        borderBottom: `1px solid ${T.gold}55`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        <span style={{ fontSize: 20 }}>👋</span>
        <div style={{ flex: 1, minWidth: 240, fontSize: 13.5, color: T.charcoal, lineHeight: 1.5 }}>
          <strong>New here?</strong> Changes save to this browser only.
          Visit <strong>Data & Help</strong> to learn how to back up your work
          or move it between computers.
        </div>
        <button
          onClick={onGoToData}
          style={{
            padding: "7px 14px",
            background: T.burgundy,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Source Sans 3', sans-serif",
          }}
        >
          Open Data & Help
        </button>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            color: T.warmGray,
            fontSize: 18,
            cursor: "pointer",
            padding: "4px 8px",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function StaffDashboard() {
  // Top-level section: "blog" | "announcements"
  const [section, setSection] = useState("blog");
  const [hintDismissed, setHintDismissed] = useState(() => {
    try {
      return localStorage.getItem(HINT_DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  const dismissHint = useCallback(() => {
    setHintDismissed(true);
    try { localStorage.setItem(HINT_DISMISSED_KEY, "1"); } catch { /* ignore */ }
  }, []);

  // Blog state
  const { data: blogPosts, loading, refresh: refreshBlog } = useBlogPosts();
  const [blogView, setBlogView] = useState("dashboard"); // "dashboard" | "compose"
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);

  // Announcements state
  const { refresh: refreshAnnouncements } = useAllAnnouncements();
  const [annView, setAnnView] = useState("dashboard"); // "dashboard" | "compose"
  const [editingAnn, setEditingAnn] = useState(null);

  const [toast, setToast] = useState(null);

  // ── Section switch resets child views ──
  const handleSectionChange = useCallback((s) => {
    setSection(s);
    setBlogView("dashboard");
    setEditingPost(null);
    setAnnView("dashboard");
    setEditingAnn(null);
  }, []);

  // ── Bulletin toast passthrough ──
  const handleBulletinToast = useCallback((t) => setToast(t), []);

  // ── Blog handlers ──
  const handleNewPost = useCallback(() => {
    setEditingPost(null);
    setBlogView("compose");
  }, []);

  const handleEditPost = useCallback((post) => {
    setEditingPost(post);
    setBlogView("compose");
  }, []);

  const handleCancelPost = useCallback(() => {
    setEditingPost(null);
    setBlogView("dashboard");
  }, []);

  const handleDeletePost = useCallback(async (postId) => {
    setSaving(true);
    try {
      const result = await deleteBlogPost(postId);
      if (result.success) {
        setToast({ message: "Post deleted successfully.", type: "success" });
        setBlogView("dashboard");
        setEditingPost(null);
        refreshBlog();
      } else {
        setToast({ message: result.error || "Failed to delete post.", type: "error" });
      }
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  }, [refreshBlog]);

  const handleSavePost = useCallback(async (postData) => {
    setSaving(true);
    try {
      const result = await submitBlogPost(postData);
      if (result.success) {
        setToast({
          message: postData.published ? "Post published successfully!" : "Draft saved successfully!",
          type: "success",
        });
        setBlogView("dashboard");
        setEditingPost(null);
        refreshBlog();
      } else {
        setToast({ message: result.error || "Something went wrong. Please try again.", type: "error" });
      }
    } catch {
      setToast({ message: "Network error. Please check your connection.", type: "error" });
    } finally {
      setSaving(false);
    }
  }, [refreshBlog]);

  // ── Announcement handlers ──
  const handleNewAnn = useCallback(() => {
    setEditingAnn(null);
    setAnnView("compose");
  }, []);

  const handleEditAnn = useCallback((ann) => {
    setEditingAnn(ann);
    setAnnView("compose");
  }, []);

  const handleCancelAnn = useCallback(() => {
    setEditingAnn(null);
    setAnnView("dashboard");
  }, []);

  const handleSaveAnn = useCallback((data) => {
    try {
      saveAnnouncement(data);
      setToast({
        message: data.id ? "Announcement updated!" : "Announcement created!",
        type: "success",
      });
      setAnnView("dashboard");
      setEditingAnn(null);
      refreshAnnouncements();
    } catch {
      setToast({ message: "Failed to save. Please try again.", type: "error" });
    }
  }, [refreshAnnouncements]);

  const handleDeleteAnn = useCallback((id) => {
    try {
      removeAnnouncement(id);
      setToast({ message: "Announcement deleted.", type: "success" });
      setAnnView("dashboard");
      setEditingAnn(null);
      refreshAnnouncements();
    } catch {
      setToast({ message: "Failed to delete.", type: "error" });
    }
  }, [refreshAnnouncements]);

  // ── Dynamic page title ──
  const pageTitle = (() => {
    if (section === "blog") {
      if (blogView === "compose") return editingPost ? "Edit Post" : "New Post";
      return "Staff Dashboard";
    }
    if (section === "announcements") {
      if (annView === "compose") return editingAnn ? "Edit Announcement" : "New Announcement";
      return "Staff Dashboard";
    }
    if (section === "bulletins") return "Staff Dashboard";
    return "Staff Dashboard";
  })();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Staff Dashboard"
        description="Staff management dashboard for St. Dominic Catholic Church."
      />
      <PageHeader
        title={pageTitle}
        heroSrc={PHOTOS.dominicanCharism}
        tall
      />

      {/* ── Welcome hint (dismissible, first visit only) ── */}
      {!hintDismissed && (
        <WelcomeHint
          onGoToData={() => { dismissHint(); handleSectionChange("data"); }}
          onDismiss={dismissHint}
        />
      )}

      {/* ── Section tabs ── */}
      <SectionTabs active={section} onChange={handleSectionChange} />

      {/* One Suspense boundary covers every tab — only the active tab's
          chunk is fetched, and tab switches reuse already-loaded chunks. */}
      <Suspense fallback={<DashboardLoader />}>
        {/* ── Blog section ── */}
        {section === "blog" && (
          <>
            {blogView === "dashboard" && (
              <>
                <Section bg={T.warmWhite}>
                  <FadeSection>
                    <BlogDashboard
                      posts={blogPosts}
                      loading={loading}
                      onNew={handleNewPost}
                      onEdit={handleEditPost}
                    />
                  </FadeSection>
                </Section>
                <WritingTips />
              </>
            )}
            {blogView === "compose" && (
              <Section bg={T.warmWhite}>
                <BlogComposer
                  post={editingPost}
                  onSave={handleSavePost}
                  onDelete={handleDeletePost}
                  onCancel={handleCancelPost}
                  saving={saving}
                  onValidationError={(msg) => setToast({ message: msg, type: "error" })}
                />
              </Section>
            )}
          </>
        )}

        {/* ── Bulletins section ── */}
        {section === "bulletins" && (
          <Section bg={T.warmWhite}>
            <FadeSection>
              <BulletinDashboard onToast={handleBulletinToast} />
            </FadeSection>
          </Section>
        )}

        {/* ── Announcements section ── */}
        {section === "announcements" && (
          <Section bg={T.warmWhite}>
            <FadeSection>
              {annView === "dashboard" && (
                <AnnouncementDashboard onEdit={handleEditAnn} onNew={handleNewAnn} />
              )}
              {annView === "compose" && (
                <AnnouncementComposer
                  announcement={editingAnn}
                  onSave={handleSaveAnn}
                  onDelete={handleDeleteAnn}
                  onCancel={handleCancelAnn}
                />
              )}
            </FadeSection>
          </Section>
        )}

        {/* ── Events section ── */}
        {section === "events" && (
          <Section bg={T.warmWhite}>
            <FadeSection>
              <EventDashboard onToast={handleBulletinToast} />
            </FadeSection>
          </Section>
        )}

        {/* ── Mass Schedule section ── */}
        {section === "schedule" && (
          <Section bg={T.warmWhite}>
            <FadeSection>
              <ScheduleDashboard onToast={handleBulletinToast} />
            </FadeSection>
          </Section>
        )}

        {/* ── Staff Directory section ── */}
        {section === "staff" && (
          <Section bg={T.warmWhite}>
            <FadeSection>
              <StaffDirectoryDashboard onToast={handleBulletinToast} />
            </FadeSection>
          </Section>
        )}

        {/* ── Ministries section ── */}
        {section === "ministries" && (
          <Section bg={T.warmWhite}>
            <FadeSection>
              <MinistriesDashboard onToast={handleBulletinToast} />
            </FadeSection>
          </Section>
        )}

        {/* ── Site Settings section ── */}
        {section === "settings" && (
          <Section bg={T.warmWhite}>
            <FadeSection>
              <SettingsDashboard onToast={handleBulletinToast} />
            </FadeSection>
          </Section>
        )}

        {/* ── Data & Help section ── */}
        {section === "data" && (
          <Section bg={T.warmWhite}>
            <FadeSection>
              <DataHelpDashboard onToast={handleBulletinToast} />
            </FadeSection>
          </Section>
        )}
      </Suspense>

      {/* Toast notifications (portal to body to escape transform stacking) */}
      {toast && createPortal(
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />,
        document.body
      )}
    </div>
  );
}

// ── Writing Tips Section (below blog dashboard) ──
function WritingTips() {
  const [open, setOpen] = useState(false);

  const FORMAT_EXAMPLES = [
    { docFormat: "Heading 1 or Heading 2", result: "Section heading", icon: "BookMarked" },
    { docFormat: "Normal paragraph", result: "Body text (first gets drop cap)", icon: "BookOpenText" },
    { docFormat: "Indented paragraph (Tab)", result: "Blockquote with gold accent", icon: "Gem" },
    { docFormat: "All-bold paragraph", result: "Highlighted callout box", icon: "Flame" },
    { docFormat: "Bulleted / numbered list", result: "Formatted list", icon: "Heart" },
    { docFormat: "Image URL on its own line", result: "Inline image + caption", icon: "Maximize" },
  ];

  return (
    <Section bg={T.cream}>
      <FadeSection>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
            padding: "16px 0",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Source Sans 3', sans-serif",
          }}
        >
          <Icon name="BookOpen" size={18} color={T.burgundy} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: T.burgundy,
            }}
          >
            {open ? "Hide" : "Show"} Writing Tips & Formatting Guide
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
            }}
          >
            <path d="M2 4l4 4 4-4" stroke={T.burgundy} strokeWidth="2" fill="none" />
          </svg>
        </button>

        {open && (
          <div style={{ marginTop: 16 }}>
            <DominicanDivider width={120} />
            <div style={{ marginTop: 28 }}>
              <SectionTitle sub="Quick Reference">
                Google Docs Formatting
              </SectionTitle>
              <p
                style={{
                  fontSize: 15,
                  color: T.warmGray,
                  lineHeight: 1.7,
                  textAlign: "center",
                  maxWidth: 600,
                  margin: "0 auto 36px",
                }}
              >
                When using Google Docs, these formatting styles automatically
                convert into beautiful blog elements:
              </p>

              <div
                style={{
                  maxWidth: 640,
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {FORMAT_EXAMPLES.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "14px 20px",
                      background: T.warmWhite,
                      borderRadius: 8,
                      border: `1px solid ${T.stone}`,
                    }}
                  >
                    <Icon
                      name={ex.icon}
                      size={18}
                      color={T.burgundy}
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: T.softBlack,
                          fontFamily: "'Source Sans 3', sans-serif",
                        }}
                      >
                        {ex.docFormat}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.warmGray,
                        fontFamily: "'Source Sans 3', sans-serif",
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {"\u2192"} {ex.result}
                    </div>
                  </div>
                ))}
              </div>

              {/* Editor tips */}
              <div
                style={{
                  maxWidth: 640,
                  margin: "32px auto 0",
                  padding: "20px 24px",
                  background: T.warmWhite,
                  borderRadius: 10,
                  border: `1px solid ${T.stone}`,
                }}
              >
                <h3
                  style={{
                    fontSize: 13,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: T.gold,
                    fontWeight: 700,
                    marginBottom: 12,
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}
                >
                  Using the Built-in Editor
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {[
                    "Use the toolbar buttons for headings, bold, italic, quotes, lists, and callouts",
                    "Click the Image button to insert an image by URL",
                    "Switch to Preview tab to see exactly how it will look on the site",
                    "You can also link a Google Doc instead — choose 'Link Google Doc' mode",
                    "Save as Draft to come back later, or Publish to go live immediately",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 14,
                        color: T.warmGray,
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: T.gold,
                          flexShrink: 0,
                          marginTop: 7,
                        }}
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </FadeSection>
    </Section>
  );
}
