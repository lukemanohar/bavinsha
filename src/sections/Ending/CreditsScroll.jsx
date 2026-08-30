import { useEffect, useRef } from 'react'
import styles from './Ending.module.css'

// Sec. 11.6: "auto-scrolling upward at a slow constant velocity
// (~20-24px/s)". Picked from the middle of that range.
const CREDITS_SPEED_PX_PER_SECOND = 22

/**
 * CreditsScroll (design-blueprint.md Sec. 8: "CreditsScroll (auto-
 * scrolling credit list, pauses on hover per line)"). Content and
 * per-line presentation rules per Sec. 11.6.
 *
 * Hitting an actual px/s velocity regardless of how many credits exist
 * or how tall the rendered list turns out to be means the animation's
 * duration can't be a guessed fixed value in CSS — it's computed at
 * runtime from the real, measured travel distance (viewport height +
 * list height, so the list travels fully from below the frame to fully
 * above it) divided by the target speed.
 *
 * Pausing on hover/focus needs no JS event handlers: an ancestor
 * naturally matches `:hover` whenever the pointer is over any of its
 * descendants (not just its own box), so `.creditsList:hover` alone
 * pauses on any individual line being hovered; `:focus-within` does the
 * same for keyboard focus. See Ending.module.css.
 *
 * Scrolls through the list exactly once (`animation-fill-mode: forwards`
 * in CSS) — this is credits rolling once at the end of the experience,
 * not an infinitely looping marquee.
 *
 * @param {{role: string, value: string}[]} credits
 * @param {() => void} [onComplete] - called once, when the scroll finishes
 * @param {boolean} [prefersReducedMotion]
 */
function CreditsScroll({ credits, onComplete, prefersReducedMotion = false }) {
  const viewportRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion || !viewportRef.current || !listRef.current) return undefined

    const viewportHeight = viewportRef.current.clientHeight
    const listHeight = listRef.current.scrollHeight
    const totalTravel = viewportHeight + listHeight
    const durationSeconds = totalTravel / CREDITS_SPEED_PX_PER_SECOND

    listRef.current.style.setProperty('--credits-start', `${viewportHeight}px`)
    listRef.current.style.setProperty('--credits-end', `-${listHeight}px`)
    listRef.current.style.setProperty('--credits-duration', `${durationSeconds}s`)

    const timer = setTimeout(() => onComplete?.(), durationSeconds * 1000)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion, onComplete])

  return (
    <div ref={viewportRef} className={styles.creditsViewport}>
      <ul
        ref={listRef}
        className={
          prefersReducedMotion
            ? `${styles.creditsList} ${styles.creditsListStatic}`
            : styles.creditsList
        }
      >
        {credits.map((credit) => (
          <li key={credit.role} className={styles.creditLine} tabIndex={0}>
            <span className={styles.creditRole}>{credit.role}</span>
            <span className={styles.creditValue}>{credit.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CreditsScroll
