import { forwardRef } from 'react'
import styles from './InstagramConversation.module.css'

/**
 * One message bubble. `align` ('left' | 'right') controls both which
 * side it sits on and which of the two bubble treatments it gets —
 * Instagram's dark-mode DM screen uses a neutral dark-gray bubble for
 * received messages and a blue bubble for sent ones; see this folder's
 * module.css for why those two colors exist outside the site's locked
 * 7-color palette (a deliberate, documented exception, not an oversight).
 *
 * forwardRef so the animation factory can target each bubble
 * individually for its own reveal.
 */
const MessageBubble = forwardRef(function MessageBubble({ text, align }, ref) {
  const bubbleClass =
    align === 'right'
      ? `${styles.bubble} ${styles.bubbleRight}`
      : `${styles.bubble} ${styles.bubbleLeft}`

  return (
    <div className={align === 'right' ? styles.bubbleRowRight : styles.bubbleRowLeft}>
      <p ref={ref} className={bubbleClass}>
        {text}
      </p>
    </div>
  )
})

export default MessageBubble
