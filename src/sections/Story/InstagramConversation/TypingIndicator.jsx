import { forwardRef } from 'react'
import styles from './InstagramConversation.module.css'

/**
 * The "someone is typing" affordance. Real Instagram uses a bouncy
 * three-dot animation — this site's motion philosophy explicitly bans
 * bounce/spring easing everywhere (Sec. 5.3), so this uses a slow,
 * staggered opacity pulse instead: clearly reads as "typing," without
 * breaking the site's restrained, no-bounce rule for the one moment it
 * would otherwise be violated.
 *
 * forwardRef purely so the animation factory can fade the whole
 * indicator in/out as a single unit (the dots' own pulse loop is CSS,
 * not GSAP — see module.css — so it never needs individual refs).
 */
const TypingIndicator = forwardRef(function TypingIndicator({ align = 'left' }, ref) {
  const rowClass = align === 'right' ? styles.bubbleRowRight : styles.bubbleRowLeft

  return (
    <div className={rowClass}>
      <div ref={ref} className={styles.typingIndicator} aria-hidden="true">
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
      </div>
    </div>
  )
})

export default TypingIndicator
