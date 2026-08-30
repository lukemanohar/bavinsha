# PROJECT DOCUMENTATION
## Cinematic Birthday Experience — Developer Handoff

*Written for a developer picking this project up fresh. Covers everything built, everything decided but not yet built, and everything flagged along the way — including context that lives only in project history, not in the code itself.*

---

## 1. What This Project Is

A six-chapter, full-screen-scroll birthday website, built as a personal gift. The creative brief was explicit: this should not read as a "birthday website" in the generic sense — no confetti, no balloons, no cartoon decoration. The intended feel is closer to a short film crossed with a luxury magazine editorial, told through scroll.

**Reference points named in the original brief:** Vogue, Apple product pages, A24 film sites, Saint Laurent, COS, Acne Studios, Loewe, Monocle, Maison Margiela.

**The core creative thesis** (from `design-blueprint.md` Sec. 0): *restraint as intimacy*. The site earns its emotion through pacing, negative space, and typography rather than spectacle. Every design rule in this document exists to protect that thesis from "make it more fun" scope creep later.

Three foundational documents were written before any code, and remain the source of truth for all decisions:

- **`design-blueprint.md`** — the full locked design system: color, type, spacing, motion philosophy, transition choreography, component hierarchy, technical architecture. Nothing in this file changes without an explicit request.
- **`implementation-roadmap.md`** — 17 milestones (with Milestone 9 split into four sub-milestones, 9a–9d) sequencing the build. Each milestone has its own test criteria.
- **This document** — the connective tissue between the two: what actually got built, where it deviated from plan, what's still open.

---

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Build tool | Vite (React + SWC plugin) |
| Framework | React 18 |
| Smooth scroll | Lenis, frame-synced to GSAP's ticker |
| Scroll-tied animation | GSAP + ScrollTrigger |
| Micro-interactions | Framer Motion (installed, not yet used — reserved for isolated UI, not scroll narrative) |
| 3D | React Three Fiber + Drei (Chapter 4 only) |
| Styling | CSS Modules + one global `tokens.css` |
| Routing | None — single continuous scroll, no React Router |

All dependencies are pinned in `package.json`. No new dependencies were added after Milestone 1 beyond what was originally scoped.

---

## 3. Getting Started

```bash
npm install
npm run dev      # Vite dev server
npm run build    # production build
npm run preview  # preview the production build locally
```

**Important environment note:** during this project's build sessions, the working sandbox had no network access to the npm registry, so `npm install`/`npm run build` were never actually executed by the assistant — every milestone's correctness was verified by hand (full file read-throughs, grep-based duplicate/reference checks, checksum comparisons between sessions). **Running the real install and build for the first time should be the first thing the incoming developer does**, treating it as unverified until confirmed.

---

## 4. Architecture & Folder Structure

```
src/
├── components/     Shared, cross-chapter components
├── sections/       One folder per chapter (Hero, CinematicTransition, Story,
│                   MemoryWorld, Letter, Ending), each with index.jsx,
│                   [Name].module.css, and a subcomponents/ folder only if
│                   it has a repeatable child unit
├── animations/     GSAP timeline factories — pure functions, no JSX, taking
│                   refs and building tweens/ScrollTriggers
├── hooks/          Shared stateful logic (no JSX)
├── assets/         images/ audio/ fonts/ — all currently empty except READMEs
├── data/           content.js — the single source of truth for all copy
├── shaders/        Reserved, unused (no custom GLSL was needed)
├── utils/          Small shared constants (breakpoints, easing curves)
├── styles/         tokens.css (design tokens) + global.css (reset/base)
└── dev/            TokenPreview.jsx — QA-only, never shipped in the render tree
```

**Folder structure is locked** per an explicit early instruction — no new top-level folders were introduced even when it would have been convenient (see the `AppProvider` discussion in §9).

### 4.1 The core architectural rules that were actually followed throughout

