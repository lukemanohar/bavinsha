# data/

`content.js` holds all site copy (titles, story text, letter text,
credits — per Sec. 11.5.3 and Sec. 11.6) as a single exported object.
Components import from here; no copy is ever hardcoded in JSX.

- `hero` key — Milestone 4 ✅
- `story`, `editorialGallery`, `letter`, `credits` keys — added incrementally
  in Milestones 7, 9b, 10, 12
