import gsap from 'gsap'
import { EASE_SCRUB } from '../utils/easing'

// Sec. 7, "Story → Story" row: "image slides 40px opposite the text's
// 40px, both fade through."
const REVEAL_DISTANCE = 40

/**
 * Builds one StorySpread's scroll-scrubbed reveal: the image panel and
 * narrative panel slide in from opposite horizontal directions (40px
 * each) and fade in together as the spread enters the viewport — the
 * "page turn" feeling described in Sec. 7, without any literal page-turn
 * effect.
 *
 * Pure function, no JSX (Sec. 11.5.3). Called once per StorySpread
 * instance from inside a gsap.context() scoped to that spread's own root
 * element, so each spread gets its own ScrollTrigger and animates
 * independently as it enters view — not one shared timeline for the
 * whole chapter (this is what the roadmap's "per-instance" test
 * criterion means in practice).
 *
 * @param {Object} refs
 * @param {React.RefObject} refs.spreadRef    - <article> root; ScrollTrigger trigger
 * @param {React.RefObject} refs.imageRef     - image panel
 * @param {React.RefObject} refs.narrativeRef - narrative panel
 * @param {boolean} isReversed - which physical side the image panel is on
 * @param {boolean} prefersReducedMotion
 */
export function createStorySpreadReveal(
  { spreadRef, imageRef, narrativeRef },
  isReversed,
  prefersReducedMotion = false,
  isFeatured = false,
) {
  if (prefersReducedMotion) {
    // Sec. 5.4: a single simple fade, no slide, no scroll-scrub.
    gsap.set([imageRef.current, narrativeRef.current], { opacity: 0 })
    gsap.to([imageRef.current, narrativeRef.current], {
      opacity: 1,
      duration: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: spreadRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
    return
  }

  // The image and narrative panels always approach from opposite
  // directions, regardless of which physical side (left/right) the image
  // occupies — that opposition is what reads as a "page turn."
  const imageFrom = isReversed ? REVEAL_DISTANCE : -REVEAL_DISTANCE
  const narrativeFrom = -imageFrom

  if (isFeatured) {
    // Featured Memory One: subtle photograph settle + staggered editorial reveal
    gsap.set(imageRef.current, { x: imageFrom, opacity: 0, scale: 1.04 })
    // keep the narrative container visible; animate children individually
    gsap.set(narrativeRef.current, { x: narrativeFrom, opacity: 1 })

    const title = narrativeRef.current.querySelector('[data-feature-title]')
    const paras = narrativeRef.current.querySelectorAll('p')
    const label = narrativeRef.current.querySelector('[data-feature-label]')
    const caption = narrativeRef.current.querySelector('[data-feature-caption]')

    // initialize children for a clean staggered reveal
    gsap.set([label, title, paras, caption], { opacity: 0, y: 12 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spreadRef.current,
        start: 'top 85%',
        end: 'top 45%',
        scrub: 0.6,
      },
      defaults: { ease: EASE_SCRUB },
    })

    // Image settles from slight scale to neutral while fading + sliding
    tl.to(imageRef.current, { x: 0, opacity: 1, scale: 1, duration: 1 }, 0)

      // label -> title -> body -> caption, subtle upward movement
      .to(label, { opacity: 1, y: 0, duration: 0.6 }, 0.12)
      .to(title, { opacity: 1, y: 0, duration: 0.7 }, 0.28)
      .to(paras, { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 }, 0.44)
      .to(caption, { opacity: 1, y: 0, duration: 0.6 }, 0.64)

    return
  }

  // Default (non-featured) spread reveal: opposing slide + fade
  gsap.set(imageRef.current, { x: imageFrom, opacity: 0 })
  gsap.set(narrativeRef.current, { x: narrativeFrom, opacity: 0 })

  gsap.to([imageRef.current, narrativeRef.current], {
    x: 0,
    opacity: 1,
    ease: EASE_SCRUB,
    scrollTrigger: {
      trigger: spreadRef.current,
      start: 'top 85%',
      end: 'top 45%',
      scrub: 0.6,
    },
  })
}

export default createStorySpreadReveal
