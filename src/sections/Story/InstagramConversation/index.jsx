import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from './InstagramConversation.module.css'
import PhoneFrame from './PhoneFrame'
import InstagramHeader from './InstagramHeader'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import { content } from '../../../data/content'
import { createInstagramConversationTimeline } from '../../../animations/instagramConversation'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/**
 * InstagramConversation — the visual beat for Story Two, composed here
 * from PhoneFrame → InstagramHeader → (TypingIndicator / MessageBubble).
 * Sits before the mapped `stories` array in Story/index.jsx; purely
 * additive — no existing Story content changed or removed.
 *
 * Motion lives entirely in animations/instagramConversation.js, run
 * inside a gsap.context() scoped to this component's own section root —
 * identical pattern to every other chapter's animation wiring
 * (Hero, Letter, Cinematic Transition).
 */
function InstagramConversation({ embedded = false }) {
  const sectionRef = useRef(null)
  const phoneRef = useRef(null)
  const screenRef = useRef(null)
  const typingLeftRef = useRef(null)
  const typingRightRef = useRef(null)
  const bubbleRefs = useRef([])
  bubbleRefs.current = []

  const prefersReducedMotion = useReducedMotion()
  const { instagramConversation } = content.story

  const registerBubbleRef = (el) => {
    if (el) bubbleRefs.current.push(el)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      createInstagramConversationTimeline(
        {
          sectionRef,
          phoneRef,
          screenRef,
          typingLeftRef,
          typingRightRef,
          bubbleRefs: bubbleRefs.current,
        },
        prefersReducedMotion,
        embedded,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [embedded, prefersReducedMotion])

  return (
    <div
      ref={sectionRef}
      className={`${styles.section}${embedded ? ` ${styles.embedded}` : ''}`}
    >
      <PhoneFrame ref={phoneRef}>
        <div ref={screenRef} className={styles.screen}>
          <InstagramHeader username={instagramConversation.username} />
          <div className={styles.messageArea}>
            <TypingIndicator ref={typingLeftRef} align="left" />
            <MessageBubble
              ref={registerBubbleRef}
              align={instagramConversation.messages[0].align}
              text={instagramConversation.messages[0].text}
            />
            <TypingIndicator ref={typingRightRef} align="right" />
            <MessageBubble
              ref={registerBubbleRef}
              align={instagramConversation.messages[1].align}
              text={instagramConversation.messages[1].text}
            />
          </div>
          <div className={styles.composer} aria-label="Instagram message composer">
            <span className={`${styles.composerIcon} ${styles.cameraIcon}`} aria-hidden="true" />
            <span className={styles.composerInput}>Message...</span>
            <span className={`${styles.composerIcon} ${styles.photoIcon}`} aria-hidden="true" />
            <span className={`${styles.composerIcon} ${styles.micIcon}`} aria-hidden="true" />
            <span className={`${styles.composerIcon} ${styles.heartIcon}`} aria-hidden="true" />
          </div>
        </div>
      </PhoneFrame>
    </div>
  )
}

export default InstagramConversation
