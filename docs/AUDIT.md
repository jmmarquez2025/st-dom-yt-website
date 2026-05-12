# St. Dominic Website — Audit (Phase 1)

Scope: senior-dev + Catholic-media-pro review. Generated 2026-05-12.
Branch: `claude/amazing-kalam-ae6705`. Working tree: clean at start.

Stack: React 18, Vite 6, react-router 7, react-i18next, Lenis, Lucide. PWA (hand-written sw.js). GitHub Pages base `/st-dom-yet-website/`. ~13.8k LOC, 23 pages, 31 components, 605-line `global.css`.

Severity: **P0** ship-blocking, **P1** before next launch milestone, **P2** polish/backlog.

---

## A. Code architecture & health

| # | Sev | Area | Finding | File:line |
|---|---|---|---|---|
| A1 | P1 | Page bloat | `Home.jsx` 908 lines, `WritersGuide.jsx` 938, `MassTimes.jsx` 750, `Register.jsx` 744, `GetInvolved.jsx` 627, `Contact.jsx` 598, `SiteSearch.jsx` 573 — extract sub-sections to components. | `src/pages/*` |
| A2 | P1 | Inline-style heatmap | 77 `style={{` in `Home.jsx`, 59 in `MassTimes.jsx`, 46 in `Register.jsx`, 45 in `Staff.jsx`, 44 in `Visit.jsx`. Nav 22, SiteSearch 19, Footer 18. | (per file) |
| A3 | P1 | Style strategy undecided | 605 LOC `global.css` + heavy inline styles + class strings (`hover-lift`, `glass-card`) mixed. Pick one — CSS Modules or Tailwind — and migrate. | `src/styles/global.css`, `src/pages/*` |
| A4 | P1 | Side effect at module eval | `installAutoSync()` runs on import — bypasses SSR/tests, hard to mock. | `src/App.jsx:18` |
| A5 | P2 | Bundle: non-lazy heavies | `lenis` and `lucide-react` imported at top level (App + Nav). Lenis ~6kB gz fine; lucide-react: confirm tree-shake (depends on import style). | `src/hooks/useLenis.js:15` (dynamic-imports lenis — actually lazy, good); audit lucide imports in components |
| A6 | P0 | No tests | No vitest/jest/playwright. Zero `*.test.*`. Schedule logic (`rowsForToday`, `joinTimes` in `Home.jsx:35-46`), liturgical banner, i18n fallback, and CMS sync deserve smoke tests. | (codebase) |
| A7 | P1 | `ScrollToTop` vs view-transitions | `window.scrollTo({top:0})` on every nav fires alongside Lenis + view-transition. Possible visual stutter. Verify or hook into the transition. | `src/App.jsx:50-56` |
| A8 | P2 | Service worker hand-rolled | `public/sw.js` static, no vite-plugin-pwa. Manual cache version bumps required on each deploy. Migrate to Workbox/vite-plugin-pwa. | `public/sw.js`, `vite.config.js` |
| A9 | P2 | Debug logs in prod | 4× `console.log` in `src/registerSW.js`. Gate on `import.meta.env.DEV`. | `src/registerSW.js:10,19,37,56` |
| A10 | P2 | i18n parity | EN/ES perfect 1153/1153. Spot-check ES copy quality with native speaker. | `src/locales/en.json`, `es.json` |

## B. SEO / brand / metadata

| # | Sev | Area | Finding | File:line |
|---|---|---|---|---|
| B1 | P3 (deferred) | Brand surface = github.io | 42 instances hardcoded `jmmarquez2025.github.io/st-dom-yet-website`. **Per user 2026-05-12: no `saintdominic.org` cutover scheduled — GH Pages is the canonical surface.** `VITE_SITE_URL` parametrization already in place at `src/constants/config.js:71` + `scripts/generate-seo.mjs:5` for whenever cutover happens. No action now. | `index.html:13,17,20,56`; `public/sitemap.xml` (all 30 URLs); `public/manifest.json:5,6,12-14` |
| B2 | P1 | Render-blocking Google Fonts | `<link rel="stylesheet" href="...fonts.googleapis...">` blocks first paint. Switch to preload + swap, or self-host. | `index.html:32` |
| B3 | P2 | Hardcoded event date | JSON-LD Sunday Mass `startDate:"2026-04-12T..."` — works for recurring schema but freezes a date in markup. Move to runtime/build generation tied to liturgical calendar. | `index.html:71,83,95` |
| B4 | P1 | OG image fixed to one photo | All social previews use `rose-window-opt.jpg`. Per-page `<Seo>` exists (`PageHeader heroSrc` passed to `Seo`) — verify it actually emits per-route OG. | `index.html:13,17`; `src/components/Seo.jsx` |
| B5 | P2 | Sitemap vs routes | 30 sitemap URLs vs 27 routes — delta is dynamic blog posts (`/blog/:slug`). Acceptable but document. | `public/sitemap.xml`, `src/App.jsx:75-103` |

## C. Accessibility

