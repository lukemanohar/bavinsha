import gsap from 'gsap'

// Same entrance curve as animations/hero.js (Sec. 5.1, "reveal/entrance
// motion"). Kept as its own local copy for the same reason EASE_SCRUB
// stayed duplicated across five files before its dedicated consolidation
// pass: keeping each milestone's diff scoped to what it actually needs.
// If a third file ends up needing this same curve, that's the signal to
// consolidate it into utils/easing.js the way EASE_SCRUB was.
const EASE_REVEAL = 'cubic-bezier(0.22, 1, 0.36, 1)'

// "The Ink Bloom" (design-blueprint.md Sec. 5.2, pattern 5): masked
// opacity wipe, top-to-bottom, 1.5s, staggered by paragraph — explicitly
// NOT a per-character typewriter effect (Sec. 5.3's banned list).
const INK_BLOOM_DURATION = 1.5

/**
 * Builds the one-time paper unfold (design-blueprint.md Sec. 8:
 * "UnfoldAnimation (paper-fold reveal, one-time)"). Fires exactly once,
 * the first time Letter's paper scrolls into view — ScrollTrigger's
 * `once: true` means scrolling back up past Letter and down again never
 * replays it, which is this milestone's own test criterion.
 *
 * The tilt (rotateX from a few degrees back toward flat) needs a CSS
 * `perspective` on an ancestor to read as a subtle fold rather than a
 * flat vertical squish — see the `.letter` rule in Letter.module.css.
 *
 * Pure function, no JSX (Sec. 11.5.3). Called from inside a
 * gsap.context() scoped to the paper element itself, in
 * Letter/index.jsx.
 *
 * @param {Object} refs
 * @param {React.RefObject} refs.paperRef - the paper card element
 * @param {boolean} prefersReducedMotion
 */
export function createLetterUnfoldTimeline({ paperRef }, prefersReducedMotion = false) {
  if (!paperRef.current) return

  if (prefersReducedMotion) {
    // Sec. 5.4: a single simple fade, no scale/tilt — still one-time only.
    gsap.set(paperRef.current, { opacity: 0 })
    gsap.to(paperRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: paperRef.current,
        start: 'top 85%',
        once: true,
      },
    })
    return
  }

  gsap.set(paperRef.current, {
    opacity: 0,
    scale: 0.94,
    rotateX: -4,
    y: 20,
    transformPerspective: 1200,
    transformOrigin: 'top center',
  })

  gsap.to(paperRef.current, {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    y: 0,
    duration: 1.4,
    ease: EASE_REVEAL,
    scrollTrigger: {
      trigger: paperRef.current,
      start: 'top 80%',
      once: true,
    },
  })
}

/**
 * Builds one paragraph's "Ink Bloom" reveal: a masked opacity wipe that
 * uncovers the paragraph from top to bottom over 1.5s, as if ink is
 * settling into the page.
 *
 * The mask is a CSS `clip-path: inset(...)` tween on the paragraph
 * itself: starting fully clipped from the bottom edge
 * (`inset(0% 0% 100% 0%)` — nothing visible) and animating that bottom
 * inset down to 0%, so the visible region always starts at the top and
 * grows downward as the value changes. Paired with a soft opacity fade
 * for the "settling" quality, rather than a hard geometric wipe alone.
 * This is deliberately NOT a per-character reveal — there is no
 * character-by-character stagger anywhere in this function, satisfying
 * Sec. 5.3's ban on typewriter effects.
 *
 * Each paragraph gets its own independent ScrollTrigger (`once: true`),
 * firing only when that specific paragraph scrolls into view. Later
 * paragraphs are physically further down the page, so they naturally
 * reveal later as the user keeps scrolling — that's what "staggered by
 * paragraph" means in practice here, with no artificial stagger delay
 * needed and no shared timeline auto-advancing through every paragraph
 * at once. There is no timer anywhere in this file; reaching each
 * paragraph always requires the user to actually scroll to it.
 *
 * Pure function, no JSX (Sec. 11.5.3). Called from inside a
 * gsap.context() scoped to the paragraph's own root element, in
 * InkParagraph.jsx.
 *
 * @param {Object} refs
 * @param {React.RefObject} refs.paragraphRef
 * @param {boolean} prefersReducedMotion
 */
export function createInkBloomReveal({ paragraphRef }, prefersReducedMotion = false) {
  if (!paragraphRef.current) return

  if (prefersReducedMotion) {
    // Sec. 5.4: a single simple fade, no mask wipe.
    gsap.set(paragraphRef.current, { opacity: 0 })
    gsap.to(paragraphRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: paragraphRef.current,
        start: 'top 85%',
        once: true,
      },
    })
    return
  }

  gsap.set(paragraphRef.current, {
    opacity: 0,
    clipPath: 'inset(0% 0% 100% 0%)',
  })

  gsap.to(paragraphRef.current, {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    duration: INK_BLOOM_DURATION,
    ease: EASE_REVEAL,
    scrollTrigger: {
      trigger: paragraphRef.current,
      start: 'top 85%',
      once: true,
    },
  })
}
