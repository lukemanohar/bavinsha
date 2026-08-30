import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from './CinematicTransition.module.css'
import DepthLayer from './DepthLayer'
import { content } from '../../data/content'
import { createCinematicTransitionTimeline } from '../../animations/cinematicTransition'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useBreakpoint } from '../../hooks/useBreakpoint'

/**
 * Chapter 2 — Cinematic Transition (design-blueprint.md Sec. 8,
 * Chapter2_CinematicTransition):
 *   PinnedStage → LayeredImages[] → TransitionalTypeLine
 *
 * The pinned stage itself is just this section's root (styles.stage) —
 * ScrollTrigger's `pin: true` (set up in animations/cinematicTransition.js)
 * pins that element directly, so no extra wrapper is needed.
 *
 * Three DepthLayer instances (back/mid/front) plus one type line are
 * composed here; all motion — the depth-of-field curves, the pin itself,
 * the per-breakpoint behavior (Milestone 15), and the reduced-motion
 * fallback — lives in createCinematicTransitionTimeline, run inside a
 * gsap.context() scoped to sectionRef exactly like Hero's.
 */
function CinematicTransition() {
  const sectionRef = useRef(null)
  const layerBackRef = useRef(null)
  const layerMidRef = useRef(null)
  const layerFrontRef = useRef(null)
  const typeLineRef = useRef(null)

  // Beginning-specific refs
  const backdropRef = useRef(null)
  const glowRef = useRef(null)
  const labelRef = useRef(null)
  const lineOneRef = useRef(null)
  const lineTwoRef = useRef(null)
  const lineThreeRef = useRef(null)

  const prefersReducedMotion = useReducedMotion()
  const breakpoint = useBreakpoint()
  const { cinematicTransition } = content

  useEffect(() => {
    const ctx = gsap.context(() => {
      createCinematicTransitionTimeline(
        {
          sectionRef,
          layerBackRef,
          layerMidRef,
          layerFrontRef,
          // legacy: typeLineRef (kept for reduced-motion branch)
          typeLineRef,
          backdropRef,
          glowRef,
          labelRef,
          lineOneRef,
          lineTwoRef,
          lineThreeRef,
        },
        prefersReducedMotion,
        breakpoint,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReducedMotion, breakpoint])

  return (
    <section ref={sectionRef} className={styles.stage} data-chapter="2">
      <DepthLayer ref={layerBackRef} variant="Back" label="" />
      <DepthLayer ref={layerMidRef} variant="Mid" label="" />
      <DepthLayer ref={layerFrontRef} variant="Front" label="" />

      {/* Backdrop overlay that darkens the outgoing Hero ocean */}
      <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />

      {/* Subtle warm radial glow behind the beginning typography */}
      <div ref={glowRef} className={styles.glow} aria-hidden="true" />

      <div className={styles.beginContent}>
        <span ref={labelRef} className={styles.beginLabel}>01 — THE BEGINNING</span>

        <div className={styles.beginLines}>
          <span ref={lineOneRef} className={styles.beginLine}>A café.</span>
          <span ref={lineTwoRef} className={styles.beginLine}>A mutual friend.</span>
          <span ref={lineThreeRef} className={styles.beginLine}>A beginning.</span>
        </div>
      </div>
    </section>
  )
}

export default CinematicTransition
