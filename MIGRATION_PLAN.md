# Pulaski Parade → Empire Design Language Migration Plan

Goal: adopt Empire Unlimited's visual design language (header, typography, card styles, hero layout, feature grids, footer, animation system) on the Pulaski site while keeping **100% of existing Pulaski content** (copy, imagery, video, documents, countdown, gallery, Grand Marshal, sponsor content, etc.).

This plan is a blueprint only — **no files are modified yet**. Await approval before execution.

---

## 1. Current Pulaski Inventory

### 1a. `index.html` (1,318 lines, single-page)
Consolidated landing page. Section IDs and anchors already exist; everything is routed via `href="#..."`.

| # | Section | Line | Notes |
|---|---|---|---|
| 1 | `<head>` | 1–~80 | Favicons, theme-color `#C8102E`, inline styles, font stack (currently system fonts — no Google Fonts imported in index). |
| 2 | Topbar (`.topbar`) | ~480 | Thin strip above navbar: date + call-to-action. |
| 3 | Navbar (`.navbar`, `#hamburger`, `#mobileNav`) | ~490 | Overlays the hero; 7 anchor links + mobile hamburger. |
| 4 | Hero (`<section id="hero">`) | 505–~690 | Full-viewport video background (`images/hero.mp4`), eyebrow, `<h1>`, theme line, countdown timer, two CTA buttons, scroll-cue. |
| 5 | Stats bar (`.stats-bar`) | ~690 | 4-up: 89 / 1937 / 5th Ave / 250. |
| 6 | About (`#about`) | 693–~790 | 2-col: bio + statue photo (left), timeline w/ 6 milestones (right). |
| 7 | Grand Marshal (`#parade`) | 792–~833 | Dr. Iwona Korga bio + headshot + PDF bio links (EN / PL). |
| 8 | Events (`#events`) | 835–~910 | Event cards + PDF contingent form link. |
| 9 | Gallery (`#gallery`) | 912–~955 | Thumb grid + lightbox modal. |
| 10 | Get Involved (`#involve`) | 957–~1066 | Dark-navy section: 4 cards (Volunteer / Sponsor / March / Donate) + PSFCU sponsor badge + membership doc link. |
| 11 | Contact (`#contact`) | 1068–~1124 | Contact details + mail / tel links + form or CTA. |
| 12 | Footer (`.lp-footer`) | 1126+ | Brand column + quick links + copyright. |
| 13 | Scroll-to-top button (`#scrollTop`) | bottom | Fixed, appears after scroll. |
| 14 | Inline `<script>` | bottom | Countdown, lightbox, scroll-reveal (IO), scroll-to-top, involve-card hover, smooth-scroll + navbar offset + mobile menu close. |

### 1b. `css/styles.css` (1,393 lines)
Legacy global stylesheet — still linked for shared tokens. Key variables:
- `--red: #DC143C` (used for accents / links / hero glow)
- `--navy: #C8102E` (misnamed — actually Polish red; powers `theme-color`)
- `--gold: #C9A84C`, `--gold-light: #E8C97A`
- Hero rule: `height/min-height/max-height: 100vh`, `display: flex`, with `::before` dark-gradient overlay
- `.hero h1 { opacity: 0; animation: heroFadeUp … }` — currently overridden inline in `index.html` to force `opacity: 1 !important`
- Responsive breakpoints: 500 / 767 / 768 / 900 / 1100 px

### 1c. `js/main.js` (287 lines)
- Hamburger toggle
- Countdown to **2026-10-04 12:30** (days/hours/minutes/seconds elements)
- Scroll-to-top
- Tabs + accordion (unused on consolidated page but kept)
- Active-nav-link detector
- IntersectionObserver scroll-reveal w/ d1–d6 stagger classes (skips `.hero` / `.page-hero` descendants)
- Hero parallax (`translateY(scrollY * 0.38)` on `.hero-bg`, skipped on reduced-motion)
- Stats count-up with `easeOutQuad`, 1.4s
- Lazy image loader (`data-src`)
- Gallery lightbox (event-delegated)
- `loadMorePhotos()` helper (24-at-a-time reveal)

