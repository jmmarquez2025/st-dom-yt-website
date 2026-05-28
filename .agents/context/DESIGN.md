# DESIGN

Source of truth: `src/constants/theme.js` (the `T` object) mirrored in `src/styles/global.css`
custom properties. Update both when changing a token.

## Color tokens
| Token | Hex | Use |
|-------|-----|-----|
| burgundy | `#6B1D2A` | primary brand; headings on light, buttons, accents |
| burgundyDark | `#4A1019` | gradient/hero depth, dark sections |
| gold | `#C5A55A` | decorative accent, dividers, monstrance/gilt feel |
| goldLight | `#E8D5A3` | gold text/accents on dark backgrounds |
| goldText | `#7A5A0F` | small gold-colored text on light — tuned for WCAG AA (survives FadeSection opacity blend) |
| cream | `#FAF6F0` | section backgrounds |
| warmWhite | `#FFFDF9` | page background |
| stone | `#E8E2D8` | borders, hairlines |
| stoneLight | `#F2EDE5` | subtle fills |
| charcoal | `#2C2C2C` | body text |
| warmGray | `#6B6560` | secondary text, captions |
| softBlack | `#1A1714` | strongest text, dark section bg |

Palette is **warm, liturgical (burgundy + gold + cream)** — deliberately not a "tech" palette. Keep it.

## Typography
- **Cormorant Garamond** (serif) — headings, display, pull quotes. Weights 400–700 + italic.
- **Source Sans 3** (sans) — body, labels, UI. Weights 300–600.
- Loaded via Google Fonts with `display=optional`.
- Serif headings + sans body is the parish's identity — keep. (Watch for the "generic sans body" tell only where Source Sans is doing display work it shouldn't.)

## Components & patterns (existing)
- `Section` / `SectionTitle` (eyebrow + serif H2 + optional gold divider) — `src/components/Section.jsx`
- `ActionCard`, `premium-action-card`, `premium-essentials__grid` — quick-info card grids
- `glass-card` / `glass-card--dark` — translucent cards (glassmorphism — flagged tell; keep core identity, fix egregious uses)
- `ScheduleCard`, `AccordionItem` — `src/pages/MassTimes.jsx`
- `HeroImage` / `StickyHero` / `ParallaxSection` — photo heroes with dark/burgundy overlays
- `ScrollColorNum`, `ScrollTimeline`, `CountUp`, `FadeSection` — scroll-driven motion
- Linear-gradient hero/CTA backgrounds (`linear-gradient(... burgundyDark → burgundy ...)`)

## Known AI "tells" present (audit focus)
Glassmorphism cards, gradient hero/CTA backgrounds, scroll color-shift + count-up animations,
heavy card grids, gray-on-photo low-contrast captions (`rgba(255,255,255,0.6)` over images).
Per the user's directive: fix the **clear** tells (gradient text, bounce easing, low contrast,
redundant copy, over-generic type) but **preserve** the burgundy/gold/serif identity, the
glass cards, the card grids, and tasteful motion. Flag — don't silently remove — anything
structural.

## Constraints
- WCAG AA contrast required (older congregation).
- Bilingual EN/ES parity (`src/locales/en.json` + `es.json`).
- Inline-style React (JSX) + `src/styles/global.css`; SPA via React Router, base `/st-dom-yt-website/`.