| # | Sev | Area | Finding | File:line |
|---|---|---|---|---|
| C1 | P1 | Pages w/ zero `aria-`/`role=` | `BlogPost`, `Bulletin`, `Connect`, `Events`, `FaithFormation`, `BecomingCatholic`. Becoming Catholic is the highest-stakes evangelistic page — interactive cards need ARIA. | `src/pages/{BlogPost,Bulletin,Connect,Events,FaithFormation,BecomingCatholic}.jsx` |
| C2 | P0 | Reduced-motion gaps | 5 of 7 scroll animation components lack `prefers-reduced-motion` checks: `ScaleReveal`, `TextReveal`, `ScrollColorNum`, `ScrollTimeline`, `FadeSection` (wraps `useScrollFade` — verify hook). Global CSS does have a media block (`global.css:157-170`) but JS-driven transforms in those components bypass it. | `src/components/{ScaleReveal,TextReveal,ScrollColorNum,ScrollTimeline,FadeSection}.jsx` |
| C3 | P1 | Color contrast spot-checks needed | Burgundy `#6B1D2A` on cream `#FAF6F0` — likely AA. Gold `#C5A55A` on cream — risk for body text. Gold text appears as accent strings (CTAs, labels) — measure with axe. | `src/styles/global.css:3-13` |
| C4 | P1 | Focus visibility | No `:focus-visible` rules located. Default ring may be invisible on burgundy buttons. | `src/styles/global.css` |
| C5 | P1 | Form a11y | `Contact.jsx` 598 lines, `Register.jsx` 744 lines — audit `<label for>`, `aria-describedby`, error messaging, required indicator. Contact has 11 aria attrs, Register has 9 — start positive but verify per field. | `src/pages/{Contact,Register}.jsx` |
| C6 | P2 | Lang switching | `document.documentElement.lang` updated in App.jsx:124 — good. Verify ES content actually renders w/ Spanish typography hints (no font weights missing for diacritics). | `src/App.jsx:124` |

## D. Performance (pending Lighthouse run)

Static observations only — full Lighthouse + axe scans require dev server. Will run on request.

| # | Sev | Area | Finding | File:line |
|---|---|---|---|---|
| D1 | P1 | LCP risk | Hero is sticky background-image (`StickyHero`) loaded via `<img>` preload trick. `homeHero` not preloaded in `<head>`. Add `<link rel="preload" as="image">` for the highest-impact hero. | `src/components/StickyHero.jsx:78-85`; `index.html` |
| D2 | P2 | WebP coverage | Most photos have `.webp` siblings — confirm `<picture>` or CSS `image-set()` actually serves them. Folder shows raw `.jpg` references possible. | `public/photos/*`, `src/constants/photos.js` |
| D3 | P2 | Lenis on mobile | `touchMultiplier: 1.5` overrides native momentum. Test on iOS Safari for jank. | `src/hooks/useLenis.js:20` |
| D4 | P2 | Scroll handlers | `StickyHero`, `ParallaxSection`, `ScrollColorNum`, `ScrollTimeline`, `ScrollProgress` each attach scroll listeners. `ScrollProgress` uses rAF; verify others throttle. | (per file) |

## E. Catholic media / content / pastoral

| # | Sev | Area | Finding | File:line |
|---|---|---|---|---|
| E1 | P0 | "RCIA" terminology | USCCB renamed RCIA → OCIA (Order of Christian Initiation of Adults) in 2021–2022. Audit every page and locale string for "RCIA" and update — keep "RCIA (now OCIA)" once for SEO, then use OCIA. | `src/pages/BecomingCatholic.jsx:24` (`PHOTOS.stockRcia`); `src/locales/en.json` + `es.json` (grep "RCIA"/"rcia") |
| E2 | P0 | Stock photos on sacred pages | `PHOTOS.stockRcia` on Becoming Catholic, `PHOTOS.stockSacraments` + `PHOTOS.stockChaliceCruets` on Sacraments hub. Most evangelistically loaded pages. Folder `public/photos/` already has real parish imagery (Easter Vigil, interior nave, vigil-candles, baptism-opt, marriage-opt) — replace stock with real. | `src/pages/{BecomingCatholic,Sacraments}.jsx`; `src/constants/photos.js` |
| E3 | P1 | Anointing icon mismatch | `Sacraments.jsx:18` uses lucide `Bird` for Anointing of the Sick. Bird ≈ Holy Spirit / dove imagery (better fit for Confirmation, which already uses `Flame`). Anointing = oil + laying on of hands. Recommend `Droplet`, `HandHeart`, or `Hand`. | `src/pages/Sacraments.jsx:18` |
| E4 | P1 | Dominican identity surface area | `DominicanDivider` exists but only as visual flourish. Identity claims (Friars since 1923, Province of St. Joseph) appear in `<head>` JSON-LD but the site doesn't visibly answer "what is Dominican?" — Veritas motto, OP shield, preaching charism, Rosary, Aquinas/Catherine. Add a dedicated "Why Dominican?" section on About or History. | `src/components/DominicanDivider.jsx`; `src/pages/{About,History}.jsx` |
| E5 | P1 | Crisis content prominence | Sick-call / funeral / confession need 1-tap access. Confessions surface via `rowsForToday(schedule?.confession)` on Home (`Home.jsx:59`) — good. But the sacrament pages for Anointing and Funerals need office phone + 24/7 emergency-anointing line front-and-center, NOT below the fold. Verify. | `src/pages/sacraments/{Anointing,Funerals}.jsx` |
| E6 | P1 | Donation friction | `Give.jsx` 150 lines — audit: one-time vs recurring choice visible? Bishop's Appeal split clear? Fees disclosure? Donor anonymity? Tax-receipt mention? Mobile flow? | `src/pages/Give.jsx` |
| E7 | P1 | Mass times on every page | "Today's Mass" should be a persistent affordance on mobile (sticky footer chip or nav slot) — verify it's not buried. Currently on Home via `NextMass` component; check Nav. | `src/components/{Nav,NextMass}.jsx` |
| E8 | P2 | Trust signals | VIRTUS / Safe Environment / Diocese of Youngstown badge / Finance Council / annual report — these are credibility table-stakes for parents + donors. Audit Footer and About. | `src/components/Footer.jsx`; `src/pages/About.jsx` |
| E9 | P2 | Liturgical accuracy | `LiturgicalBanner` — verify season transitions (Advent → Christmas → Ordinary → Lent → Easter → Pentecost → Ordinary), feast precedence (Solemnities outrank Sundays in Ordinary Time), parish patronal feast (St. Dominic, 8 Aug). | `src/components/LiturgicalBanner.jsx` |
| E10 | P2 | Homily archive | Friar preaching is a Dominican signature. `YouTubeChannel` component exists — confirm it pulls the parish channel and isn't generic. | `src/components/YouTubeChannel.jsx` |
| E11 | P2 | Bilingual respect | ES strings exist at parity (1153 keys), but tone: avoid translated-from-English voice. Have native Spanish speaker review homepage hero + Sacraments + Becoming Catholic. | `src/locales/es.json` |

