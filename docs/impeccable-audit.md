# Impeccable Design Audit — St. Dominic Website

**Goal:** make sure the site does not read as AI-generated.
**Tool:** [impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0), vendored at
`.agents/skills/impeccable/`, pinned commit `84135db`.
**Date:** 2026-05-28 · **Branch:** `claude/practical-wilbur-735a7f`
**Method:** (1) deterministic detector `node .agents/skills/impeccable/scripts/detect.mjs src/`
on all source; (2) impeccable `audit` rubric (5 dimensions + AI-slop "tells" test) applied to the
rendered pages via the live dev server + Claude preview tools. (Puppeteer URL scanning was not
used — Chromium dependency not installed; rendered review done through the preview browser.)

---

## Verdict

| Dimension | Score | Notes |
|-----------|------:|-------|
| Accessibility | 3 / 4 | WCAG-AA tokens, skip link, aria labels; pull-quote text moved to higher-contrast charcoal |
| Performance | 3 / 4 | A few layout-animated progress bars / accordions; routes code-split & lazy |
| Responsive | 3 / 4 | `clamp()` type + `auto-fit` grids throughout |
| Theming | 4 / 4 | Strong, consistent token system (`theme.js` ↔ `global.css`) |
| **Anti-Patterns (AI look)** | **2 → 3.5 / 4** | The targeted dimension — see below |
| **Total** | **~17 / 20 (Good)** | AI-look materially improved |

**Before:** failing the AI-look dimension ("Heavy AI aesthetic") — gradient-text, bounce easing,
card side-tabs, and a gold left-bar pull-quote repeated near-identically on ~13 pages (plus the
hero "stat banner" + boilerplate copy already removed in the prior pass).
**After:** every clear deterministic tell is gone. The one residual detector hit is a false positive.

---

## Deterministic detector — 26 → 6 findings

| Pattern | Before | After | Disposition |
|---------|------:|------:|-------------|
| `gradient-text` | 1 | **0** | Removed unused `.text-mask` class |
| `bounce-easing` | 1 | **0** | Retuned `--ease-elastic` to a no-overshoot curve |
| `side-tab` | 19 | **1** | Unified all pull-quotes into `<PullQuote>` (gold rule **above**, no left bar) + fixed blog/callout cards. The 1 remainder is a CSS play-▶ triangle in `YouTubeChannel.jsx` — a **false positive** (not a card tab). |
| `border-accent-on-rounded` | 0 | **0** | (transient during fixes; resolved) |
| `layout-transition` | 5 | 5 | **Accepted** — scroll/reading progress bars, accordions, mobile-nav height. Minor perf warnings, not an AI-look issue. |

Net: the only AI-look tells the detector still reports are the triangle false positive. ✅

---

## Fixes applied

**New component** — `src/components/PullQuote.jsx`: one editorial pull-quote (short gold rule
above, serif italic, optional caption; `align` + `tone` props). Replaces the repeated
"gold left-bar" blockquote that read as a templated AI side-tab.

| Area | Change |
|------|--------|
| `src/components/PullQuote.jsx` | New shared pull-quote component |
| 10 pages via codemod | `Sacraments`, `Give`, `BecomingCatholic`, `FaithFormation` + 6 `sacraments/*` → use `<PullQuote>` |
| `src/pages/MassTimes.jsx` | Local `Quote` helper now delegates to `<PullQuote>` (3 quotes) |
| `src/pages/About.jsx` | Motto → `<PullQuote tone="dark" align="left">` (light text on dark card) |
| `src/pages/Staff.jsx` | Modal quote → `<PullQuote align="left">` |
| `src/components/blog/BlogBody.jsx` | Blog quote block + callout → `<PullQuote>` / plain bordered box |
| `src/styles/global.css` | Removed `.text-mask`; retuned `--ease-elastic`; `.premium-charism` quote → gold-rule-above; `.editor-callout` → plain bordered box |

Tone context for the tool lives at `.agents/context/PRODUCT.md` + `.agents/context/DESIGN.md`
so the audit judges against the parish brand (reverent, Dominican, anti-SaaS), not generic defaults.

---

## Flagged — kept by design (reviewed, not AI slop)

- **`backdrop-filter: blur()`** on modals/popups and a few cards (`Staff`, `GetInvolved`,
  `Blog`, `Gallery`, announcement popups). Tasteful on overlays; revisit only if a flatter feel is wanted.
- **Gradient hero/CTA backgrounds** (burgundy→burgundy-dark) and **card grids** — common and
  brand-appropriate; kept. Note: `.glass-card` is a misnomer — a plain white card, **no** glassmorphism.
- **`layout-transition`** warnings — progress bars and accordions; fine to leave.

## Re-running
```bash
node .agents/skills/impeccable/scripts/detect.mjs src/            # deterministic
node .agents/skills/impeccable/scripts/detect.mjs --json src/     # machine-readable
# or, with the skill: /impeccable audit <page>
```
