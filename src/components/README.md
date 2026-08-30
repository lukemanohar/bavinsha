# components/

Shared, reusable, presentation-only components used across multiple
chapters (per design-blueprint.md Sec. 8 and Sec. 11.5.2):

- `SmoothScrollProvider.jsx` — Milestone 3 ✅ (Lenis setup, wraps the app)
- `EditorialLabel.jsx` — Milestone 4 ✅ (shared chapter label treatment)
- `GrainOverlay.jsx` — Milestone 12 ✅ (persistent grain texture; wired
  into Ending only so far — see that component's own doc comment)
- `AudioController.jsx` — Milestone 13 ✅ (floating toggle + ambient/
  accent audio elements, mounted at the app root)
- `AppProvider.jsx` — Milestone 14 ✅ (Sec. 11.5.3's shared context,
  scoped to activeChapter/scrollProgress)
- `ProgressRail.jsx` — Milestone 14 ✅ (thin fill line desktop, dot mobile)
- `MinimalNav.jsx` — Milestone 14 ✅ (chapter jump-list, reveal-on-
  scroll-up-or-top-hover)
- Button
- Cursor

Populated incrementally as each consuming milestone needs them.