---

## 2. Empire Unlimited Design Primitives

Read from `../empireunlimited/index.html`, `css/style.css`, `js/main.js`.

### 2a. Tokens (`:root`)
```
--navy:       #1a2744     ← deep brand surface
--navy-dark:  #111c35     ← footer / overlays
--gold:       #c9a94e     ← accent (near-identical to Pulaski gold)
--gold-light: #dfc07a
--off-white:  #f8f7f4
--gray-light: #f5f5f5
--text-muted: #6c6c6c
--font-serif: 'Playfair Display', Georgia, serif
--font-sans:  'Open Sans', -apple-system, …
--shadow-sm/md/lg, --radius: 6px, --transition: 0.25s ease
```

### 2b. Reusable Components
| Primitive | What it is | Used in Pulaski mapping |
|---|---|---|
| `.info-banner` | Thin gold strip with mini-CTA above header | Pulaski topbar |
| `.site-header` + `.header-inner` + `.header-nav` + `.nav-toggle` + `.nav-mobile-ctas` | Sticky navy header, centered logo, uppercase micro-letterspaced links, gold-on-hover, responsive hamburger panel | Pulaski navbar |
| `.hero` + `.hero-bg` + `.hero-inner` + `.hero-content` + `.hero-eyebrow` + `.hero-sub` + `.hero-btns` | 80vh hero; 135° dark gradient overlay; serif `<h1>`; keyframe-staggered entry | Pulaski hero (keep `<video>` element — replace `.hero-bg` image with autoplaying muted video layer) |
| `.page-hero` + `.page-hero-bg` + `.page-hero-content` | 40vh shorter hero for interior "pages" | Use as **sub-section intro** banners if we section-ify |
| `.section` / `.section-alt` / `.section-navy` | Vertical-rhythm wrapper (5rem 0 / alt bg / dark) | All Pulaski content sections |
| `.section-heading` + `.gold-rule` (+ `.centered`) + `.section-subheading` | Standard section intro: serif h2, 60×3 gold bar, muted subheading | All headings |
| `.stats-strip` + `.stats-grid` + `.stat-num` + `.stat-label` | Navy bar, 4-up serif gold numbers, uppercase labels | Pulaski stats bar (89/1937/5th Ave/250) |
| `.apt-photo-grid` + `.apt-photo-card` + `.apt-photo-overlay` + `.apt-photo-label` | 3-col image-tile grid, zoom-on-hover, bottom gradient + serif label | Pulaski gallery thumbnails |
| `.why-empire-grid` + `.why-card` + `.why-card-photo` + `.why-card-body` + `.why-card-title` | 4-col image-cards-on-navy (photo + gold uppercase title + muted blurb) | Pulaski "Get Involved" cards |
| `.feature-card` + `.feature-icon` | Simple icon/title/blurb card on white | **Best fit for timeline milestone cards** (historical dates) |
| `.home-feature-card` | Similar feature card with gold-circle icon — light bg | **Events section card** |
| Teaser 2-col grid (`.pinnacle-teaser-grid` pattern — inline styles) | Gold "badge" + serif h2 + gold-rule + body + CTAs next to image | **Grand Marshal** section + **About bio + statue** |
| `.locations-list` + `.location-pill` | Gold rounded pills, centered | Could tag contingent categories / parade route landmarks |
| `.social-section` + `.social-links` | Off-white band, rounded social pills | Optional: add under Contact |
| `.cta-banner` | Navy gradient, centered h2 + p + buttons | Pre-footer "Join the Parade" CTA |
| `.site-footer` + `.footer-grid` (1.4fr/1fr/1fr/1fr) + `.footer-col` + `.footer-bottom` + `.footer-social` + `.equal-housing` pattern | 4-col dark footer, brand column + link columns + bottom bar | Pulaski footer (swap equal-housing for GPMPC 501(c)(3) line) |
| `.btn` / `.btn-primary` (gold) / `.btn-outline` (white border) / `.btn-navy` / `.btn-outline-navy` / `.btn-sm` | Consistent button system, uppercase micro-tracked | All Pulaski CTAs |
| Forms: `.form-group` / `.form-control` / `.form-row` / `.form-message` | Navy label, gold focus ring, 2-col grid → 1-col mobile | If Pulaski contact form is enabled |

