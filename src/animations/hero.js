import gsap from 'gsap'
import { EASE_SCRUB } from '../utils/easing'

// Reveal/entrance easing (Sec. 5.1) — used only in this file, so it stays
// local. EASE_SCRUB (used below for the scroll-scrubbed portrait Dolly)
// now lives in utils/easing.js — see that file for why.
const EASE_REVEAL = 'cubic-bezier(0.22, 1, 0.36, 1)'

// "The Reveal" (Sec. 5.2, pattern 1): opacity 0->1, translateY 24px->0,
// blur 6px->0px. Used for every text entrance in this timeline.
const REVEAL_Y = 24
const REVEAL_BLUR = 6

// "The Dolly" (Sec. 5.2, pattern 2): background image scale 1.0->1.15,
// tied to scroll. This is the only scale range this milestone uses.
const DOLLY_SCALE_FROM = 1
const DOLLY_SCALE_TO = 1.15

/**
 * Builds Hero's entrance timeline and scroll-scrubbed portrait dolly.
 *
 * Pure function, no JSX (Sec. 11.5.3) — takes the DOM refs collected by
 * Hero/index.jsx and creates GSAP tweens/ScrollTriggers against them.
 * Intended to be called from inside a gsap.context() scoped to the Hero
 * section root; that context's ctx.revert() (in the component's useEffect
 * cleanup) tears down every tween and ScrollTrigger this function
 * creates — this function does not return or manage its own cleanup.
 *
 * @param {Object} refs
 * @param {React.RefObject} refs.sectionRef  - ScrollTrigger trigger element
 * @param {React.RefObject} refs.portraitRef - full-bleed portrait layer
 * @param {React.RefObject} refs.labelRef    - EditorialLabel wrapper
 * @param {React.RefObject} refs.titleRef    - <h1>; child lines carry
 *                                             [data-title-line]
 * @param {React.RefObject} refs.subtitleRef - subtitle deck <p>
 * @param {React.RefObject} refs.issueLineRef
 * @param {React.RefObject} refs.scrollCueRef
 * @param {boolean} prefersReducedMotion
 */
export function createHeroTimeline(
  { sectionRef, portraitRef, labelRef, titleRef, subtitleRef, issueLineRef, scrollCueRef },
  prefersReducedMotion = false,
) {
  const titleLines = titleRef.current
    ? titleRef.current.querySelectorAll('[data-title-line]')
    : []

  const textEls = [labelRef.current, ...titleLines, subtitleRef.current, issueLineRef.current]

  if (prefersReducedMotion) {
    // Sec. 5.4: collapse to a single simple cross-fade — no translate, no
    // blur, no stagger, and no scroll-scrubbed scale at all.
    gsap.set([...textEls, scrollCueRef.current, portraitRef.current], { opacity: 0 })
    gsap.to([...textEls, scrollCueRef.current, portraitRef.current], {
      opacity: 1,
      duration: 0.3,
      ease: 'none',
    })
    return
  }

  // ---- Entrance ("The Reveal") ----
  gsap.set(textEls, { opacity: 0, y: REVEAL_Y, filter: `blur(${REVEAL_BLUR}px)` })
  gsap.set(scrollCueRef.current, { opacity: 0 })
  gsap.set(portraitRef.current, { opacity: 0, scale: DOLLY_SCALE_FROM })

  const revealDefaults = { ease: EASE_REVEAL, filter: 'blur(0px)', y: 0, opacity: 1 }

  const tl = gsap.timeline()

  tl.to(portraitRef.current, { opacity: 1, duration: 1.4, ease: EASE_REVEAL })
    .to(labelRef.current, { ...revealDefaults, duration: 1.1 }, '-=1.0')
    .to(titleLines, { ...revealDefaults, duration: 1.2, stagger: 0.12 }, '-=0.7')
    .to(subtitleRef.current, { ...revealDefaults, duration: 1.1 }, '-=0.6')
    .to(issueLineRef.current, { ...revealDefaults, duration: 0.9 }, '-=0.7')
    .to(scrollCueRef.current, { opacity: 1, duration: 0.9, ease: EASE_REVEAL }, '-=0.4')

  // Scroll cue's idle "breathing" — a slow, subtle opacity pulse once it's
  // visible. Ambient only: no scale/translate, so it never reads as a
  // bounce or a second competing entrance.
  gsap.to(scrollCueRef.current, {
    opacity: 0.45,
    duration: 2.4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: tl.duration(),
  })

  // ---- Scroll-scrubbed portrait dolly ("The Dolly") ----
  gsap.to(portraitRef.current, {
    scale: DOLLY_SCALE_TO,
    ease: EASE_SCRUB,
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })

  // ---- Scroll-driven per-letter disappearance (editorial dissolve) ----
  // Select every character span created in the Hero markup. These are
  // independent inline-blocks so they can translate/fade/blur separately
  // while the portrait and image remain visible. The animation is scrubbed
  // to the scroll and ends earlier than the portrait dolly so the photo
  // lingers briefly after the type dissolves.
  const titleChars = titleRef.current
    ? titleRef.current.querySelectorAll('[data-title-char]')
    : []

  if (titleChars.length) {
    // Ensure letters are visually ready before scroll-triggered animation
    gsap.set(titleChars, { opacity: 1, y: 0, filter: 'blur(0px)' })

    gsap.to(titleChars, {
      opacity: 0,
      y: -40,
      filter: 'blur(3px)',
      ease: 'none',
      stagger: 0.02,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        // End at the section's center reaching the top so the photo can
        // remain visible a bit longer after the typography is gone.
        end: 'center top',
        scrub: true,
      },
    })
  }
}

export default createHeroTimeline
