/**
 * Content Registry
 * ────────────────
 * The single source of truth for which pages are editable from the dashboard.
 * Each entry binds a friendly label + icon to its i18n namespace and the
 * localStorage shard key that holds its EN/ES overrides.
 *
 *  - `id`       stable key (matches the schema file in ./schema/<id>.js)
 *  - `label`    shown in the dashboard page rail
 *  - `ns`       top-level i18n group this page reads (e.g. "home")
 *  - `shardKey` localStorage / Google-Sheet section key, prefixed stdom_content_
 *  - `icon`     lucide-react icon name (rendered via <Icon name=…/>)
 *  - `route`    public path, used by the editor's "Preview ↗" button
 *
 * The shard list (src/content/shards.js) is derived from this array, and the
 * field schemas (src/content/schema/<id>.js) are looked up by `id`, so adding
 * a page is: append here → add a schema file → done.
 */

const page = (id, label, ns, icon, route) => ({
  id,
  label,
  ns,
  shardKey: `stdom_content_${id.toLowerCase()}`,
  icon,
  route,
});

export const PAGES = [
  page("home", "Home", "home", "Home", "/"),
  page("about", "About", "about", "Info", "/about"),
  page("massTimes", "Mass Times", "massTimes", "Clock", "/mass-times"),
  page("sacraments", "Sacraments", "sacraments", "Droplets", "/sacraments"),
  page("faithFormation", "Faith Formation", "faithFormation", "BookOpen", "/faith-formation"),
  page("getInvolved", "Get Involved", "getInvolved", "HandHeart", "/get-involved"),
  page("history", "History", "history", "Building", "/history"),
  page("arch", "Architecture", "arch", "Church", "/architecture"),
  page("becomingCatholic", "Becoming Catholic", "becomingCatholic", "Sparkle", "/becoming-catholic"),
  page("visit", "Visit", "visit", "MapPin", "/visit"),
  page("staff", "Staff", "staff", "Users", "/staff"),
  page("contact", "Contact", "contact", "MailQuestion", "/contact"),
  page("give", "Give", "give", "Gift", "/give"),
  page("register", "Register", "register", "UserPlus", "/register"),
  page("bulletin", "Bulletin", "bulletin", "Newspaper", "/bulletin"),
  page("gallery", "Gallery", "gallery", "Image", "/gallery"),
  page("events", "Events", "events", "Calendar", "/events"),
  page("connect", "Connect", "connect", "MessageCircle", "/connect"),
];

// Site chrome — global navigation and footer. Edited from their own dashboard
// tabs (not the page rail). Same shape as pages so they reuse the same editor
// and ride the same sync pipeline; route "/" lets Preview open the live site.
export const CHROME = [
  page("nav", "Navigation", "nav", "Menu", "/"),
  page("footer", "Footer", "footer", "PanelBottom", "/"),
];

/** Look up a page or chrome registry entry by id. */
export function getPage(id) {
  return [...PAGES, ...CHROME].find((p) => p.id === id) || null;
}