### 2c. Empire's Existing Animations
1. `@keyframes heroFadeUp` — 36px translateY → 0 + 0 → 1 opacity, `.7s ease`, cascading delays `.15s / .35s / .55s / .75s` on `.hero-eyebrow`, `.hero h1`, `.hero-sub`, `.hero-btns` (and page-hero variants).
2. `@keyframes heroFadeIn` — defined but not actively used (spare).
3. **Scroll-reveal** — `.reveal { opacity:0; transform:translateY(38px) }` → `.visible`, `.65s cubic-bezier(.22,.61,.36,1)`, with `.d1`–`.d6` stagger delays (80ms steps) auto-applied to `.reveal` children of `.features-grid`, `.apt-grid`, `.prev-developed-grid`, `.new-homes-features`, `.floor-plans`, `.stats-grid`, `.social-links`, `.locations-list`. IO threshold `0.12`, rootMargin `0 0 -40px 0`.
4. **Card hover lift** — `.feature-card:hover { translateY(-6px) scale(1.015) }`, `.apt-card:hover { translateY(-5px) }`, `.home-feature-card:hover { translateY(-5px); border-color: gold }`, `.why-card:hover { translateY(-3px); border-color: rgba(gold,.55) }`, `.lot-card:hover { translateY(-3px) }`.
5. **Button press** — `.btn:active { scale(.97) translateY(1px) }`.
6. **Gallery zoom** — `.apt-gallery:hover img.active { scale(1.045) }`, `.apt-photo-card:hover img { scale(1.05) }` (550ms / 300ms).
7. **Hero parallax** — JS writes `transform: translateY(scrollY * 0.38)` on `.hero-bg` (respects `prefers-reduced-motion`).
8. **Stats count-up** — `easeOutQuart`, 1.6s, IO-triggered, preserves prefix/suffix (`#`, `+`, `/mo`), skipped on `prefers-reduced-motion`.
9. **Photo-card filter shift** — `.why-card-photo img` goes from `brightness(.8) saturate(.9)` → `brightness(.95) saturate(1.1)` on hover.
10. **Gold-rule / focus-ring transitions** — input `:focus` → `border: gold + 3px gold-15% ring`.

---

## 3. Section Mapping — Pulaski → Empire Primitive