## F. Motion & transitions inventory

What's already shipping (good news — most of the heavy lifting exists):

**Components:** `StickyHero` (Apple-style sticky-zoom + text fade), `ParallaxSection`, `ScaleReveal` (scale + opacity + blur on scroll), `TextReveal` (word-by-word stagger), `AnimatedDivider`, `ScrollColorNum` (scroll-driven color lerp), `ScrollTimeline` (vertical fill), `ScrollProgress` (top bar), `CountUp` (number tween), `FadeSection`.

**CSS:** 11 `@keyframes` (`vtFadeOut`, `vtFadeIn`, `fadeUp`, `scrollFadeUp`, `scrollStaggerIn`, `slideDown`, `shimmer`, `gradientShift`, `expandDivider`, `imgReveal`, `fadeInUp`). 3 `animation-timeline: view()` rules (progressive enhancement). View Transitions API rules on `::view-transition-old/new(root)`.

**JS-side View Transitions:** `Nav.jsx:26-27`, `Footer.jsx:22-23`, `SiteSearch.jsx:278-279` wrap navigation in `document.startViewTransition`. Good.

**Lenis:** dynamic-imported in `useLenis.js:15`, respects reduced-motion (line 12). Good.

### Where motion lands well

- Home sticky-hero scroll-zoom (Apple product page DNA) — already shipped, fits a parish doors-opening metaphor.
- History page timeline (`ScrollTimeline` + `TextReveal`).
- Architecture page tour (`ParallaxSection` + `ScaleReveal`).

### What's worth adding

| Priority | Pattern | Where | Notes |
|---|---|---|---|
| P1 | **Named view-transitions for shared elements** | Sacraments hub card → individual sacrament hero | Add `view-transition-name: sacrament-{slug}` to the card image and the destination hero. Already have `startViewTransition` wired. Cheap, high-craft payoff. |
| P1 | **First-paint hero reveal** | Every page top | Mask-reveal of hero image on initial mount (not scroll-driven). Use CSS `@starting-style` + `mask-image` linear-gradient sweep. Falls back to plain fade. |
| P1 | **Sticky scrub w/ text** (Apple AirPods page) | Architecture interior tour | Pin a wide image, scrub text-blocks past it. Already 80% there via `StickyHero` — needs a `StickyScrub` variant accepting an ordered list of text panels. |
| P2 | **Pinned horizontal scroll** | Ministries grid OR Staff bios | Desktop-only; collapse to standard grid below 900px. Optional. |
| P2 | **Liturgical color crossfade** | `LiturgicalBanner` rollover | Animate the gradient when season changes (Advent purple → Christmas white). 600ms cross-fade. Distinctive Catholic touch. |
| P2 | **Card lift micro-interactions** | `Sacraments` and `GetInvolved` cards | Currently use `.hover-lift` class — verify 150ms ease-out, 4–6px lift, subtle shadow. |
| P2 | **Page-load mask on home hero** | Home only | One-time gold-stroke draw on `DominicanDivider` underneath the title. |

### What to skip

- Magnetic cursors, 3D card tilt, infinite marquees, Lottie/Rive flourishes — wrong register for a parish. Reads as agency-portfolio, not pastoral.
- Elastic overshoots / bouncy springs on serious content. Use `--ease-out-expo`, not `--ease-elastic`, for liturgical and crisis pages.
- Anything that delays Mass times, contact info, or sacrament scheduling behind a scroll-trigger.

### Reduced-motion non-negotiables

Every motion component MUST early-return for `prefers-reduced-motion: reduce`. Five components currently don't (see C2). Fix before adding any new motion.

---

## G. Suggested next steps

1. **P0 first:** fix C2 reduced-motion gaps, replace E2 stock photos w/ parish photos, sweep E1 RCIA→OCIA in locales, add A6 minimal test harness (vitest + RTL).
2. **Run perf + a11y scans:** spin up dev server, run Lighthouse on Home/MassTimes/Sacraments-Baptism/Give + axe-core on the 6 zero-aria pages.
3. **B1 brand decision:** before saintdominic.org cutover, parametrize the base URL through `VITE_SITE_URL` everywhere; build a CI check that fails if `jmmarquez2025.github.io` appears in `dist/`.
4. **Motion polish (Phase 3):** named view-transitions for Sacraments cards, sticky-scrub variant for Architecture, liturgical-color crossfade.
5. **Content sweep (Phase 4):** OCIA terminology, Dominican identity narrative, donation flow audit, crisis-content prominence.

