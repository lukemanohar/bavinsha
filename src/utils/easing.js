// Shared easing curves (design-blueprint.md Sec. 5.1).
//
// EASE_SCRUB — used for every scroll-scrubbed scale/opacity/filter tween
// site-wide — was previously duplicated locally as a private constant in
// five files: animations/hero.js, animations/cinematicTransition.js,
// animations/story.js and animations/editorialGallery.js. Each copy was flagged at the time it was
// added as due for consolidation once enough consumers existed; this file
// is that consolidation, performed as a dedicated refactor once five
// files needed it.
//
// This is a pure refactor: the value below is byte-identical to every
// duplicate it replaces, confirmed before this file was created. No
// animation timing, easing shape, or ScrollTrigger behavior changes as a
// result of this consolidation.
export const EASE_SCRUB = 'cubic-bezier(0.65, 0, 0.35, 1)'
