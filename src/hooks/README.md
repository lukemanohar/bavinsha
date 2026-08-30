# hooks/

- `useLenis.js` — Milestone 3 ✅
- `useReducedMotion.js` — Milestone 3 ✅
- `useInViewport.js` — Milestone 9a ✅ (viewport visibility, via
  IntersectionObserver; introduced for Memory World's canvas mount/unmount)
- `useIsMobile.js` — Milestone 9b ✅ (tablet-breakpoint match; used by
  ProgressRail's rail-vs-dot switch and MinimalNav's reveal logic)
- `useAudioController.js` — Milestone 13 ✅ (playback, chapter-aware
  cross-fading, muted-by-default toggle state; chapter tracking now comes
  from useChapterObserver.js as of Milestone 16, see below)
- `useActiveChapter.js` — Milestone 14 ✅ (active chapter + continuous
  scroll progress; backs AppProvider). As of Milestone 16, this is a
  thin delegate to useChapterObserver.js — kept as its own file, same
  exported name/shape, purely so AppProvider.jsx needs no changes.
- `useChapterObserver.js` — Milestone 16 ✅ (new). Consolidates what were
  two separate, near-identical IntersectionObservers
  (useAudioController.js's own internal one from Milestone 13, and
  useActiveChapter.js's own one from Milestone 14) — flagged as
  duplicate debt since Milestone 14, same pattern as the `EASE_SCRUB`
  consolidation. Milestone 16 is what actually forced fixing it: code-
  splitting chapters after Hero (`App.jsx`) means their `[data-chapter]`
  elements no longer all exist synchronously at first render, and the
  original once-on-mount `querySelectorAll` approach would silently stop
  tracking any chapter whose chunk hadn't loaded yet. This hook adds a
  targeted `MutationObserver` (re-scans only when a `[data-chapter]`
  node actually appears, ignoring unrelated DOM churn like Memory
  World's caption mount/unmounts) and calls `ScrollTrigger.refresh()` at
  the same moments, since a lazy chapter mounting changes total
  scrollable height without firing a `resize` event. Note: `AudioController`
  and `AppProvider` each call this hook independently, so there are two
  separate observer instances rather than one truly shared one — a minor
  inefficiency judged not worth fixing by having `useAudioController`
  depend on `AppProvider`'s context instead, which would invert the
  project's hooks→components dependency direction for a marginal gain.
- `useBreakpoint.js` — actually wired in as of Milestone 15 ✅ (3-tier
  'mobile'/'tablet'/'desktop' category). This file already existed,
  built back in Milestone 9b for this exact purpose per its own doc
  comment, but was never actually used at the time — 9b's own test
  criteria only needed useIsMobile's simpler two-tier split. Milestone
  15 is what this hook was always meant for: Memory World's per-
  breakpoint object count (desktop/6/4) and DPR ceiling, and Cinematic
  Transition's three-way pin behavior (full pin / shortened pin / no
  pin).
