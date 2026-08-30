import styles from './Ending.module.css'

/**
 * FinalReveal (design-blueprint.md Sec. 8: "FinalReveal — 'Happy
 * Birthday' — single centered serif line, gold glow, held
 * indefinitely").
 *
 * "Held indefinitely" is literal: there is no timer, exit animation, or
 * auto-hide anywhere in this component. Once `visible` becomes true, the
 * line fades in once via a plain CSS opacity transition and then simply
 * stays — "no additional animations, just a beautiful fade in."
 */
function FinalReveal({ line, visible }) {
  const className = visible
    ? `${styles.finalRevealLine} ${styles.finalRevealVisible}`
    : styles.finalRevealLine

  return (
    <div className={styles.finalReveal} aria-live="polite">
      <p className={className}>{line}</p>
    </div>
  )
}

export default FinalReveal
