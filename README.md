# Birthday Experience — Cinematic Six-Chapter Site

Built against the locked `design-blueprint.md` and `implementation-roadmap.md`.
This repo currently implements through **Milestone 17 — Full Journey QA
& Final Polish**, completing all 17 milestones in the implementation
roadmap. See `MILESTONE_17_QA_REPORT.md` for the full audit against
`design-blueprint.md` Sec. 12's acceptance checklist.

## Post-roadmap addition: InstagramConversation (Chapter 3)

A recreated Instagram DM exchange, added as Chapter 3's opening beat —
built after all 17 milestones, as its own explicit feature request, not
part of the original roadmap.

- **`src/sections/Story/InstagramConversation/`** — `PhoneFrame.jsx`,
  `InstagramHeader.jsx`, `MessageBubble.jsx`, `TypingIndicator.jsx`,
  `index.jsx`, `InstagramConversation.module.css`
- **`src/animations/instagramConversation.js`** — a single GSAP
  timeline, ScrollTrigger-triggered once, no `setTimeout` anywhere
  (every pause/hold is a timeline position offset)
- **`src/data/content.js`** — added `story.instagramConversation`
  (username + both messages)
- **`src/sections/Story/index.jsx`** (modified) — renders
  `<InstagramConversation />` before the existing mapped `stories` —
  purely additive, nothing existing removed or restructured

**One deliberate exception to the locked palette, documented prominently
in the code itself:** the phone's *screen* content uses Instagram's own
authentic dark-mode colors (near-black background, gray/blue bubbles) —
outside the site's 7-color system — since it's a faithful recreation of
a real external app, the same way an embedded photograph would carry its
own colors distinct from the site's UI chrome. The phone's *bezel*, by
contrast, stays strictly within the locked palette (black + a hairline
gold edge), since that part is this site's own design language framing
the recreated content.

**Also deliberate:** the typing indicator uses a slow opacity pulse, not
Instagram's actual bouncy dot animation — Sec. 5.3 bans bounce/spring
easing everywhere else on the site, and this was kept consistent with
that rather than carved out as a one-off exception.

## Refactor: EASE_SCRUB consolidation (no visual/behavioral changes)

`EASE_SCRUB` (design-blueprint.md Sec. 5.1 — the approved curve for every
scroll-scrubbed scale/opacity/filter tween) had been duplicated locally,
one file at a time, as five separate animation files needed it in turn:
`hero.js` (M5), `cinematicTransition.js` (M6), `story.js` (M8),
`CameraRig.jsx` (M9c), `memoryWorldExit.js` (M9d) — each flagged in its
own comments as due for consolidation, deliberately deferred each time to
keep that milestone's diff scoped to only what it needed.

This pass:
- Confirmed all five duplicates were byte-identical
  (`'cubic-bezier(0.65, 0, 0.35, 1)'`) before touching anything
- Created **`src/utils/easing.js`** as the single exported source of truth
- Updated all five consumers to `import { EASE_SCRUB } from '.../utils/easing'`,
  removing each local `const` definition
- Left every timing value, ScrollTrigger config (`start`/`end`/`scrub`/
  `pin`/etc.), and animation position unchanged — confirmed via a full
  read-through of all five files post-edit
- `hero.js`'s `EASE_REVEAL` (used only in that one file) was left as its
  own local constant — it was never duplicated elsewhere, so there was
  nothing to consolidate

**Verification performed** (see the note on `npm install` below for why
this is manual rather than a live `npm run build`):
- `grep -rn "const EASE_SCRUB"` across `src/` returns zero matches outside
  `utils/easing.js` itself
- All five consumers' import paths verified correct
  (`../utils/easing` from `animations/`, `../../utils/easing` from
  `sections/MemoryWorld/`)
- Brace-balance and full visual read-through of every modified file

## What exists right now

- Vite + React 18 app, SWC compiler
- Full locked folder structure per design-blueprint.md Sec. 11.5.2
- All core dependencies pinned in `package.json`
- `src/styles/tokens.css` / `global.css` — full design-token system
- `src/utils/breakpoints.js` — JS-readable breakpoint/grid constants
- Font loading for Cormorant Garamond + Inter
- `src/dev/TokenPreview.jsx` — QA-only token harness
- `src/hooks/useReducedMotion.js`, `src/hooks/useLenis.js`,
  `src/components/SmoothScrollProvider.jsx` — Lenis + ScrollTrigger sync
