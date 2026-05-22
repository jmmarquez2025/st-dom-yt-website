/**
 * Theme constants for inline styles in React components.
 * These mirror the CSS custom properties in src/styles/global.css.
 * When updating colors, update BOTH locations.
 */
export const T = {
  burgundy: "#6B1D2A",
  burgundyDark: "#4A1019",
  gold: "#C5A55A",
  goldLight: "#E8D5A3",
  // Darker gold for small text on light backgrounds — meets WCAG AA contrast (>=5:1 on white).
  // Use for small caps labels, captions, and any gold-colored text < 18pt.
  // Tuned darker than strict 4.5:1 minimum to survive mid-animation opacity blending
  // (FadeSection transitions briefly composite the text against bg at <100% opacity,
  // which axe-core samples — false-positive class without this margin).
  goldText: "#7A5A0F",
  cream: "#FAF6F0",
  warmWhite: "#FFFDF9",
  stone: "#E8E2D8",
  stoneLight: "#F2EDE5",
  charcoal: "#2C2C2C",
  warmGray: "#6B6560",
  softBlack: "#1A1714",
};

export const fontLink =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600&display=optional";