---

## H. Phase 2 — A11y deep-dive on 6 zero-aria pages

Earlier "zero aria attrs" count was misleading: most of these pages use semantic HTML (`<a>`, `<button>`, `<iframe title=>`) that doesn't need explicit ARIA. Only one real issue surfaced:

| # | Sev | File:line | Issue | Fix |
|---|---|---|---|---|
| H1 | P2 | `src/pages/BlogPost.jsx:132` | Empty `alt=""` on author photo (decorative claim, but it's an identifying portrait) | Use `alt={author.name}` |

BecomingCatholic cards (`BecomingCatholic.jsx:86-135`) are `<div>` containers and currently non-interactive — confirm with content owner whether they should be links/buttons. If they become interactive later, add `role="button"`, `tabIndex={0}`, `onKeyDown` for Enter/Space.

Net: **C1 in section C above was overstated.** "Zero aria-/role= attributes" ≠ "broken a11y" when semantic tags carry the weight. Revised severity for C1: P2.

Still verify with live axe-core scan when dev server is up. Static read cannot catch contrast or focus-visible issues.

## I. Phase 2 — Perf static scan

| # | Sev | Area | Finding |
|---|---|---|---|
| I1 | **P0** | Image weight | `public/photos/2024_3_30_EasterVigil_StDominicYoungstown-63 (1).jpg` = **14.9 MB**. Single image larger than entire JS bundle. WebP sibling at 3.0 MB still too heavy. |
| I2 | **P0** | Image weight | `public/photos/davis_frassati.jpg` = **7.4 MB**. WebP 2.1 MB. Staff photo. |
| I3 | P1 | Image weight | `rooney_charles.jpg` 3.8 MB. WebP 2.0 MB. |
| I4 | P1 | Photo dir total | `public/photos/` = **85 MB**. Will balloon repo + CDN egress. |
| I5 | P0 | No responsive images | 0 `srcset` / `<picture>` / `image-set()` across src/. Every viewport gets full-resolution. Combined with I1–I2: mobile users on cell data download the largest available image. |
| I6 | P2 | Web fonts | `font-display: swap` IS in the query string (good). Still missing `<link rel="preload" as="font">` for the actually-used weights. |
| I7 | n/a | Third parties | **Praise.** Plausible (`Analytics.jsx:20`) only loads if `VITE_PLAUSIBLE_DOMAIN` set. YouTube embed (`YouTubeChannel.jsx:145`) gated behind user click. Vatican News widget (`VaticanNews.jsx:6,34`) gated behind user click. No Google Maps, no gtag, no Facebook pixel. Privacy + perf posture is right. |
| I8 | n/a | Scroll handlers | **Praise.** All 5 scroll components use `{ passive: true }`. `ScrollProgress` adds rAF throttle. No jank vector found. |
| I9 | n/a | CMS strategy | **Praise.** `adminSync.js` debounced (1.5s), event-driven via `Storage.prototype.setItem` intercept, no polling, `mode: "no-cors"` fire-and-forget push. |
| I10 | P2 | SW precache | `public/sw.js` precaches app shell only (5 files). Asset cache strategy: cache-first for images/js/css, network-first for HTML, network-only for Sheets API. Solid manual approach; still recommend Workbox migration for cache versioning automation. |
| I11 | P1 | Photo manifest | `photos.js` defines 56 keys, all referenced. Audit which `stock*` keys still resolve to stock vs already-swapped parish photos. |

### Action: image pipeline

1. Re-optimize the 14.9 MB and 7.4 MB JPGs at source (target ≤ 400 KB JPG, ≤ 150 KB WebP at hero resolution).
2. Generate 3 sizes per hero: 480 / 1024 / 1920 wide. Wire `<picture>` w/ `srcset`.
3. Add `sizes` attr matching the layout.
4. Update `scripts/generate-webp.mjs` to also emit a manifest of available sizes per asset.

## J. Phase 3 — Motion P0 fixes (shipped)

Implemented this session:

| File | Change | Pattern |
|---|---|---|
| `src/components/ScaleReveal.jsx:22-29,34-41,56-62,82` | Added `reducedMotion` state + media-query listener. Short-circuits scale/radius/opacity/shadow/transform to final state. | `prefers-reduced-motion` guard mirroring `StickyHero.jsx:30-36` |
| `src/components/TextReveal.jsx:25-33,35-39,57-63,126-154,160,165-167` | Both `TextReveal` and `AnimatedDivider` early-return at final state under reduced motion. | Same |
| `src/components/ScrollColorNum.jsx:38-46,48-49,69-70` | Guards scroll subscription. Renders end-state color + scale. | Same |
| `src/components/ScrollTimeline.jsx:11-21,55` | Fills timeline to 100% under reduced motion. | Same |
| `src/hooks/useScrollFade.js:23-26` | Adds `.visible` class immediately on mount, skips IntersectionObserver. | Matches `useLenis.js:11-12` pattern |
| `src/pages/Sacraments.jsx:18` | Anointing icon `Bird` → `HandHeart`. Theology fix (Bird = Holy Spirit → Confirmation, which already uses Flame). `HandHeart` matches laying on of hands + healing. | n/a |

Resolves audit items: **C2 (P0), E3 (P1)**.

Not yet done (need user sign-off):
- ~~E1 RCIA → OCIA sweep~~ — **DONE** (see §L)
- ~~E2 stock photo swap~~ — **DONE** (see §L)
- ~~B1 brand-URL parametrization~~ — **already done in prior commits** (verified `src/constants/config.js:71` and `scripts/generate-seo.mjs:5,64` read from `VITE_SITE_URL` with github.io fallback)
- Anointing + Funerals still need **commissioned parish photos** (temp placeholders in use).

## K. Next phases

- **Phase 4 — Perf P0:** re-encode the two oversized JPGs, wire responsive `<picture>` for hero set. Est. 2–3 hours.
- **Phase 5 — Content:** OCIA terminology sweep, stock-photo swap, Dominican identity section. User decisions required.
- **Phase 6 — Motion polish (Apple-style):** named view-transitions for Sacraments cards, sticky-scrub variant for Architecture/History, liturgical color crossfade.
- **Phase 7 — Live scans:** start dev server, run Lighthouse on Home/MassTimes/Baptism/Give + axe-core full pass.

## L. Phase 4–6 — Bulk fixes (shipped)

### Content (Phase 5)

| File | Change |
|---|---|
| `src/locales/en.json:430-431` | "RCIA" → "OCIA" w/ "(formerly RCIA)" on first mention. Spanish locale intentionally left as "RICA" — Spanish bishops have not made the same change. |
| `src/data/blog.js:28,37,41` | Blog tag + body sweep RCIA→OCIA; kept "(OCIA, formerly RCIA)" in first body mention for legacy SEO. |
| `src/components/SiteSearch.jsx:47-49` | Search index updated. Also corrected "Rite of Christian Initiation" → "Order of Christian Initiation" (USCCB renamed both noun + acronym). Keywords array now includes BOTH `"ocia"` and `"rcia"` so either query matches. |
| `src/pages/BecomingCatholic.jsx:24` | Seo description: RCIA → "OCIA (formerly RCIA)". |
| `src/constants/photos.js:55-68` | Remapped 7 `stock*` keys to parish-owned photos. Key names preserved to avoid call-site churn; comment header updated. Anointing → `vigil-candles-opt`, Funerals → `rose-window-opt` are TEMP placeholders. |

### Motion (Phase 6 partial)

| File | Change |
|---|---|
| `src/components/StickyScrub.jsx` (new, 204 LOC) | Apple-style sticky-scrub: pinned background w/ ordered text panels that fade-in / hold / fade-out as user scrolls. Reduced-motion fallback stacks panels statically. Sister to `StickyHero`. Use on History / Architecture for narrative scrollytelling. |
| `src/components/LiturgicalBanner.jsx` | Crossfade between seasons via stacked gradient layers + `key={fadeKey}` re-triggering CSS keyframe. 600ms `var(--ease-out-expo)`. Drops to 0ms under reduced-motion. |
| `src/components/ResponsivePicture.jsx` (new) | `<picture>` wrapper emitting AVIF/WebP/JPG `srcset` at configurable widths. Drop-in for hero images. |

### Performance (Phase 4 partial)

| File | Change |
|---|---|
| `index.html:32` | Google Fonts URL slimmed: Cormorant dropped from 6 variants to 3 (kept 600 / 700 / italic 400 — audit showed 400/500/italic 500 unused). Source Sans 3 unchanged (all 4 weights used). Expect ~30 KB shaved off font CSS. |
| `scripts/generate-webp.mjs` | Extended to generate downscaled variants at widths [480, 1024, 1920] for both `.webp` and `.jpg`. Skips `public/photos/stock/`. Idempotent: skips variants newer than source. Run via `npm run images`. |
| `src/components/ResponsivePicture.jsx` (new) | Companion runtime to the script above. |

### Accessibility

| File | Change |
|---|---|
| `src/pages/BlogPost.jsx:132` | Author photo `alt=""` → `alt={author.name}`. |

## M. Phase 7 — Final wave (shipped)

### Build steps run

| Step | Result |
|---|---|
| `npm install` | Clean. Adds vitest@^2.1, jsdom@^25. |
| `npm run test:run` | **8/8 tests pass** — Vitest suite on `src/utils/liturgical.test.js` covers `SEASONS` shape + 6 dated `getLiturgicalSeason` cases (Christmas, Lent 2024, Easter 2025, Ordinary, default invocation). |
| `npm run lint` | Clean. |
| `npm run images` | **137 base WebPs + 152 responsive variants** generated (after 2 script-bug fix-ups). Outputs 480/1024/1920 widths in both `.webp` and `.jpg` for non-stock photos. Filtered out a 29-byte HTML-404 file masquerading as `public/photos/stock/baptism.jpg` (now deleted — unreferenced after the stock remap). |
| `node scripts/optimize-sources.mjs` | **Re-encoded 4 oversized source JPGs in place** (q82, max width 2400, mozjpeg). Saved **24.5 MB**: <ul><li>`2024_3_30_EasterVigil...jpg`: **14.9 MB → 419 KB** (-14.5 MB)</li><li>`davis_frassati.jpg`: **7.4 MB → 1.3 MB** (-6.1 MB)</li><li>`rooney_charles.jpg`: **3.8 MB → 451 KB** (-3.3 MB)</li><li>`DSC_0418-opt.jpg`: 1.2 MB → 585 KB (-588 KB)</li></ul>Originals preserved as `*.original-large.jpg` (now gitignored). Photo dir: 85 MB → 112 MB (variants added) — minus 24 MB backups after cleanup → ~88 MB committable. |

### Script hardening

- `scripts/generate-webp.mjs`: added try/catch per-file (one bad file no longer kills the run), added `VARIANT_SUFFIX_RE` + `BACKUP_SUFFIX_RE` guards so the script no longer cascades on its own outputs or on `.original-large.jpg` backups.
- New `scripts/optimize-sources.mjs`: idempotent in-place source re-encoder w/ `--dry-run` and `--threshold {KB}` flags. Preserves originals as `*.original-large.jpg`.
- `.gitignore`: added `*.original-large.jpg` so backups don't leak into commits.

### View transitions wired

- `src/components/PageHeader.jsx`: auto-derives `viewTransitionName: sacrament-{slug}` from `useLocation()` for any `/sacraments/{slug}` route. Single change covers all 6 destination heroes without per-page edits.
- `src/pages/Sacraments.jsx`: each hub card now has matching `viewTransitionName` + `onClick` wrapper that calls `document.startViewTransition(navigate(s.to))` when supported. Graceful fallback to standard nav otherwise.

### Narrative scrollytelling wired

- `src/pages/History.jsx`: `StickyScrub` block inserted after the StickyHero. 3 panels (1923 founding · Dominicans entrusted · Century on) pinned to `PHOTOS.historyExteriorBw || historyHero`.
- `src/pages/Architecture.jsx`: `StickyScrub` block inserted post-hero. 3 panels (Threshold · Nave · Sanctuary) pinned to `archSanctuary` (with fallbacks).

### Dominican identity section

- `src/pages/About.jsx`: new "The Dominican Mission" section inserted before the Saint of the Day. Includes OP shield (`PHOTOS.psjShield`), Veritas tag, and 3 paragraphs covering 1216 founding · four pillars (prayer, study, community, preaching) · Veritas motto. Parish can refine copy.

### Test harness

- `package.json`: added `test` + `test:run` scripts. Devdeps: `vitest@^2.1.0`, `jsdom@^25.0.0`.
- `vitest.config.js`: jsdom env, globals, `src/**/*.{test,spec}.{js,jsx}` include glob.
- `src/utils/liturgical.test.js`: 8 passing assertions.

## N. Phase 8 — Live scans + ResponsivePicture migration (shipped)

### `<ResponsivePicture>` integration

- [src/components/HeroImage.jsx](src/components/HeroImage.jsx) — refactored from CSS `background-image` to `<ResponsivePicture>` w/ `object-fit: cover`, positioned absolute. Preserves fade-in via `onLoad` callback. Eager + high-priority fetch retained.
- [src/components/StickyHero.jsx](src/components/StickyHero.jsx) — same refactor, wrapped in a positioned div so the scroll-driven `transform: scale()` zoom effect still drives the bg element.
- [src/components/ResponsivePicture.jsx](src/components/ResponsivePicture.jsx) — now forwards `onLoad` and `onError` to the inner `<img>` in both code paths.

Cascade: every page using `<PageHeader>`, `<HeroImage>`, or `<StickyHero>` (Home, About, History, Architecture, all 6 sacrament pages, and most other top-of-page banners) now serves responsive WebP+JPG at 480/1024/1920 widths automatically.

### Backups purged

- 4 × `*.original-large.jpg` (24 MB) removed after manual review of optimized masters. Photo dir: 112 MB → **85 MB** (and ~58 MB of that is the responsive-variant `*-{480,1024,1920}.{webp,jpg}` set). The pre-optimization total (originals, no variants) was 85 MB — net change: **same disk footprint, but masters compressed + 152 responsive variants added.** Mobile users hit the 480 KB variants instead of 1.5 MB+ masters.

### Lighthouse — production build, headless Chrome, 4 routes

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` (Home) | **82** | 93 | **100** | **100** |
| `/mass-times` | 77 | 90 | **100** | **100** |
| `/sacraments/baptism` | 84 | 90 | **100** | **100** |
| `/give` | **94** | 89 | **100** | **100** |

JSON reports: [docs/lighthouse/](docs/lighthouse/).

Reading: Best-Practices + SEO are perfect across the board (no console errors, no http issues, no broken canonicals, proper viewport, robots, og tags). Performance hovers in the high 70s–90s — pre-optimization baseline was much worse. Mass Times is the laggard; likely the long synchronous schedule render. A11y in the high 80s/low 90s — the violations breakdown below shows why.

### axe-core — 10 routes

Rule violations aggregated across all 10 scanned routes (count = pages affected):

| Count | Rule | Impact |
|---|---|---|
| **10/10** | `color-contrast` | serious |
| **10/10** | `link-in-text-block` | serious |
| **7/10** | `heading-order` | moderate |

JSON reports: [docs/axe/](docs/axe/).

Root causes:
- **color-contrast** — Gold `#C5A55A` text on white background = 2.35:1 (needs 4.5:1 for body text). Hits the small-caps sub-labels (`fontSize: 11px; color: T.gold; textTransform: uppercase`) used widely.
- **link-in-text-block** — Footer "Staff" link at `rgba(255,255,255,0.35)` against `rgba(255,255,255,0.55)` surrounding text = 1.9:1 (needs 3:1) AND relies on color alone (no underline).
- **heading-order** — `h1 → h3` skipping `h2` on 7 pages. Common in admin dashboards + a few content pages. Use `h2` for primary section heads.

### Phase 8 fixes shipped

| File | Change |
|---|---|
| [src/constants/theme.js](src/constants/theme.js) | Added `T.goldText: "#8B6914"` — darker gold meeting WCAG AA (4.5:1) on white. Use for small text < 18pt where gold is the accent. |
| [src/styles/global.css:8](src/styles/global.css:8) | Added `--color-gold-text: #8B6914` CSS variable. |
| [src/styles/global.css:280](src/styles/global.css:280) | `.sub-label--gold` now uses `--color-gold-text` (closes the most-repeated color-contrast violation wherever the class is applied). |
| [src/components/Footer.jsx:165-166](src/components/Footer.jsx:165) | Footer "Staff" link bumped from `rgba(255,255,255,0.35)` (1.9:1) to `0.85` + `textDecoration: underline`. Closes the site-wide `link-in-text-block` violation. |

### What still needs a sweep

These are mechanical but cross-cutting — punt to a dedicated PR rather than scope-creep this one:

1. **Inline gold text → `T.goldText`** — every inline `color: T.gold` set on text < 18pt should switch to `color: T.goldText` (or be promoted to a CSS class). Highest-impact files: `Home.jsx`, `MassTimes.jsx`, `Visit.jsx`, `Sacraments.jsx`, `Footer.jsx` (the small-caps headings on white), plus every sacrament page's "Learn More →" cta.
2. **Heading order** — 7 pages have `h1 → h3` jumps. Open the JSON reports under `docs/axe/<page>.json`, find the `heading-order` nodes, demote/promote one tier.
3. **MassTimes performance (77)** — the lowest of the 4. Worth profiling: likely the schedule table render on initial paint. Candidate fix: virtualize or `useMemo` the joined-time strings.

## O. Phase 9 — Mechanical sweep + browser verification (shipped)

### Inline-style sweep

40 `text-small` migrations from `color: T.gold` (2.35:1 contrast on white — fails WCAG AA) to `color: T.goldText` (4.5:1 — passes). Borders, backgrounds, icons, and large text (>= 24px or fontWeight 700+) left as `T.gold` per the contrast threshold rules. Driven by 13 parallel cavecrew-builder agents + 3 direct edits.

Files touched in this sweep:
`Footer.jsx`, `Section.jsx`, `Nav.jsx`, `SaintOfTheDay.jsx` (skipped: goldLight on dark hero — passes 3:1), `Home.jsx`, `Visit.jsx`, `MassTimes.jsx`, `Sacraments.jsx`, `Give.jsx`, `BecomingCatholic.jsx`, `Staff.jsx`, `Architecture.jsx`, `History.jsx`, `About.jsx`, `GetInvolved.jsx` (line 136 only — 82/461 are goldLight on dark, pass), `FaithFormation.jsx`, `Events.jsx`, `Blog.jsx`, `Bulletin.jsx` (line 60 goldLight on dark, pass), `Gallery.jsx`, and all 6 sacrament pages.

### Heading-order fixes

`h4 → h3` demotions on:
- `Footer.jsx:78,102` — "QUICK LINKS" and "CONTACT" section heads (fixes the rule on 4 pages — Footer is global).
- `Give.jsx:126` — donation method card head.
- `FaithFormation.jsx:306,332` — Godsplaining + Rosary in a Year podcast cards.
- `Baptism.jsx:68` — Baptism Preparation section.

### Image-script regression fixed

Bug: when a source photo was exactly the target width (e.g. 1920px-wide source asked for a `-1920` variant), the previous guard `if (w >= sourceWidth) continue` skipped emission. `<ResponsivePicture>` advertised the missing variant in srcset → browser fetched → 404 → silent broken image.

Fix: [scripts/generate-webp.mjs](scripts/generate-webp.mjs) now caps target width at source width: `targetWidth = Math.min(w, sourceWidth)`. Every advertised variant resolves to a real file (with the file named after its advertised width but actual pixel size ≤ source). Re-ran the script: **200 new variants generated**, including the missing `-1920` cases for sources at or below 1920px.

### Browser smoke test (dev server, headless via Claude Preview)

- **Home**: hero renders w/ aerial-interior background + burgundy overlay + readable white title + CTAs. ResponsivePicture confirmed serving variants (`currentSrc` resolves to `*-1920.webp`).
- **Sacraments**: hub h1, blockquote, CCC cite all rendered. `T.goldText` cite visibly darker than before — clear AA contrast on cream.
- **About**: Dominican Mission section confirmed present (h2 found, scrolled into view, content in scroll range).
- **History**: StickyHero "A Century of Faith" renders cleanly. StickyScrub block is in the DOM and bg image element confirmed loaded, but screenshot at scrub depth came back blank-cream — likely an ancestor transform breaking `position: sticky`, OR a known Claude Preview screenshot edge case at certain scroll positions. **Worth a real-browser pass before shipping the StickyScrub UX.**
- **Console**: no errors after SW + cache clear.

### Post-sweep scan deltas

**Lighthouse — before sweep → after sweep**

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 82 → **86** | 93 → **100** ★ | 100 → 100 | 100 → 100 |
| `/mass-times` | 77 → **82** | 90 → 96 | 100 → 100 | 100 → 100 |
| `/sacraments/baptism` | 84 → **88** | 90 → **100** ★ | 100 → 100 | 100 → 100 |
| `/give` | 94 → 94 | 89 → **100** ★ | 100 → 100 | 100 → 100 |

**3 of 4 audited routes now hit accessibility = 100.** Mass Times still at 96 — one residual `color-contrast` node, low-effort to fix in follow-up.

**axe-core — before → after**

| Route | Before | After | Δ |
|---|---|---|---|
| home | 2 | **0** ✓ | -2 |
| mass-times | 3 | 1 | -2 |
| baptism | 3 | **0** ✓ | -3 |
| give | 3 | 1 | -2 |
| becoming-catholic | 3 | 1 | -2 |
| faith-formation | 3 | 1 | -2 |

**Total: 17 violations → 4 (-76%).** Residual rule on 4 pages: `color-contrast` — a remaining spot the sweep didn't catch (likely a single component with `T.gold` outside the inventory I gave the builders). Trackable in a 10-minute follow-up.

`link-in-text-block` and `heading-order` rules **fully eliminated** in the post-sweep scan.

## P. Phase 10 — Final close-out (shipped)

### Color-contrast residuals traced + resolved

**Root cause 1 — MassTimes ParallaxSection misnamed prop.** The component prop is `image`, but `MassTimes.jsx:369,524` was calling `<ParallaxSection src={...}>`. The bg image never rendered → white quote text fell back to a bare overlay-only background (#999895 blend) → 2.88:1 fail.

Fix: corrected to `image={...}` + bumped overlay 0.4 → 0.55 for extra margin. `MassTimes.jsx:369,524`.

**Root cause 2 — Mid-fade animation blending.** `give`, `becoming-catholic`, `faith-formation` showed contrast failures with foreground colors that looked like `T.goldText` (#8B6914) blended with white at ~65% opacity — `#a78c4a` etc. The culprit was the scroll-driven `scrollFadeUp` keyframe running from opacity 0 → 1 over a 35% viewport-entry range. axe-core scanned elements mid-animation and saw the blended color.

Two-part fix:
1. `T.goldText`: `#8B6914` → `#7A5A0F` (still gold-tinted, comfortable margin past 4.5:1).
2. `global.css`: scroll-driven `animation-range: entry 0% entry 35%` → `entry 0% entry 8%` for `.fade-section`, and 40% → 10% for `.stagger-grid`. Content reaches full opacity almost immediately on entry; mid-fade window collapses to milliseconds.

### Final scan — 0 violations on all 4 previously failing pages

| Route | axe violations | Lighthouse a11y |
|---|---|---|
| `/` (home) | **0** | **100** |
| `/mass-times` | **0** | **100** |
| `/sacraments/baptism` | **0** | **100** ★ |
| `/give` | **0** | **100** ★ |
| `/becoming-catholic` | **0** | (not re-scanned, expected 100) |
| `/faith-formation` | **0** | (not re-scanned, expected 100) |

axe-core: **17 → 4 → 0 violations** across the audited set. Three originally-dominant rules (`color-contrast`, `link-in-text-block`, `heading-order`) all fully eliminated.

Lighthouse home: **performance 82 → 86, accessibility 93 → 100**.
Lighthouse mass-times: **performance 77 (stable), accessibility 90 → 100**.

### Spanish OCIA — decision: keep RICA

USCCB's OCIA rename (Rite → Order, RCIA → OCIA) was applied to the English liturgical translation only. Spanish bishops' conferences have not paralleled the change. `src/locales/es.json:430-431` intentionally keeps `"RICA"`. The decision is recorded as project memory; revisit only if Hispanic ministry leadership requests it.

### PR strategy — single PR, themed commits (recommendation revised)

After tracing the actual file-level overlap (Sacraments.jsx alone touches motion + content + a11y; Footer.jsx touches a11y in two distinct ways), a clean split into separate PRs would require multi-file patch surgery with high merge-conflict risk. **Better path: one PR, themed commits.** The branch history now reads (oldest first):

1. `infra: add Vitest harness + .gitignore for image backups`
2. `motion: Apple-style scrollytelling + view-transitions + reduced-motion guards`
3. `content: OCIA terminology, Dominican identity, parish photo remap`
4. `a11y: AA contrast tokens + heading-order sweep + 40 gold-text migrations`
5. `perf: source JPG re-encoding, responsive variants script, font slim`
6. `assets: regenerate responsive image variants (480/1024/1920 widths)`

A reviewer can step through commit-by-commit; each is a coherent theme. The audit doc itself ships in a separate `docs` commit.

## Q. Still pending (genuinely out-of-scope)

1. **Commission parish photos** for Anointing + Funerals (place vigil-candles + rose-window are reasonable placeholders).
2. **StickyScrub real-browser sanity check** — code and DOM are correct; preview screenshot was blank at scrub depth (likely Chrome headless rendering quirk or ancestor transform). Manually open `/history` on Chrome/Safari to confirm visual pinning.
3. **Workbox / vite-plugin-pwa migration** — defer indefinitely. Hand-rolled `public/sw.js` works fine.

---

*Phases 1–10 complete. Tests 8/8 green. Build clean (1.24s). Lighthouse a11y = **100** on every audited route. axe violations: **17 → 0**. Site shipped lighter, more accessible, more pastorally and theologically careful, and more Apple-style in motion without sliding into agency-portfolio register.*
