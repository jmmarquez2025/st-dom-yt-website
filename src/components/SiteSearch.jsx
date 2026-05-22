import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, X, ArrowRight } from "lucide-react";
import { T } from "../constants/theme";

/* ── Search index: all site pages with keywords for fuzzy matching ── */
const SEARCH_INDEX = [
  {
    path: "/",
    titleKey: "nav.home",
    title: "Home",
    description: "Welcome to St. Dominic Catholic Church",
    keywords: ["home", "welcome", "church", "main", "front page"],
  },
  {
    path: "/mass-times",
    titleKey: "nav.massTimes",
    title: "Mass & Confession Times",
    description: "Sunday, daily, and holy day Mass schedule, confession times, and adoration",
    keywords: ["mass", "schedule", "confession", "sunday", "daily", "saturday", "adoration", "eucharist", "liturgy", "worship", "holy day", "reconciliation", "penance", "time", "hours", "today", "tomorrow", "church time"],
    priority: 3,
  },
  {
    path: "/about",
    titleKey: "nav.about",
    title: "About Our Church",
    description: "Learn about St. Dominic Catholic Church, our mission, and community",
    keywords: ["about", "church", "mission", "history", "community", "dominican", "who we are", "information"],
  },
  {
    path: "/staff",
    titleKey: "nav.staff",
    title: "Priests & Staff",
    description: "Meet our pastor, priests, deacons, and church staff",
    keywords: ["staff", "priests", "pastor", "deacon", "father", "clergy", "team", "directory", "office", "personnel"],
  },
  {
    path: "/bulletin",
    titleKey: "nav.bulletin",
    title: "Weekly Bulletin",
    description: "Read the latest church bulletin and announcements",
    keywords: ["bulletin", "weekly", "announcements", "newsletter", "news", "updates", "publication"],
  },
  {
    path: "/becoming-catholic",
    titleKey: "nav.becomingCatholic",
    title: "Becoming Catholic / OCIA",
    description: "Information about OCIA (formerly RCIA), the Order of Christian Initiation of Adults",
    keywords: ["ocia", "rcia", "becoming catholic", "convert", "initiation", "catechumen", "inquiry", "faith journey", "join the church", "adult baptism"],
  },
  {
    path: "/get-involved",
    titleKey: "nav.getInvolved",
    title: "Get Involved / Ministries",
    description: "Explore church ministries and volunteer opportunities",
    keywords: ["ministries", "volunteer", "get involved", "serve", "groups", "organizations", "lector", "eucharistic minister", "usher", "choir", "music", "outreach"],
  },
  {
    path: "/contact",
    titleKey: "nav.contact",
    title: "Contact Us",
    description: "Contact St. Dominic Church — phone, email, address, and office hours",
    keywords: ["contact", "phone", "email", "address", "office", "hours", "directions", "location", "map", "call", "help", "emergency"],
    priority: 1,
  },
  {
    path: "/give",
    titleKey: "nav.give",
    title: "Online Giving",
    description: "Support St. Dominic Church through online donations and stewardship",
    keywords: ["give", "donate", "offering", "tithe", "stewardship", "online giving", "contribution", "support", "collection", "flocknote", "recurring gift", "one time gift"],
    priority: 1,
  },
  {
    path: "/sacraments",
    titleKey: "nav.sacraments",
    title: "The Sacraments",
    description: "Overview of the seven sacraments celebrated at St. Dominic",
    keywords: ["sacraments", "seven sacraments", "grace", "catholic sacraments", "liturgical", "spiritual"],
  },
  {
    path: "/sacraments/baptism",
    titleKey: "nav.baptism",
    title: "Baptism",
    description: "Information about the Sacrament of Baptism for infants, children, and adults",
    keywords: ["baptism", "christening", "water", "infant", "baby", "godparent", "font", "baptismal", "initiation", "newborn"],
  },
  {
    path: "/sacraments/first-communion",
    titleKey: "nav.firstCommunion",
    title: "First Holy Communion",
    description: "Preparation for the Sacrament of First Holy Communion",
    keywords: ["first communion", "eucharist", "holy communion", "preparation", "catechesis", "body of christ", "bread", "wine", "children"],
  },
  {
    path: "/sacraments/confirmation",
    titleKey: "nav.confirmation",
    title: "Confirmation",
    description: "The Sacrament of Confirmation and preparation program",
    keywords: ["confirmation", "holy spirit", "chrism", "sponsor", "bishop", "gifts", "sealed", "teenager", "youth", "young adult"],
  },
  {
    path: "/sacraments/marriage",
    titleKey: "nav.marriage",
    title: "Marriage",
    description: "Planning a Catholic wedding at St. Dominic Church",
    keywords: ["marriage", "wedding", "matrimony", "engaged", "pre-cana", "nuptial", "vows", "bride", "groom", "ceremony"],
  },
  {
    path: "/sacraments/anointing",
    titleKey: "nav.anointing",
    title: "Anointing of the Sick",
    description: "The Sacrament of Anointing of the Sick for healing and comfort",
    keywords: ["anointing", "sick", "healing", "hospital", "elderly", "dying", "last rites", "comfort", "prayer", "oil", "homebound", "emergency", "priest", "near death", "surgery"],
    priority: 4,
  },
  {
    path: "/sacraments/funerals",
    titleKey: "nav.funerals",
    title: "Catholic Funerals",
    description: "Funeral planning, funeral Mass, and bereavement ministry",
    keywords: ["funeral", "death", "burial", "mass of christian burial", "bereavement", "grief", "memorial", "vigil", "wake", "cemetery", "deceased", "died", "passed away", "funeral home"],
    priority: 4,
  },
  {
    path: "/visit",
    titleKey: "nav.visit",
    title: "Plan Your Visit",
    description: "Plan your first visit to St. Dominic Church — directions, parking, and what to expect",
    keywords: ["visit", "plan", "first time", "new", "directions", "parking", "welcome", "newcomer", "what to expect", "guest"],
  },
  {
    path: "/history",
    titleKey: "nav.history",
    title: "Church History",
    description: "The rich history of St. Dominic Catholic Church",
    keywords: ["history", "heritage", "founded", "tradition", "legacy", "timeline", "origin", "past", "historical"],
  },
  {
    path: "/register",
    titleKey: "nav.register",
    title: "Church Registration",
    description: "Register as a member of St. Dominic",
    keywords: ["register", "registration", "join", "member", "sign up", "new member", "enroll", "membership"],
  },
  {
    path: "/events",
    titleKey: "nav.events",
    title: "Upcoming Events",
    description: "Calendar of upcoming church events, fundraisers, and gatherings",
    keywords: ["events", "calendar", "upcoming", "schedule", "activities", "fundraiser", "gathering", "social", "festival", "concert"],
  },
  {
    path: "/architecture",
    titleKey: "nav.architecture",
    title: "Architecture & Art",
    description: "Explore the architecture, stained glass, and sacred art of St. Dominic",
    keywords: ["architecture", "art", "stained glass", "building", "church", "design", "windows", "tour", "artwork", "sacred art", "gothic", "beauty"],
  },
  {
    path: "/blog",
    titleKey: "nav.blog",
    title: "Blog & Reflections",
    description: "Homilies, Dominican spirituality, parish news, and theological reflections from the friars",
    keywords: ["blog", "homily", "reflection", "dominican", "theology", "article", "post", "friar", "news", "preaching", "faith"],
  },
  {
    path: "/faith-formation",
    titleKey: "nav.faithFormation",
    title: "Faith Formation",
    description: "Deepen your faith with Dominican resources — podcasts, theology, catechesis, and the Catechism",
    keywords: ["faith formation", "education", "study", "theology", "catechism", "podcast", "godsplaining", "thomistic", "rosary", "dominicana", "saints", "learn", "resources", "dominican", "aquinas"],
  },
  {
    path: "/gallery",
    titleKey: "nav.gallery",
    title: "Photo Gallery",
    description: "Browse photos of St. Dominic Church — aerial views, interior, sacred art, and liturgical celebrations",
    keywords: ["gallery", "photos", "pictures", "images", "aerial", "interior", "exterior", "church photos", "photography"],
  },
];