| Pulaski Section | Empire Primitive Treatment | Notes |
|---|---|---|
| **Topbar** | `.info-banner` (gold strip) | Content: parade date line + "Learn more →" anchor. Keep it dismissable-optional. |
| **Navbar** | `.site-header` + `.header-inner` + `.header-nav` + `.nav-toggle` + `.nav-mobile-ctas` | Keep 7 anchors: Home / About / Parade / Events / Gallery / Get Involved / Contact. Logo = Gen. Casimir Pulaski crest. Mobile CTAs: "Donate" (primary gold) + "March With Us" (outline). |
| **Hero** | `.hero` variant with `<video>` instead of `.hero-bg` image | Keep existing `<video autoplay muted loop playsinline poster>` but place it at `.hero-bg` coordinates (`position:absolute; inset:0; object-fit:cover`) and layer Empire's 135° navy→black gradient via `::after`. Use Empire's `.hero-content` + `.hero-eyebrow` + `<h1>` + `.hero-sub` + `.hero-btns` exactly. **Embed countdown inside `.hero-content` as a bespoke block (new primitive — see §5 new-animations).** |
| **Stats bar** | `.stats-strip` + `.stats-grid` | Four `.stat-num` / `.stat-label` pairs. Swap `"1937"` label → `"Year Founded"`, `"5th Ave"` label → `"New York City"`, etc. Empire count-up animation works out-of-box for 89 / 1937 / 250; "5th Ave" stays static (parser skips non-numeric). |
| **About — bio + statue** | 2-col teaser pattern (à la `.pinnacle-teaser-grid`): eyebrow badge + `.section-heading` + `.gold-rule` + 3 bio `<p>` on left; statue photo with `.shadow-lg` + `aspect-ratio:4/3` on right | Use existing `images/general-casimir-pulaski.jpg`. Responsive: image moves above bio at `<768px`. |
| **About — timeline** | Convert to `.features-grid` of `.feature-card`s, each with a year badge where the icon would be | 6 cards: 1748 Birth / 1763 Fighting / 1771 Exile / 1777 America / 1779 Savannah / 1929 NYC Parade. Renders as responsive 2–3 col grid with stagger reveal. |
| **Grand Marshal** | 2-col teaser pattern again | Headshot + `.gold-rule` + badge "2026 Grand Marshal" + bio + two PDF-download buttons (`.btn-outline-navy` EN / PL). |
| **Events** | `.section-alt` bg + `.new-homes-features` grid of `.home-feature-card` | Each event: gold-circle icon (calendar / flag / star) + date + title + venue + short description + "Add to calendar" or PDF link. Keeps the contingent-form PDF as a final full-width `.cta-banner`-style callout. |
| **Gallery** | `.apt-photo-grid` + `.apt-photo-card` + `.apt-photo-overlay` + `.apt-photo-label` | Reuse existing lightbox JS (event-delegated on `[data-src]`) — wrap each `.apt-photo-card` with `data-src`/`data-alt` for modal. 3-col → 2-col → 1-col responsive. "Load more" button becomes a `.btn-outline-navy` below the grid. |
| **Get Involved** | `.section-navy` + `.why-empire-grid` of `.why-card`s (4-up) | Volunteer / Sponsor / March / Donate. Each card: photo band + gold uppercase title + blurb + inline link. PSFCU sponsor badge becomes a **sub-band below the grid** using a centered `.locations-list` pattern — but replaced with a single wide "Presented in partnership with" band containing the PSFCU logo on navy-dark with a gold hairline border. |
| **Contact** | 2-col `.contact-grid` (form left, sidebar right) | Left: optional Formspree-wired form using Empire's `.form-group` / `.form-control` / `.form-row`. Right: `.contact-sidebar` with tel / email / mailing address + `.social-links` row. |
| **Pre-footer CTA** (new) | `.cta-banner` | "Join Us on October 4, 2026" + buttons: View Events / Become a Sponsor. |
| **Footer** | `.site-footer` + 4-col `.footer-grid` | Brand column (crest + short paragraph + social). Cols: Parade / Get Involved / Documents / Contact. Bottom bar: "© 2026 General Pulaski Memorial Parade Committee, Inc. — 501(c)(3) nonprofit." (replaces Empire's Equal Housing logo with a 501(c)(3) / ein line). |
| **Scroll-to-top** | Keep existing Pulaski `#scrollTop` button (Empire doesn't have one) | Restyle as `.btn` with navy background + gold icon. |

### Pulaski sections without a direct Empire equivalent
| Element | Proposal |
|---|---|
| **Countdown timer** (days/hours/minutes/seconds) | New primitive `.countdown-block` embedded inside `.hero-content` below the buttons. Four pill-shaped navy tiles with gold serif numbers + uppercase labels. Keep existing JS IDs (`cd-days`/`cd-hours`/`cd-minutes`/`cd-seconds`) untouched. |
| **Scroll-cue chevron** (hero bottom) | Keep as small absolute-positioned element inside `.hero`; restyle to a centered gold bouncing arrow (reuse Empire `.gold-rule` color + `@keyframes` new). |
| **Lightbox modal** | Keep Pulaski's JS verbatim; retheme overlay to Empire navy-dark-.92 + gold close-button border. |
| **PSFCU sponsor badge** | New "presenting partner" band using a centered container with white card on navy background, 1px `rgba(gold,.3)` border, logo ~120px wide. |
| **PDF download buttons** (Iwona bio EN/PL, contingent form, membership form) | Use `.btn-outline-navy` with a trailing download SVG — no new primitive needed. |

---

## 4. Color System Decision — RECOMMENDED

> **Default recommendation: KEEP Pulaski red `#DC143C` as the primary accent, ADOPT Empire navy `#1a2744` / `#111c35` as the dark surface color, KEEP gold `#C9A84C` as the secondary accent.**

### Why this split works
- **Red is non-negotiable brand DNA.** The Polish flag is white/red; the parade identity is red-and-white. Replacing red with navy would strip the parade's national meaning.
- **Empire's navy is a *surface* color, not an accent.** In Empire, navy is the header background, the dark section bg, the footer bg — gold does the accenting. Pulaski can adopt navy for the *surfaces* (header, `.section-navy`, footer, CTA banner) and let red + gold do the accenting.
- **Gold is already shared.** Both systems use a near-identical gold (`#C9A84C` Pulaski vs `#c9a94e` Empire). Unify on Empire's `#c9a94e` with no visible change.
- **Red + navy + gold is a historically coherent palette.** American Revolution / Polish-American civic visual tradition uses all three (flags, medals, sashes, parade banners).

### Concrete token proposal
```css
:root {
  /* Brand — Pulaski */
  --red:        #DC143C;   /* primary accent — buttons, links, hero underlines, section-red */
  --red-dark:   #A50E2B;   /* hover state */

  /* Surface — from Empire */
  --navy:       #1a2744;   /* header, dark sections, CTA banner */
  --navy-dark:  #111c35;   /* footer, overlays, hero gradient */

  /* Secondary — Empire/Pulaski gold (unified) */
  --gold:       #c9a94e;
  --gold-light: #dfc07a;

  /* Neutrals — from Empire */
  --white:      #ffffff;
  --off-white:  #f8f7f4;
  --gray-light: #f5f5f5;
  --gray:       #e8e8e8;
  --charcoal:   #2d2d2d;
  --text-muted: #6c6c6c;
  --border:     #ddd;
}
```

### Where each color goes
| Surface / Element | Color |
|---|---|
| `.info-banner` (topbar) | `--red` bg, white text (Polish flag inversion — reads as parade banner) |
| `.site-header` | `--navy` bg, white/gold text |
| Hero overlay gradient | `linear-gradient(135deg, rgba(17,28,53,.78) 0%, rgba(220,20,60,.35) 60%, rgba(0,0,0,.25) 100%)` — navy → subtle red wash → black |
| Primary button (`.btn-primary`) | `--red` bg, white text, `--red-dark` hover |
| Secondary / alternate (`.btn-gold`) | `--gold` bg, `--navy-dark` text (= Empire's current `.btn-primary`) |
| `.btn-outline` | transparent / white border (unchanged) |
| `.gold-rule` | `--gold` (unchanged) |
| `.stat-num` | `--gold` (same as Empire — serifed gold numbers on navy read beautifully) |
| `.section-navy` (Get Involved) | `--navy` bg |
| `.why-card-title` | `--gold` (unchanged from Empire) |
| `.cta-banner` | gradient `--navy` → `--navy-dark` with a thin `--red` top border |
| Footer | `--navy-dark` bg |
| Hero `<h1>` underline accent / eyebrow | `--red` (or `--gold` — pick per design review) |
| Links in body copy | `--red`, hover `--gold` |

### Alternative (NOT recommended, but flagged)
**Option B — "Empire-pure" palette:** drop red, use navy + gold only. Result: cleaner / more corporate-real-estate look but **loses the Polish flag identity**. Only choose this if the committee explicitly wants a de-ethnicized institutional look.

**Decision required from user before execution.** Default to Option A (red-kept) unless told otherwise.

---

## 5. Animation Plan

### 5a. Port all of Empire's existing animations verbatim
1. `heroFadeUp` cascade on hero eyebrow / h1 / sub / buttons (.15s / .35s / .55s / .75s delays).
2. `.reveal` + `.d1`–`.d6` scroll-reveal system with IntersectionObserver.
3. All card hover lifts (`.feature-card` / `.home-feature-card` / `.why-card` / `.apt-photo-card`).
4. `.btn:active` press.
5. `.apt-photo-card:hover img { scale(1.05) }` gallery zoom.
6. `.hero-bg` parallax (applied to the `<video>` element instead of a background-image div).
7. Stats count-up (`easeOutQuart`, 1.6s) on the stats strip.
8. Photo filter shift (`brightness/saturate`) on `.why-card-photo img`.
9. Focus-ring gold glow on `.form-control:focus`.

### 5b. Five NEW animations (beyond Empire)
These are additions specifically suited to a parade/celebration site:

1. **Flag-wave shimmer on `.hero h1`** — a slow diagonal gradient sweep across the word "Pulaski" (or the whole `<h1>`), ~3.5s loop, `background-clip: text` with a moving white highlight at 18% alpha. Reads as a subtle silk-flag catching light. *Disabled under `prefers-reduced-motion`.*

2. **Countdown tick pulse** — on every second's decrement, the `cd-seconds` tile does a 180ms `scale(1) → scale(1.06) → scale(1)` + a 2px gold glow box-shadow pulse. Makes the countdown feel alive. On day-rollover (`cd-days` changes), all four tiles pulse in sequence with 60ms stagger.

3. **Timeline year-badge count-up on reveal** — when each `.feature-card` historical milestone enters viewport, its year number (1748, 1763, …) counts up from `target - 50` to `target` over 900ms with `easeOutCubic`. Different from Empire's stat count-up (which always starts at 0) — feels like history rolling forward in time. Add a thin gold vertical rule on the left of each card that "draws in" from top to bottom during reveal (stroke-dashoffset-style, via `transform: scaleY` on a pseudo-element, 500ms delay matching the reveal).

4. **Smooth section-transition orchestrator** — see §6 below. This is NEW and Empire does not have it. Nav clicks trigger an 800ms choreographed scroll + fade; the currently-visible section dims to 0.35 opacity, scroll animates with custom easing, and the target section's children stagger-reveal as they enter the viewport.

5. **Ribbon-reveal for section headings** — each `.section-heading` + `.gold-rule` pair reveals with a 520ms animation in which the `.gold-rule` grows from `width: 0` → `60px` *after* the heading has faded up (180ms delay). Chain: heading fadeUp (320ms) → gold-rule grow (340ms ease) → subheading fadeUp (380ms). Adds a "ceremonial" beat that fits a parade site. Skipped under `prefers-reduced-motion`.

All new animations must respect `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }`.

---

## 6. Smooth Section-Transition Behavior (spec)

Empire's current behavior: `a[href^="#"]` → `window.scrollTo({ behavior: 'smooth' })` with a fixed 90px header offset. Instant fade in, no outgoing animation, relies on browser native smooth-scroll which ignores `prefers-reduced-motion` poorly on older Safari.

### New spec

**Trigger:** click on any nav link (`.header-nav a[href^="#"]`, `.nav-mobile-ctas a[href^="#"]`, CTA buttons, footer links) whose target is a section on the same page.

**Phase 1 — Outgoing (0–180ms)**
- Identify the "currently dominant" section — the `<section>` whose bounding rect intersects viewport center.
- Apply `.section-leaving` class → CSS transitions `opacity: 1 → 0.35` and `transform: none → translateY(-12px)` over 180ms `cubic-bezier(.4,0,.2,1)`.
- Simultaneously kick off the scroll animation in Phase 2 (they overlap).

**Phase 2 — Scroll animation (0–800ms)**
- Replace `window.scrollTo({behavior:'smooth'})` with a manual `requestAnimationFrame` loop using `cubic-bezier(.22,.61,.36,1)` (same curve as reveal). Duration: `800ms` regardless of distance, with a minimum of `500ms` if distance is <400px.
- Offset target by header height (read `.site-header` `offsetHeight` live — don't hardcode 90px).
- Respect `prefers-reduced-motion`: fall back to instant jump with `scrollTo({top, behavior:'auto'})`, skip phases 1 & 3.

**Phase 3 — Incoming (780–1,400ms)**
- At scroll completion, remove `.section-leaving` from the old section (restores it for when user scrolls back up).
- On the target section, sweep its direct children and apply `.reveal.visible` with staggered delays (d1 = 0ms, d2 = 80ms, …, up to d6 = 400ms). If children already had `.visible`, re-trigger by toggling.
- Add a one-shot `.section-entering` class to the target for a 320ms `opacity: 0.6 → 1` + `translateY(10px → 0)` fade-in that runs alongside the stagger.

**State management**
- Update `history.pushState(null, '', '#' + targetId)` *after* Phase 2 completes (so back-button works without re-triggering).
- Close the mobile nav (`.header-nav.open → closed`) on Phase 1 start.
- Debounce: ignore new clicks while `document.body.dataset.scrolling === 'true'`.

**Implementation sketch (to be written — NOT code yet)**
- New file `js/section-transitions.js`, ~120 lines.
- Exposes a single `initSectionTransitions()` invoked after DOM ready.
- Zero external dependencies.
- Replaces the existing smooth-scroll block in `main.js` and the inline smooth-scroll script in `index.html`.

**Acceptance criteria**
- Click "About" in navbar → hero dims, scroll glides exactly 800ms to About, About's heading → rule → subheading → bio/statue/timeline-cards stagger in over the next 400ms. No jumpcut. No flash. Works on iOS Safari / Chrome / Firefox / Edge. Reduced-motion users get instant jump with no visible animation. Back button returns to hero cleanly.

---

## 7. Execution Order (when approved)

1. Create new `css/empire-theme.css` with Empire tokens + primitives, adapted with Pulaski red palette from §4.
2. Rewrite `index.html` section-by-section to use the Empire primitives per §3 mapping. **All Pulaski text content, image paths, PDF links, countdown IDs, lightbox data attributes, form actions preserved verbatim.**
3. Link Playfair Display + Open Sans Google Fonts in `<head>`.
4. Port `js/main.js` animation blocks (reveal / parallax / count-up) and add new `js/section-transitions.js` per §6.
5. Add the 5 new animations from §5b.
6. Migrate the old `css/styles.css` — keep it linked as a *legacy compat* layer during migration, then remove once every section is confirmed working on Empire primitives.
7. Smoke-test all breakpoints: 375 / 480 / 768 / 900 / 1180 / 1440.
8. Verify: favicon, countdown ticks, lightbox opens, PDFs download, mobile hamburger single-nav-only, no horizontal overflow, reduced-motion respected.

---

## 8. Open Questions for User Before Execution

1. **Color palette:** confirm Option A (keep red, adopt navy surface, keep gold) per §4, or pick Option B (drop red).
2. **Hero video vs image:** keep the existing `images/hero.mp4` as the hero background, or adopt a single hero still and move video elsewhere?
3. **Contact form:** is Formspree (or any backend) wired up? If not, leave the form as a "Contact us at …" block with tel/email buttons only.
4. **Topbar content:** Empire's info-banner has one CTA line. What should Pulaski's say? (e.g., "October 4, 2026 — March with us →" linking to `#involve`.)
5. **New animations scope:** any of the 5 in §5b to cut or add?
6. **Legacy pages:** confirm `index.html` remains the only HTML file (per prior session decision) — no separate `about.html` / `events.html` / etc. to migrate.

Awaiting approval. No files modified.
