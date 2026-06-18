/**
 * Navigation structure (routes only — labels come from i18n `nav.*`).
 * Extracted from Nav.jsx so the dashboard's menu-order/visibility editor can
 * reference the same source without importing the whole Nav component.
 */
export const NAV_ITEMS = [
  { key: "visit", to: "/visit" },
  { key: "massTimes", to: "/mass-times" },
  {
    key: "sacraments",
    children: [
      { key: "sacraments", to: "/sacraments" },
      { key: "becomingCatholic", to: "/becoming-catholic" },
      { key: "baptism", to: "/sacraments/baptism" },
      { key: "firstCommunion", to: "/sacraments/first-communion" },
      { key: "confirmation", to: "/sacraments/confirmation" },
      { key: "marriage", to: "/sacraments/marriage" },
      { key: "anointing", to: "/sacraments/anointing" },
      { key: "funerals", to: "/sacraments/funerals" },
    ],
  },
  {
    key: "getInvolved",
    children: [
      { key: "getInvolved", to: "/get-involved" },
      { key: "register", to: "/register" },
      { key: "faithFormation", to: "/faith-formation" },
      { key: "events", to: "/events" },
      { key: "connect", to: "/connect" },
    ],
  },
  {
    key: "more",
    // Pure dropdown trigger — "More" is not a destination, so it renders as a
    // <button> (also fixes the Lighthouse link-text audit).
    linkless: true,
    children: [
      { key: "about", to: "/about" },
      { key: "bulletin", to: "/bulletin" },
      { key: "contact", to: "/contact" },
      { key: "history", to: "/history" },
      { key: "architecture", to: "/architecture" },
      { key: "gallery", to: "/gallery" },
      { key: "staff", to: "/staff" },
    ],
  },
];

/** Top-level menu keys, in shipped order (used by the layout editor). */
export const NAV_TOP_KEYS = NAV_ITEMS.map((i) => i.key);