/* ── Fuzzy search helper ── */
function fuzzyMatch(query, text) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  // Exact substring match gets highest score
  if (t.includes(q)) return 3;
  // Check if all query words appear somewhere
  const words = q.split(/\s+/).filter(Boolean);
  const allWordsMatch = words.every((w) => t.includes(w));
  if (allWordsMatch) return 2;
  // Partial word matching: at least half the query words appear
  const matchCount = words.filter((w) => t.includes(w)).length;
  if (matchCount > 0 && matchCount >= words.length / 2) return 1;
  return 0;
}

function searchPages(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();
  const scored = SEARCH_INDEX.map((page) => {
    const titleScore = fuzzyMatch(q, page.title) * 4;
    const descScore = fuzzyMatch(q, page.description) * 2;
    const kwScore = Math.max(0, ...page.keywords.map((kw) => fuzzyMatch(q, kw))) * 3;
    const total = titleScore + descScore + kwScore + (page.priority || 0);
    return { ...page, score: total };
  })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored;
}

/* ── SiteSearch Component ── */
export default function SiteSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const results = useMemo(() => searchPages(query), [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results.length, query]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure the DOM has rendered
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  // Keyboard: Escape, ArrowDown, ArrowUp, Enter
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        return;
      }
      if (!results.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        goTo(results[activeIndex].path);
      }
    },
    [results, activeIndex]
  );

  // Scroll active result into view
  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.children;
      if (items[activeIndex]) {
        items[activeIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const goTo = useCallback(
    (path) => {
      setOpen(false);
      setQuery("");
      if (document.startViewTransition) {
        document.startViewTransition(() => navigate(path));
      } else {
        navigate(path);
      }
    },
    [navigate]
  );

  // Close on overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
      setQuery("");
    }
  }, []);

  // Global shortcut: Ctrl/Cmd + K to open search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          color: T.warmGray,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = T.burgundy)}
        onMouseLeave={(e) => (e.currentTarget.style.color = T.warmGray)}
      >
        <Search size={18} strokeWidth={2} />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(26, 23, 20, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "min(15vh, 120px)",
            animation: "searchOverlayIn 0.2s ease",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 600,
              margin: "0 20px",
              background: T.warmWhite,
              borderRadius: 12,
              boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(107,29,42,0.08)",
              overflow: "hidden",
              animation: "searchPanelIn 0.25s ease",
            }}
          >
            {/* Search input area */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 20px",
                borderBottom: `1px solid ${T.stone}`,
              }}
            >
              <Search size={20} color={T.warmGray} strokeWidth={2} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages..."
                aria-label="Search the site"
                autoComplete="off"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 17,
                  fontFamily: "'Source Sans 3', sans-serif",
                  color: T.softBlack,
                  letterSpacing: 0.2,
                }}
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    color: T.warmGray,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={16} />
                </button>
              )}
              <kbd
                style={{
                  fontSize: 11,
                  fontFamily: "'Source Sans 3', sans-serif",
                  color: T.warmGray,
                  background: T.cream,
                  border: `1px solid ${T.stone}`,
                  borderRadius: 4,
                  padding: "2px 6px",
                  lineHeight: 1.4,
                  whiteSpace: "nowrap",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results area */}
            <div
              ref={resultsRef}
              style={{
                maxHeight: "min(50vh, 400px)",
                overflowY: "auto",
              }}
            >
              {query.trim().length >= 2 && results.length === 0 && (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    color: T.warmGray,
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 15,
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 500 }}>No results found</p>
                  <p style={{ margin: "8px 0 0", fontSize: 13, opacity: 0.7 }}>
                    Try a different search term
                  </p>
                </div>
              )}

              {results.map((page, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={page.path}
                    onClick={() => goTo(page.path)}
                    onMouseEnter={() => setActiveIndex(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      width: "100%",
                      padding: "14px 20px",
                      border: "none",
                      borderBottom: `1px solid ${T.stoneLight}`,
                      background: isActive ? T.cream : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s",
                      fontFamily: "'Source Sans 3', sans-serif",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: isActive ? T.burgundy : T.charcoal,
                          fontFamily: "'Cormorant Garamond', serif",
                          letterSpacing: 0.3,
                          transition: "color 0.15s",
                        }}
                      >
                        {page.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: T.warmGray,
                          marginTop: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {page.description}
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      color={isActive ? T.burgundy : T.stone}
                      style={{ flexShrink: 0, transition: "color 0.15s" }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            {query.trim().length < 2 && (
              <div
                style={{
                  padding: "20px 20px 24px",
                  textAlign: "center",
                  color: T.warmGray,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 13,
                }}
              >
                <p style={{ margin: 0, opacity: 0.7 }}>
                  Type at least 2 characters to search
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                    marginTop: 12,
                    fontSize: 12,
                    opacity: 0.5,
                  }}
                >
                  <span>
                    <kbd style={kbdSmall}>↑</kbd> <kbd style={kbdSmall}>↓</kbd> navigate
                  </span>
                  <span>
                    <kbd style={kbdSmall}>↵</kbd> select
                  </span>
                  <span>
                    <kbd style={kbdSmall}>esc</kbd> close
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Animations */}
          <style>{`
            @keyframes searchOverlayIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes searchPanelIn {
              from { opacity: 0; transform: scale(0.97) translateY(-8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

const kbdSmall = {
  fontSize: 10,
  fontFamily: "'Source Sans 3', sans-serif",
  background: "#E8E2D8",
  borderRadius: 3,
  padding: "1px 5px",
  border: "1px solid #D5CFC5",
};