- `src/data/content.js` — `hero`, `cinematicTransition`, `story`,
  `memoryWorld`, and `letter` keys populated
- `src/components/EditorialLabel.jsx` — shared chapter-label component
- **Chapter 1 — Hero** (Milestones 4–5): static composition + entrance
  "Reveal" + scroll-scrubbed portrait "Dolly"
- **Chapter 2 — Cinematic Transition** (Milestone 6): pinned, scroll-
  scrubbed depth sequence with an eased release
- **Chapter 3 — Story** (Milestones 7–8): alternating spreads with
  independent per-spread scroll reveals
- **Chapter 4 — Memory World** (Milestones 9a–9d, now complete): scene
  skeleton, drifting objects, scroll-scrubbed camera dolly + cursor
  parallax, proximity-based captions, and —
  **`animations/memoryWorldExit.js`** — the exit hand-off into Letter
  (Sec. 7): the canvas desaturates via a CSS `grayscale()` filter on its
  wrapper, while a full-bleed overlay fades to black and then
  color-tweens (a true interpolation, not a hard swap) from black to
  ivory, reading the colors' actual runtime values off `:root` rather
  than duplicating hex constants. One continuous scrubbed timeline, not
  three cuts. **`MemoryWorld/index.jsx`** (modified, not recreated) now
  owns `canvasWrapperRef` and `overlayRef`, wired via `gsap.context()`
  the same way every other chapter's motion is.
- **Chapter 5 — Letter** (Milestones 10–11, now complete): ivory/ink
  paper composition — salutation → paragraphs → signature — plus
  **`animations/letter.js`**: `createLetterUnfoldTimeline` (the paper's
  one-time entrance — scale/tilt/fade, `ScrollTrigger`'s `once: true` so
  scrolling back up and down never replays it) and
  `createInkBloomReveal` (each paragraph's own masked `clip-path` wipe,
  top-to-bottom, 1.5s — explicitly not a per-character typewriter
  effect). **`Letter/index.jsx`** and **`InkParagraph.jsx`** (both
  modified, not recreated) each run their own `gsap.context()`, the same
  pattern as every other chapter — every paragraph gets an independent
  `ScrollTrigger`, so reaching each one always requires the user to
  actually scroll to it; there is no shared auto-advancing timeline and
  no timer anywhere in `letter.js`.

> **Refactor (previous pass):** `EASE_SCRUB`, duplicated across five
> animation files, was consolidated into `src/utils/easing.js`. Not
> reopened by this milestone — `letter.js` needed a different curve
> (`EASE_REVEAL`, entrance-style, not scroll-scrubbed), kept as its own
> local constant per the same "consolidate once enough files need it"
> policy that governed `EASE_SCRUB` before its own consolidation.

> **Corrected during the 9d pass:** `memoryWorldExit.js`'s reduced-motion
> branch had been jumping straight to the transition's end state (opaque
> ivory, applied immediately and permanently) rather than disabling the
> effect — which would have hidden Chapter 4's entire content behind a
> blank overlay for reduced-motion users. Fixed to simply skip the
> transition under reduced motion, consistent with how every other
> chapter's scroll-scrubbed effects are handled.

