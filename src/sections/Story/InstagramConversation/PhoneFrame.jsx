import { forwardRef } from 'react'
import styles from './InstagramConversation.module.css'

/**
 * The phone bezel — this is site chrome, not app content, so unlike the
 * screen it wraps, it stays strictly within the locked palette (black +
 * a hairline gold-tinted edge), consistent with every other frame/card
 * element across the site (Story's imagePanel, Letter's paper).
 *
 * forwardRef so the animation factory can target this element directly
 * for the entrance tilt and the later push-in — both apply to the whole
 * phone object, not just its screen content.
 */
const PhoneFrame = forwardRef(function PhoneFrame({ children }, ref) {
  return (
    <div ref={ref} className={styles.phoneFrame}>
      <div className={styles.phoneNotch} aria-hidden="true" />
      <div className={styles.phoneScreenWindow}>{children}</div>
      <div className={styles.phoneHomeIndicator} aria-hidden="true" />
    </div>
  )
})

export default PhoneFrame