1. **No hardcoded design values outside `tokens.css`.** Every color, font size, spacing value in every component's CSS Module reads from a custom property. Where a *JS* value needs to match a token (Three.js light colors, GSAP-animated `filter`/`backgroundColor` values — CSS custom properties can't be read directly by WebGL or by some GSAP targets), the value is duplicated as a plain constant with a comment stating which token it must stay identical to. This happened in: `SoftLighting.jsx`, `FloatingObject.jsx`, `SceneCanvas.jsx`, `memoryWorldExit.js`.
2. **All copy lives in `data/content.js`.** No section ever has a hardcoded string. Every chapter's content is a keyed section of one exported object (see §7).
3. **Every chapter's motion lives in its own `animations/*.js` file** (or, for Memory World's per-object/per-frame logic, directly in the relevant component), built as a pure function taking refs, called from inside a `gsap.context()` scoped to that chapter's root element in a `useEffect`, cleaned up via `ctx.revert()`. This pattern is identical across Hero, Cinematic Transition, Story, Letter, and Memory World's exit transition.
4. **Repeatable units get their own component in a `subcomponents/` folder** (Story's `StorySpread`, Letter's `InkParagraph`); single-use pieces are composed inline in the parent `index.jsx` rather than split into files that would only ever have one caller (Hero's `CoverTitle`/`SubtitleDeck`/`ScrollCue`, Story's `FullWidthQuote`, Ending's inline `BlackHold` phase).
5. **`prefers-reduced-motion` is checked via a single shared hook** (`useReducedMotion`), and every chapter's animation factory takes a `prefersReducedMotion` boolean and branches to a simplified version — almost always "collapse to one simple opacity fade, skip the scroll-scrub/transform entirely," never a partial/approximate version of the full motion.
6. **Real assets don't exist yet anywhere in the project** (no photos, no audio files, no licensed fonts). Every place an asset would go instead renders an honest, visible placeholder (a labeled box, a silent no-op audio toggle) rather than a broken image icon or a crash. This is deliberate and consistent site-wide: `PortraitFrame` (Hero), `StoryImage` (Story), `FloatingObject`'s geometric stand-ins (Memory World), `AudioController`'s null-src guards.

---

## 5. Design System Reference (summary — `design-blueprint.md` is authoritative)

### Colors
| Token | Hex | Use |
|---|---|---|
| `--color-black` | `#050505` | primary background, ~80% of the site |
| `--color-ivory` | `#F6F3ED` | Letter chapter only |
| `--color-gold` | `#C6A86A` | accent only, max ~5% of any viewport |
| `--color-white` | `#FFFFFF` | primary text on black |
| `--color-muted` | `#B7B7B7` | secondary text on black |
| `--color-ink` | `#1A1714` | body text on ivory |
| `--color-ink-muted` | `#6B655C` | secondary text on ivory |

No other colors are permitted. Any place a design needed a "tint" of a color (grain overlay noise, vignettes, nav background, credit glow), it's produced via CSS `color-mix()` against these seven tokens — never a new hex value.

### Typography
- Display serif: **Canela** (fallback chain: Cormorant Garamond → Times New Roman → serif)
- Sans: **Suisse Intl** (fallback chain: Neue Haas Grotesk → Inter → sans-serif)
- **Neither licensed typeface is actually owned/loaded.** The site currently renders on the free fallbacks (Cormorant Garamond + Inter, loaded live via Google Fonts in `index.html`). The token stack already lists the licensed names first, so buying and self-hosting Canela/Suisse Intl later is a drop-in change (see `src/assets/fonts/README.md`) — zero component changes required.
- Eight defined type roles (cover title, chapter title, editorial label, subtitle, body-story, body-letter, caption, nav), each with its own size/tracking/leading/weight token. See `tokens.css` for exact values.

### Spacing & Grid
8px base unit, scale from `--space-1` (8px) to `--space-8` (240px). Grid: 12 columns / 80px margin desktop, 8 columns / 48px margin tablet, 4 columns / 24px margin mobile — defined in both `tokens.css` (CSS) and `utils/breakpoints.js` (JS mirror, for any scroll/3D logic that needs breakpoints outside CSS).

### Motion Philosophy
- Custom cubic-bezier curves only — never default easing, never spring/bounce.
- `EASE_REVEAL` (`cubic-bezier(0.22, 1, 0.36, 1)`) for entrances.
- `EASE_SCRUB` (`cubic-bezier(0.65, 0, 0.35, 1)`) for scroll-scrubbed motion — **consolidated into `utils/easing.js`** after being duplicated across five files (see §9).
- Five named "signature moves," each used consistently by name across the codebase: **The Reveal** (opacity+translateY+blur entrance), **The Dolly** (scroll-scrubbed scale), **The Cross-fade Bridge** (chapter transitions), **The Drift** (Memory World's floating objects — sine-wave, 6–10s period, <0.3 unit amplitude, never fast rotation), **The Ink Bloom** (Letter's masked top-to-bottom paragraph reveal — explicitly *not* a typewriter effect).
- Explicitly banned, and verified absent throughout: bounce/spring easing, letter-by-letter text reveals, confetti/decorative particles, "sections fly at you" parallax, auto-playing carousels.
- Nav/translucent-surface rule (Sec. 1.2): hairline border + ~90% opaque solid fill, never `backdrop-filter`/frosted blur.

---

## 6. Chapter-by-Chapter Feature Documentation

### Chapter 1 — Hero
**Files:** `sections/Hero/{index.jsx, Hero.module.css, PortraitFrame.jsx}`, `animations/hero.js`

**Built:** Full-bleed portrait background (currently an honest placeholder — no photo), editorial label top-left, cover title / subtitle / issue line bottom-left, thin-line scroll cue bottom-right. On load: a staggered entrance ("The Reveal" — opacity + 24px translateY + 6px blur, ~1s per element, overlapping). On scroll: the portrait scales 1.0→1.15 ("The Dolly"), scrubbed to Hero's own scroll range.

**⚠️ Known incomplete request — read this carefully:** Partway through the project, an explicit request came in to recompose Hero into a **true editorial split layout**: portrait on the right ~45–55% of the viewport (bleeding slightly past the right edge), all typography moved into a left-hand panel with a graded/textured background, a blended seam between the two panels, face never overlapped by text. A full implementation plan was written and agreed (two-column flex layout, `color-mix()`-based panel texture, negative-margin bleed clipped by the section's own `overflow: hidden`, refs re-parented but unchanged so `animations/hero.js` wouldn't need edits). **This was never actually implemented** — the very next message pivoted to a different milestone, and it was never returned to. Hero, as it exists in the codebase right now, is still the original **full-bleed-portrait-with-overlaid-text composition** from Milestone 4/5, not the split-panel version. This is the single most likely thing a stakeholder will notice and ask about. The plan is fully specified and ready to implement — see project history for the exact CSS/JSX approach, or re-derive it from the description above.

### Chapter 2 — Cinematic Transition
**Files:** `sections/CinematicTransition/{index.jsx, .module.css, DepthLayer.jsx}`, `animations/cinematicTransition.js`

**Built:** A pinned, full-viewport stage (`ScrollTrigger` `pin: true`, `scrub: 1` for eased release — no pin "snap"). Three depth-sorted `DepthLayer` instances (back/mid/front — abstract gold-tinted vignette placeholders, no real photography) each carry independent scale/blur/opacity curves that hand focus from back → mid → front as the user scrolls through the pin. One transitional type line ("Every story has a beginning.") surfaces and clears mid-sequence. Ends by fading all layers to black — the seamless bridge into Story. Reduced motion: no pin at all, a simple staggered cross-fade instead.

**Build note:** this chapter's animation factory and `DepthLayer` component were built in one pass, but the actual wiring into `index.jsx` was accidentally left as the Milestone 1 placeholder for one full milestone cycle before being caught and completed — a reminder that "I created the pieces" and "I wired them together" are separate steps worth verifying independently.

### Chapter 3 — Story
**Files:** `sections/Story/{index.jsx, Story.module.css, StoryImage.jsx, subcomponents/StorySpread.jsx}`, `animations/story.js`

**Built:** Alternating editorial spreads, one `<StorySpread>` per entry in `content.story.stories`. A single `StorySpread` component (not two mirrored components) alternates which side the image sits on via `index % 2`, and cycles through the three permitted grid ratios (7/5, 8/4, 5/7 — never 6/6) via `index % 3`. Each spread reveals independently as it scrolls into view: image and text panels slide in from *opposite* 40px directions and fade through together, scrubbed to that spread's own position (not one shared chapter-wide timeline). Followed by one full-width oversized italic pull-quote, then a large image + minimal caption block. Currently seeded with three placeholder memories.

### Chapter 4 — Memory World
**Files:** `sections/MemoryWorld/{index.jsx, .module.css, SceneCanvas.jsx, CameraRig.jsx, SoftLighting.jsx, FloatingObject.jsx, FloatingObjects.jsx, CaptionReveal.jsx}`, `animations/memoryWorldExit.js`, `hooks/{useInViewport.js, useIsMobile.js}`

The most technically involved chapter, built across four sub-milestones deliberately (highest risk/complexity):

- **Scene lifecycle:** The R3F `<Canvas>` is only *mounted* (not just hidden) while the chapter is within ~200px of the viewport, via `useInViewport` (a generic IntersectionObserver hook). This is a real mount/unmount, not a visibility toggle — it's what keeps the WebGL context from persisting (and consuming GPU memory) for the whole session. `frameloop="demand"` is used, but rather than nothing rendering, `FloatingObject`'s own per-frame drift logic calls `invalidate()` on every tick while animating — meaning the render loop is driven entirely by what's actually moving, and stops the instant nothing is.
- **Floating objects:** Eight objects (`polaroid`/`letter`/`flower`/`star` — all abstract procedural geometry, no real photos/textures), each drifting on an independent sine-wave loop (clamped to the locked 6–10s period / <0.3 unit amplitude spec). Reduced to 4 objects below the tablet breakpoint (`useIsMobile`). Reduced motion is applied by passing `amplitude={0}` from `FloatingObjects.jsx` — the shared `FloatingObject` component itself has no reduced-motion awareness by design, keeping that concern in one place.
- **Camera:** A scroll-scrubbed dolly (z: 8→6.5 — deliberately modest, "sections fly at you" parallax is explicitly banned) plus subtle per-frame cursor parallax on x/y, kept on separate axes so they never fight. Both fully disabled under reduced motion — camera holds its exact base position.
- **Captions:** `CaptionReveal` fades a caption in near an object only when the camera's *current position* is close to it in 3D space (not scroll position) — Drei's `<Html>` is used specifically so captions can use real site typography tokens rather than a WebGL text mesh.
- **Exit transition:** desaturate (CSS `filter` on the canvas's DOM wrapper — no WebGL post-processing needed, canvas accepts CSS filters like any element) → an overlay fades to black → that black **color-tweens** (a true GSAP interpolation, not a fade-to-transparent trick) to Letter's ivory, reading the actual token values off `:root` at runtime rather than duplicating hex. One continuous scrubbed timeline, matching the "no visible seam" rule.

**Bug fixed during build, worth knowing about:** the exit transition's reduced-motion branch originally jumped straight to its end state (opaque ivory, applied immediately and permanently on mount) instead of disabling the effect — which would have permanently hidden this entire chapter's content behind a blank overlay for any reduced-motion user. This was caught and fixed to simply skip the transition under reduced motion, consistent with every other chapter.

### Chapter 5 — Letter
**Files:** `sections/Letter/{index.jsx, Letter.module.css, subcomponents/InkParagraph.jsx}`, `animations/letter.js`

**Built:** The one chapter that inverts the site's dominant palette — ivory background, ink-colored text — a deliberate palette shift signaling emotional intimacy, not an inconsistency. Salutation → paragraphs → signature, all sourced from `content.letter`. Two animations: a one-time "paper unfold" entrance on the whole paper card (scale/tilt/fade, `ScrollTrigger`'s `once: true` — scrolling back up and down never replays it; needs `perspective: 1200px` on the parent for the tilt to read as a fold rather than a flat squish), and each paragraph's own independent "Ink Bloom" — a `clip-path: inset()` mask wipe revealing top-to-bottom over exactly 1.5s, explicitly not a typewriter effect. Each paragraph has its own `ScrollTrigger`, so later paragraphs naturally reveal later as the user scrolls — no shared auto-advancing timeline, no timer anywhere.

### Chapter 6 — Ending
**Files:** `sections/Ending/{index.jsx, Ending.module.css, CreditsScroll.jsx, FinalReveal.jsx}`, `components/GrainOverlay.jsx`

**Built:** A **time-driven** (not scroll-driven) sequence once the chapter is reached — deliberately different from every other chapter, since Ending is the last one and there's nothing further to scroll to: `black-hold` (1s, per spec) → `credits` (auto-scroll) → `reveal`. Credits scroll at a genuinely measured ~22px/s (viewport height + list height, divided by target speed — not a guessed CSS duration), pausing on hover/focus via plain CSS (`.creditsList:hover` — an ancestor naturally matches while any child is hovered, no JS handlers needed). The final "Happy Birthday" line fades in once and is held **indefinitely** — no timer, no exit animation, ever, anywhere in the code. Reduced motion skips all phasing: static credits list + final reveal both render together immediately.

**Grain overlay:** built as `components/GrainOverlay.jsx` (a real shared component, an inline SVG `feTurbulence` data-URI, 2–4% opacity, slow stepped-keyframe drift) but **currently only wired into Ending**, even though the design blueprint's fuller intent (Sec. 1.1) is for it to sit above every chapter site-wide. Extending it was explicitly deferred rather than silently done, since it would mean touching every other completed chapter.

**Known gap:** Sec. 7 also specifies Letter's ivory should visibly fade to black on its way *out*, before Ending's black-hold begins. That would require an exit animation on Letter's own files. It was never built — right now the Letter→Ending boundary is a direct, un-animated section cut. Ending's own black-hold beat is fully correct; it's just not preceded by a fade from Letter's side.

---

## 7. Content System (`data/content.js`)

Single exported object, one key per chapter plus two cross-cutting keys:

```
content.hero                — title lines, subtitle, editorial label, portrait
content.cinematicTransition — one transitional line
content.story                — stories[] array, quote, minimalCaptionBlock
content.memoryWorld          — objects[] array (type/position/period/phase/caption)
content.letter                — salutation, paragraphs[], signature
content.ending                — credits[] array, finalRevealLine
content.audio                — ambientBed + accents{} (keyed by chapter number)
content.nav                    — chapters[] (jump-list labels)
```

Every placeholder value uses `[bracketed text]` to signal "replace this" — this convention is used consistently for every real-content gap (her name, actual memories, the actual letter, actual photos/audio). **A full pre-launch content pass means searching this one file for `[` and replacing every match** — no component code needs to change as a result of any of it.

Image/audio `src` fields are `null` throughout (no real assets exist anywhere in the project). Every component consuming them renders a graceful, labeled placeholder rather than a broken reference.

---

## 8. Cross-Cutting Systems

### Smooth scroll (`hooks/useLenis.js`, `components/SmoothScrollProvider.jsx`)
Lenis's internal clock is driven by `gsap.ticker` (not its own `requestAnimationFrame`) so Lenis and every GSAP-driven animation share one clock. `lenis.on('scroll', ScrollTrigger.update)` keeps ScrollTrigger's measurements in sync. Fully skipped (native scroll takes over) under reduced motion. **Known limitation:** the Lenis instance is created privately inside this hook with no way for any other component to command it (e.g., to scroll to a specific position) — `MinimalNav`'s chapter-jump links fall back to the browser's native `scrollIntoView` instead, a documented, deliberate compromise (see §9).

### Audio (`hooks/useAudioController.js`, `components/AudioController.jsx`)
Muted by default; `.play()` is only ever called from an explicit user click on the toggle (both the design spec and browser autoplay policy require this). A thin gold ring, bottom-right, no visible label. Chapter-aware: reads each section's `data-chapter` attribute via its own `IntersectionObserver` to cross-fade accent tracks (vinyl crackle on Letter, ambient swell on Ending) in/out over 1.5s as the active chapter changes. Volume is hard-capped at `0.125` linear (~-18dB, deliberately with margin rather than exactly at the ceiling). No real audio files exist; every `<audio>` element is conditionally not rendered when its `src` is `null`.

### Navigation & progress (`components/{AppProvider, ProgressRail, MinimalNav}.jsx`, `hooks/useActiveChapter.js`)
`AppProvider` is the shared `AppContext` the blueprint's technical architecture section always called for, but which didn't get built until it was actually needed — scoped to exactly `activeChapter` + `scrollProgress`, not the fuller "audio state too" vision (audio deliberately stays independent, in its own hook's local state). `ProgressRail` is a thin right-edge line on desktop that fills continuously with scroll progress, minimized to a small dot on mobile. `MinimalNav` stays invisible until the user scrolls upward or the cursor idles near the top edge, auto-hiding after 3s unless directly hovered/focused.

### Reduced motion (`hooks/useReducedMotion.js`)
The single detection point for `prefers-reduced-motion`, used by every chapter's animation factory. There's also a blanket CSS safety net in `global.css` (`animation-duration: 0.01ms !important` etc.) as a last-resort backstop for anything that might ever add a CSS transition without explicitly checking the hook.

---

## 9. Known Technical Debt & Flagged Issues (full list)

These were caught and explicitly documented rather than silently fixed or silently ignored, in keeping with a project-wide policy of flagging rather than working around:

1. **~~`EASE_SCRUB` duplicated across five files~~ — RESOLVED.** Was duplicated locally in `hero.js`, `cinematicTransition.js`, `story.js`, `CameraRig.jsx`, and `memoryWorldExit.js`, each flagged in turn as "consolidate once enough files need it." Consolidated into `utils/easing.js` in a dedicated refactor pass once it hit five. All five files verified identical in behavior before and after.
2. **`EASE_REVEAL` duplicated across two files** (`hero.js`, `letter.js`) — not yet consolidated; below the threshold that triggered `EASE_SCRUB`'s cleanup. Worth consolidating if a third consumer appears.
3. **Chapter-tracking logic duplicated** between `useAudioController.js`'s internal `IntersectionObserver` (Milestone 13) and `useActiveChapter.js`'s own, separate one (Milestone 14) — both do near-identical work independently. Not consolidated because doing so would mean modifying a completed milestone's file under a strict "don't touch previous work" constraint at the time. A real candidate for a shared `useChapterObserver` hook that both consume.
4. **Lenis instance not exposed anywhere.** Created privately inside `useLenis.js`; no other component can command it to scroll programmatically. `MinimalNav`'s jump-list uses native `scrollIntoView` as a workaround, which doesn't share Lenis's custom easing curve. Fixing this properly means adding a return value/context to `useLenis`/`SmoothScrollProvider`.
5. **Grain overlay is Ending-only**, not site-wide, despite the design blueprint's Sec. 1.1 describing it as a signature texture that unifies *every* chapter. The component (`GrainOverlay.jsx`) is genuinely reusable and ready — it just hasn't been added to the other five chapters' JSX yet.
6. **No animated fade-out from Letter into Ending's black hold.** Sec. 7's transition table specifies this; only half of it (Ending's own black-hold entrance) exists. Needs an exit animation added to Letter's own files.
7. **An orphaned, unused file: `hooks/useBreakpoint.js`.** Discovered mid-project — it has zero imports anywhere in the codebase and appears to be an abandoned alternate draft of what `useIsMobile.js` (which *is* actually used) already covers. Never deleted, since deletion wasn't explicitly requested. Safe to remove.
8. **The Hero editorial-split composition refinement** — see §6, Chapter 1. Fully planned, never implemented.

---

## 10. What's Left (per `implementation-roadmap.md`)

- **Milestone 15 — Mobile & Tablet Responsiveness.** Almost nothing in the codebase has been breakpoint-tested yet beyond Memory World's object count and the progress rail's mobile dot. Hero's asymmetric layout, Story's grid ratios, and Letter's paper card have received no explicit mobile treatment. The blueprint explicitly bans simple top-image/bottom-text stacking for Story on mobile — it calls for a full-bleed image + off-center lower-third text card pattern instead.
- **Milestone 16 — Performance Optimization Pass.** Image lazy-loading, code-splitting per chapter (`React.lazy`, everything except Hero), R3F texture/DPR/compression audit — none of this has been done yet since there are no real images to lazy-load and no real 3D assets to compress. Worth revisiting once real assets exist.
- **Milestone 17 — Full Journey QA & Final Polish**, graded against `design-blueprint.md` Sec. 12's checklist (does a random mid-scroll screenshot pass as an editorial still? does removing any one animation make the site feel less complete rather than less decorated? etc.).
- **Real asset integration**, a cross-cutting task, not its own milestone: licensed fonts (or accept the free fallbacks), a real portrait + story photography, real letter text, real audio files, real credits names. Every place this content goes has a `[bracketed]` placeholder and a README pointing at exactly what to do.

---

## 11. How Verification Was Actually Done

Because the build environment never had working `npm install` access, no milestone in this project was ever confirmed via an actual `npm run dev`/`npm run build`. Every milestone's correctness rested on:
- Full manual read-throughs of every changed file
- `grep`-based checks for duplicate definitions, stale references, and cross-chapter isolation (confirming untouched chapters were byte-identical via checksum between milestones)
- Each milestone's own written test criteria (documented in the project's running `README.md` at every stage — worth reading through its git-style "Test criteria for Milestone N" sections for a sense of what was actually verified vs. assumed)

**The first real priority for whoever picks this up: run `npm install && npm run dev` and confirm the whole thing actually works end to end.** Everything above should be correct, but it has never been seen rendered in a real browser.
