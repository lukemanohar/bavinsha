import gsap from 'gsap'
import { EASE_SCRUB } from '../utils/easing'

// Sec. 10: "tablet: pinned sequences shortened (less scroll distance)."
// Desktop's full pin distance is 1.6x the viewport height; tablet gets a
// shorter dwell rather than losing the pin outright.
const PIN_DISTANCE_MULTIPLIER = {
  desktop: 1.6,
  tablet: 1.0,
}

/**
 * Builds Chapter 2's pinned cinematic sequence: three depth-sorted layers
 * moving through independent scale/blur/opacity curves, one transitional
 * type line that surfaces and clears mid-sequence, and a final fade to
 * black that hands off to whatever comes next with no visible seam
 * (design-blueprint.md Sec. 7, "Cinematic Transition → Story" row).
 *
 * Pure function, no JSX (Sec. 11.5.3). Called from inside a gsap.context()
 * scoped to the section root in CinematicTransition/index.jsx; that
 * context's ctx.revert() tears down the ScrollTrigger and every tween
 * this function creates.
 *
 * Three breakpoint behaviors (Sec. 10, Milestone 15):
 * - Desktop: the full pinned sequence, scrub: 1 for an eased release —
 *   scrub as a number (rather than `true`) adds a short catch-up
 *   smoothing so the pin's release never reads as a hard snap (Sec. 7's
 *   golden rule: "if you can see the seam, it's wrong").
 * - Tablet: the same pinned sequence, same depth-of-field choreography,
 *   just over a shorter scroll distance (1.0x viewport height instead of
 *   1.6x) — "same emotional beats," per Sec. 10, just a shorter dwell.
 * - Mobile: no pin at all — Sec. 10 explicitly calls for the pinned
 *   parallax to "collapse into a shorter cross-fade sequence rather than
 *   true pinning" here, since pinning tends to read as janky on mobile
 *   scroll. This is a distinct, simpler sequence: a single scrubbed
 *   cross-fade through the three layers over the section's own height,
 *   no pin, no multi-phase depth choreography.
 *
 * @param {Object} refs
 * @param {React.RefObject} refs.sectionRef
 * @param {React.RefObject} refs.layerBackRef
 * @param {React.RefObject} refs.layerMidRef
 * @param {React.RefObject} refs.layerFrontRef
 * @param {React.RefObject} refs.typeLineRef
 * @param {boolean} prefersReducedMotion
 * @param {'mobile'|'tablet'|'desktop'} breakpoint
 */
export function createCinematicTransitionTimeline(
  {
    sectionRef,
    layerBackRef,
    layerMidRef,
    layerFrontRef,
    typeLineRef,
    backdropRef,
    glowRef,
    labelRef,
    lineOneRef,
    lineTwoRef,
    lineThreeRef,
  },
  prefersReducedMotion = false,
  breakpoint = 'desktop',
) {
  const layers = [layerBackRef.current, layerMidRef.current, layerFrontRef.current]

  if (prefersReducedMotion) {
    // Reduced motion: quick cross-fade into a simple beginning title
    gsap.set([...layers, typeLineRef.current, backdropRef?.current, glowRef?.current], { opacity: 0 })
    gsap.to(layers, {
      opacity: 1,
      duration: 0.4,
      ease: 'none',
      stagger: 0.05,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    const label = labelRef?.current
    const l1 = lineOneRef?.current
    if (label) {
      gsap.fromTo(label, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' } })
    }
    if (l1) {
      gsap.fromTo(l1, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'none', delay: 0.12, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' } })
    }

    return
  }

  if (breakpoint === 'mobile') {
    // Sec. 10: pin collapses to a shorter cross-fade — no pin, no
    // extended dwell, just the three layers handing off focus once each
    // as the section scrolls past at ordinary speed.
    gsap.set(layerBackRef.current, { opacity: 1 })
    gsap.set(layerMidRef.current, { opacity: 0 })
    gsap.set(layerFrontRef.current, { opacity: 0 })
    gsap.set(backdropRef.current, { opacity: 0 })
    gsap.set(glowRef.current, { opacity: 0 })
    gsap.set([labelRef.current, lineOneRef.current, lineTwoRef.current, lineThreeRef.current], { opacity: 0, y: 12 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
      defaults: { ease: EASE_SCRUB },
    })

    tl.to(layerBackRef.current, { opacity: 0 }, 0.08)
      .to(backdropRef.current, { opacity: 0.7 }, 0.12)
      .to(labelRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.18)
      .to(lineOneRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.28)
      .to(lineTwoRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.36)
      .to(lineThreeRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.44)
      .to([lineOneRef.current, lineTwoRef.current, lineThreeRef.current], { opacity: 0, y: -12 }, 0.72)
      .to(backdropRef.current, { opacity: 0.98 }, 0.78)
      .to(layerFrontRef.current, { opacity: 0 }, 0.86)

    return
  }

  // Desktop and tablet share the same pinned choreography — only the
  // scroll distance (dwell time) differs between them.
  const pinDistanceMultiplier = PIN_DISTANCE_MULTIPLIER[breakpoint] ?? PIN_DISTANCE_MULTIPLIER.desktop

  // Initial depth-of-field state: back sharp and dominant (continuing
  // Hero's mood), mid and front soft and receded, waiting to come into
  // focus as the "camera" moves through them.
  // Initial state: keep the back layer visible (continuing Hero), and
  // position the beginning typography off-screen (faded, slightly lower).
  gsap.set(layerBackRef.current, { scale: 1, filter: 'blur(0px)', opacity: 1 })
  gsap.set(layerMidRef.current, { scale: 1.05, filter: 'blur(6px)', opacity: 0.6 })
  gsap.set(layerFrontRef.current, { scale: 1.04, filter: 'blur(8px)', opacity: 0 })
  gsap.set(backdropRef.current, { opacity: 0 })
  gsap.set(glowRef.current, { opacity: 0 })
  gsap.set([labelRef.current, lineOneRef.current, lineTwoRef.current, lineThreeRef.current], { opacity: 0, y: 12 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * pinDistanceMultiplier),
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    defaults: { ease: EASE_SCRUB },
  })

  // Phase 1: darken the outgoing Hero (backdrop overlay) and surface the
  // beginning typography in a soft, staggered editorial reveal.
  tl.to(backdropRef.current, { opacity: 0.45 }, 0)
    .to(glowRef.current, { opacity: 0.06 }, 0.05)
    .to(labelRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.12)
    .to(lineOneRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.28)
    .to(lineTwoRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.36)
    .to(lineThreeRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.44)

    // Hold briefly, then gently clear the text upward while deepening
    // the black hand-off so Story can appear underneath.
    .to([lineOneRef.current, lineTwoRef.current, lineThreeRef.current], { opacity: 0, y: -12 }, 0.68)
    .to(backdropRef.current, { opacity: 0.95 }, 0.76)
    .to(glowRef.current, { opacity: 0.04 }, 0.78)
    .to([layerBackRef.current, layerMidRef.current, layerFrontRef.current], { opacity: 0 }, 0.82)
}

export default createCinematicTransitionTimeline
