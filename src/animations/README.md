# animations/

GSAP timeline factories and ScrollTrigger configs — pure functions that
take refs and return a timeline/cleanup, no JSX (per Sec. 11.5.3).

- `hero.js` — Milestone 5 ✅ (entrance "Reveal" + scroll-scrubbed "Dolly")
- `cinematicTransition.js` — Milestone 6 ✅ (pinned depth sequence)
- `story.js` — Milestone 8 ✅ (per-spread opposite-direction reveal)
- `editorialGallery.js` — per-spread editorial image and copy reveals
- `letter.js` — Milestone 11 ✅ (one-time unfold + per-paragraph Ink Bloom)

Shared `EASE_SCRUB` constant lives in `src/utils/easing.js` (consolidated
there in a dedicated refactor after Milestone 9d, once five files needed
it) — import it rather than redefining it locally.
