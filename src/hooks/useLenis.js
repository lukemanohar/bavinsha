import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

// Registered once, at module scope, the first time this file is imported —
// every later milestone's animations/*.js timeline factories can safely
// assume ScrollTrigger is already registered without re-registering it.
gsap.registerPlugin(ScrollTrigger)

/**
 * Sets up Lenis smooth scrolling and keeps it frame-synced with GSAP
 * ScrollTrigger, per design-blueprint.md Sec. 11.5.1 ("Lenis (smooth
 * scroll) driving GSAP ScrollTrigger") and Sec. 5.4 (reduced-motion
 * safety net).
 *
 * Two responsibilities, both required by implementation-roadmap.md's
 * Milestone 3 test criteria:
 *
 * 1. Lenis's internal raf loop is driven by gsap.ticker instead of its own
 *    requestAnimationFrame call, so Lenis and every GSAP-driven animation
 *    share a single clock and never drift apart frame-to-frame.
 * 2. lenis.on('scroll', ScrollTrigger.update) tells ScrollTrigger to
 *    re-measure on every Lenis scroll tick, so scroll-scrubbed animations
 *    (arriving from Milestone 5 onward) stay pinned to the right scroll
 *    position instead of lagging behind Lenis's easing.
 *
 * When the user has prefers-reduced-motion set, Lenis is never
 * instantiated at all — scrolling falls back to the browser's native,
 * un-eased behavior, and ScrollTrigger continues to work against native
 * scroll position (it doesn't require Lenis to function).
 *
 * Mounted once, at the app root, via components/SmoothScrollProvider.jsx.
 * Not intended to be called from individual sections.
 */
export function useLenis() {
  const lenisRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      // No Lenis instance is created — native scroll takes over and
      // ScrollTrigger keeps working against it unmodified.
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const syncWithGsapTicker = (time) => {
      // gsap.ticker reports time in seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(syncWithGsapTicker)

    // Prevents GSAP's tab-refocus time-jump smoothing from fighting with
    // Lenis's own easing curve.
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(syncWithGsapTicker)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [prefersReducedMotion])

  return lenisRef
}

export default useLenis
