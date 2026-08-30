import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from '../Letter.module.css'
import { createInkBloomReveal } from '../../../animations/letter'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/**
 * One paragraph of the letter (design-blueprint.md Sec. 8:
 * "InkParagraph[] (masked reveal, staggered)").
 *
 * Motion (Milestone 11): each instance runs its own createInkBloomReveal
 * inside a gsap.context() scoped to its own <p> root, so every paragraph
 * gets an independent ScrollTrigger and reveals only once the user has
 * actually scrolled to it — the same per-instance pattern already
 * established by StorySpread.jsx in Milestone 8.
 */
function InkParagraph({ children }) {
  const paragraphRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const ctx = gsap.context(() => {
      createInkBloomReveal({ paragraphRef }, prefersReducedMotion)
    }, paragraphRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <p ref={paragraphRef} className={styles.paragraph}>
      {children}
    </p>
  )
}

export default InkParagraph