- **Chapter 6 — Ending** (Milestone 12, completing the full journey):
  - **`src/components/GrainOverlay.jsx`** — a genuinely shared component
    (per the folder plan committed to back in Milestone 1), a persistent
    2–4%-opacity animated grain texture built from an inline SVG
    `feTurbulence` data-URI. Only wired into Ending so far — extending it
    to every chapter (per Sec. 1.1's fuller vision) would mean modifying
    already-completed chapters, out of scope for this milestone.
  - **`CreditsScroll.jsx`** — auto-scrolls the credits at an accurate,
    measured ~22px/s (viewport height + list height, divided by target
    speed — not a guessed fixed CSS duration), pausing on hover/focus via
    plain CSS (an ancestor's `:hover` naturally matches while any
    descendant is hovered, so no per-line JS handlers are needed). Scrolls
    through once, not an infinite marquee.
  - **`FinalReveal.jsx`** — the single centered "Happy Birthday" line
    with a gold-token text-shadow glow; fades in once and is held
    indefinitely — no timer, no exit animation, ever.
  - **`Ending/index.jsx`** (replacing the M1 placeholder) — a small,
    time-driven phase sequence (`black-hold` → `credits` → `reveal`),
    triggered once by `useInViewport` when the user actually scrolls to
    this chapter, not by any standing background timer. Reduced motion
    skips the phases entirely: static credits and the final reveal both
    render together immediately.
  - **`data/content.js`** — added the `ending` key (credits array per
    Sec. 11.6's locked template, plus the final reveal line).

> **Known scope gap, noted rather than silently worked around:** Sec. 7's
> "Letter → Ending" row also calls for Letter's ivory to visibly fade to
> black on the way out. Implementing that would mean adding an exit
> animation to Letter's own files — a chapter this milestone's scope
> (per implementation-roadmap.md) doesn't touch. Right now the boundary
> between Letter and Ending is a direct section cut; Ending's own
> black-hold beat (Sec. 8's BlackHold) is fully implemented as specified,
> just not preceded by an animated fade-out from Letter's side. Flagging
> this as a candidate for an explicit follow-up pass, the same way the
> `EASE_SCRUB` consolidation was.

- **Audio** (Milestone 13): `src/hooks/useAudioController.js` — playback
  state, muted-by-default (audio only ever starts on an explicit user
  click, matching both Sec. 6 and browser autoplay policy), and
  chapter-aware cross-fading of per-chapter accent tracks. Chapter
  tracking reads the `data-chapter` attribute every section has already
  carried since Milestone 1, via its own `IntersectionObserver` — that's
  read-only DOM observation, not a modification to any chapter file.
  `src/components/AudioController.jsx` + `.module.css` — the thin gold
  ring toggle (Sec. 6), bottom corner, mounted once at the app root
  (`App.jsx`, modified) alongside `SmoothScrollProvider`. No real audio
  files exist yet (`data/content.js`'s `audio` key has `src: null`
  throughout — see `src/assets/audio/README.md` for how to wire real
  files in later); the toggle and all cross-fade logic work correctly
  regardless, no-oping safely when there's nothing to play. Volume is
  capped at `0.125` linear (~-18dB), matching Sec. 6's ceiling exactly.

- **Navigation & progress** (Milestone 14):
  `src/hooks/useActiveChapter.js` — active chapter (via its own
  `IntersectionObserver` on the `data-chapter` attributes every section
  already carries) plus a continuous 0–1 `scrollProgress` (via
  `ScrollTrigger`, already frame-synced with Lenis since Milestone 3).
  `src/components/AppProvider.jsx` — the shared `AppContext` Sec. 11.5.3
  calls for, scoped to exactly what this milestone needs; exports
  `useAppContext()`, mounted once at the app root wrapping everything.
  `src/components/ProgressRail.jsx` — a thin filling line on the right
  edge (desktop), minimized to a small dot (mobile, via `useIsMobile`).
  `src/components/MinimalNav.jsx` — hidden by default; reveals on an
  upward scroll gesture or the cursor idling near the viewport's top
  edge, auto-hides after 3s unless hovered/focused directly. Chapter
  links jump via native `scrollIntoView` rather than Lenis's own eased
  scroll (see the note below). `App.jsx` (modified) now wraps everything
  in `AppProvider` and mounts `ProgressRail`/`MinimalNav` alongside
  `AudioController`.

> **Two things flagged, not silently fixed, in this pass:**
> 1. `useActiveChapter.js` duplicates `useAudioController.js`'s own
>    internal chapter-tracking `IntersectionObserver` (Milestone 13).
>    Consolidating them would mean modifying a completed milestone's
>    file — deferred, same pattern as the `EASE_SCRUB` consolidation.
> 2. `MinimalNav`'s chapter-jump links use the browser's native
>    `scrollIntoView`, not Lenis's custom easing — Lenis's instance is
>    created privately inside `useLenis.js` (Milestone 3) with no way
>    exposed to command it from elsewhere, and adding that would also
>    mean modifying a completed milestone's files.

## What does NOT exist yet (by design)

- Grain overlay is only applied to Ending, not site-wide (see note above)
- No animated fade-out from Letter into Ending's black hold (see note
  above)
- No real audio or image files (see notes above/below) — draco
  compression and real srcset/AVIF/WebP variants can't be meaningfully
  verified until real assets exist
- Chapter jump-list uses native smooth scroll, not Lenis's eased curve
  (see note above)

Nothing here should be treated as final design — every placeholder is
explicitly commented with which milestone replaces it.

## Getting started

```bash
npm install
npm run dev      # starts Vite dev server
npm run build    # production build
npm run preview  # preview the production build locally
```

## Milestone 15 — Mobile & Tablet Responsiveness (prior pass)

Every chapter got breakpoint-specific treatment; none had its desktop
composition or animation logic changed:

- **`hooks/useBreakpoint.js`** — now actually wired in. This file
  existed since Milestone 9b (built for exactly this purpose, per its
  own doc comment) but was never used — 9b's own test criteria only
  needed `useIsMobile`'s simpler two-tier split. Returns
  `'mobile'|'tablet'|'desktop'`.
- **Hero** — desktop composition (full-bleed portrait, asymmetric
  off-center text) unchanged; only the fixed margin token and the
  content block's 60%-of-viewport max-width (too narrow on real devices)
  scale per breakpoint.
- **Cinematic Transition** — three distinct behaviors, all in
  `animations/cinematicTransition.js`: desktop keeps the full pin at
  1.6× viewport height; tablet keeps the same pinned choreography at a
  shortened 1.0×; **mobile drops the pin entirely** and replaces it with
  a single scrubbed cross-fade through the three layers (Sec. 10:
  "collapses into a shorter cross-fade sequence rather than true
  pinning").
- **Story** — mobile explicitly does **not** stack image-above-text
  (banned by Sec. 10). Instead the image becomes a full-bleed background
  and the narrative panel becomes an off-center card in the lower third —
  achieved entirely in `Story.module.css` against the existing markup,
  no `StorySpread.jsx` changes needed.
- **Memory World** — object count now has a real three-tier split
  (desktop: all 8, tablet: 6, mobile: 4) via `useBreakpoint`, replacing
  Milestone 9b's simpler two-tier version. Device pixel ratio is also
  tiered (2 / 1.5 / 1) as the honest substitute for "shadow quality" —
  this scene has no shadow-casting system at all to actually degrade.
- **Letter** — CSS-only changes (padding, and a reduced `perspective` so
  the unfold's tilt doesn't look exaggerated on a narrow screen).
  `animations/letter.js` was **not touched at all**, preserving Sec. 10's
  one hard requirement that pacing feel identical across breakpoints.

> **Bug fixed in this pass:** `SceneCanvas.jsx` destructured a
> `canvasWrapperRef` prop and rendered its own internal wrapper div using
> it — but `MemoryWorld/index.jsx` never actually passed that prop. It
> was dead code (a harmless extra div, ref always `undefined`) left over
> from development. Removed while this file was already open for DPR
> tiering.

## Test criteria for Milestone 15, in full (prior pass, still valid)

- [ ] Resize through all three breakpoints on every chapter — desktop
      compositions and animation timings are pixel/behavior-identical to
      before this milestone
- [ ] Mobile Story: image is full-bleed, text sits in an off-center card
      in the lower third — not stacked image-then-text
- [ ] Mobile Cinematic Transition: no pin/scroll-jack at all, just a
      quick cross-fade through the three depth layers
- [ ] Tablet Cinematic Transition: still pins, but releases sooner than
      desktop
- [ ] Memory World: count objects at each breakpoint — 8 desktop, 6
      tablet, 4 mobile
- [ ] Letter: unfold and Ink Bloom timing feel identical at every
      breakpoint; only spacing changes
- [ ] `npm run dev` and `npm run build` still succeed with zero errors

## Milestone 16 — Performance Optimization Pass (this pass)

- **Code-splitting** (`App.jsx`): every chapter after Hero is now
  `React.lazy`-loaded, each in its own `Suspense` boundary (`fallback={null}`
  — the body's own black background already shows through with no
  visible flash). Hero stays a normal static import — it "must paint
  immediately" (Sec. 11.5.4), and splitting it would delay first paint,
  the opposite of the point.
- **Images**: `PortraitFrame.jsx` (Hero's LCP element) now sets
  `loading="eager"` + `fetchPriority="high"` explicitly; `StoryImage.jsx`
  (every use below the fold) sets `loading="lazy"`. Both accept an
  optional `sources` array for a `<picture>` with AVIF/WebP variants —
  see `src/assets/images/README.md`. Since no real photos exist anywhere
  in the project yet, this is real, working infrastructure with nothing
  to actually exercise yet, not a simulated feature.
- **R3F**: `FloatingObject.jsx` now builds each type's geometry and
  material exactly once, at module scope, shared by every instance of
  that type, instead of each of the (up to 8) objects constructing its
  own duplicate `THREE.BufferGeometry`/`Material` — roughly halving this
  scene's GPU buffer allocations, with zero visual change (dimensions
  copied byte-for-byte from the previous per-instance versions). DPR
  tiering and `frameloop="demand"` were already in place (Milestones 9a
  and 15); draco compression isn't applicable — this scene has no
  loaded GLTF/model assets to compress, only procedural geometry.
- **Reduced motion**: re-audited across all six chapters in one pass
  (grep-verified every animation factory branches on
  `prefersReducedMotion` and collapses to a simple fade, no partial/
  approximated version of the full motion) — no code changes were needed,
  every chapter was already correct.

> **A real regression, caught and fixed, not just optimized around:**
> code-splitting exposed that `useActiveChapter.js` (Milestone 14) and
> `useAudioController.js` (Milestone 13) each independently query
> `document.querySelectorAll('[data-chapter]')` exactly once, on mount.
> Once chapters are lazy-loaded, a chapter whose chunk hasn't finished
> downloading yet simply isn't in the DOM at that moment — and would
> have silently never been tracked afterward. Fixed by finally
> consolidating both hooks' duplicate observers (flagged as debt since
> Milestone 14) into one new **`hooks/useChapterObserver.js`**, which
> adds a targeted `MutationObserver` that re-scans only when a real
> `[data-chapter]` node appears (explicitly ignoring unrelated DOM churn
> like Memory World's caption mount/unmounts) and calls
> `ScrollTrigger.refresh()` at the same moments, since a lazy chapter
> mounting changes total scrollable height without firing a `resize`
> event. `useActiveChapter.js` is now a thin delegate to it (same
> exported name/shape, so `AppProvider.jsx` needed zero changes);
> `useAudioController.js` calls it directly instead of running its own
> copy. Note: the two callers each get their own observer instance
> rather than sharing one truly single instance — judged not worth
> fixing by making `useAudioController` depend on `AppProvider`'s
> context, which would invert this project's hooks→components
> dependency direction for a marginal gain.

## Test criteria for this milestone (per implementation-roadmap.md M16)

- [ ] In devtools' Network panel (throttled to "Fast 3G" or similar),
      confirm Story/MemoryWorld/Letter/Ending each load as separate JS
      chunks, not bundled into the initial page load
- [ ] Confirm Hero is **not** a separate chunk — it should be part of the
      main bundle
- [ ] Scroll the entire site with a lazy chapter chunk artificially
      delayed (devtools network throttling) and confirm `MinimalNav`'s
      active-chapter highlight and `ProgressRail`'s fill both still work
      correctly once that chapter finally mounts
- [ ] In React DevTools' Profiler (or the browser's Performance panel),
      confirm Memory World's floating objects don't show 8 separate
      geometry/material allocations — 4 shared instances, reused
- [ ] Toggle `prefers-reduced-motion: reduce` and re-verify all six
      chapters collapse correctly in a single pass, not chapter-by-chapter
- [ ] Record a CPU-throttled (4x–6x) scroll-through in devtools'
      Performance panel; frame rate should hold close to 60fps throughout
      (this one requires a real browser — can't be confirmed by reading
      code)
- [ ] `npm run dev` and `npm run build` still succeed with zero errors

## Test criteria for Milestone 14 (still valid, unchanged)

- [ ] Nav reveal/hide, progress rail fill, and chapter jump-list all
      still work exactly as before

## Test criteria for Milestone 13 (still valid, unchanged)

- [ ] Audio toggle still works exactly as before; no autoplay on load

## Test criteria for Milestone 12 (still valid, unchanged)

- [ ] Ending's black-hold → credits → final-reveal sequence still plays
      correctly; reduced motion still collapses it to a static view

## Test criteria for Milestone 11 (still valid, unchanged)

- [ ] Letter's paper unfold plays once; each paragraph's Ink Bloom
      requires actual scrolling and is never letter-by-letter

## Test criteria for Milestone 10 (still valid, unchanged)

- [ ] Letter's background and text use only ivory/ink tokens — no pure
      black/white anywhere in that chapter
- [ ] Body — Letter type role matches Sec. 3.2 exactly; paragraphs never
      exceed the 42ch measure

## Test criteria for Milestones 1–9d (still valid, unchanged)

- [ ] Hero, Cinematic Transition, Story, and Memory World's earlier
      milestones all still verify as previously documented
