import gsap from 'gsap'
import { EASE_SCRUB } from '../utils/easing'

// Entrance curve (Sec. 5.1) — same value as animations/hero.js and
// animations/letter.js's local EASE_REVEAL. Kept local here too, per
// this project's established policy of duplicating a small easing
// constant until a third+ file needs it before consolidating (the same
// reasoning documented in hero.js and letter.js).
const EASE_REVEAL = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Builds the InstagramConversation sequence — a single, continuous GSAP
 * timeline covering all ten steps of the requested sequence, triggered
 * once by scroll (ScrollTrigger, `once: true`) and then playing out
 * entirely on its own from there. No `setTimeout` anywhere: every pause
 * and hold below is a GSAP timeline position offset (`"+=n"`), not a
 * real-time delay outside GSAP's own clock — this is what keeps the
 * whole sequence inside one `gsap.context()` that can be reverted
 * cleanly on unmount, mid-sequence, with no dangling timers.
 *
 * This is a one-shot narrative moment, not a scroll-scrubbed one — like
 * Ending's credits sequence (Milestone 12), it's driven by elapsed time
 * from a single scroll-triggered starting point rather than gated on
 * further scrolling, since making a reader scroll through a
 * conversation line by line would work against the "watching it play
 * out" feeling the sequence is going for.
 *
 * Pure function, no JSX (Sec. 11.5.3). Called from inside a
 * gsap.context() scoped to the section root, in
 * InstagramConversation/index.jsx; that context's ctx.revert() on
 * unmount tears down the ScrollTrigger and every tween this function
 * creates, including anything mid-flight.
 *
 * @param {Object} refs
 * @param {React.RefObject} refs.sectionRef      - outer section, ScrollTrigger trigger + final fade target
 * @param {React.RefObject} refs.phoneRef        - PhoneFrame root (steps 1, 9)
 * @param {React.RefObject} refs.screenRef        - the DM screen content (step 2)
 * @param {React.RefObject} refs.typingLeftRef    - left TypingIndicator (step 3)
 * @param {React.RefObject} refs.typingRightRef   - right TypingIndicator (step 6)
 * @param {HTMLElement[]} refs.bubbleRefs          - MessageBubble roots, in message order (steps 4, 7)
 * @param {boolean} prefersReducedMotion
 * @param {boolean} embedded Whether the conversation lives in a Story image panel.
 */
export function createInstagramConversationTimeline(
  { sectionRef, phoneRef, screenRef, typingLeftRef, typingRightRef, bubbleRefs },
  prefersReducedMotion = false,
  embedded = false,
) {
  // `bubbleRefs` is populated by callback refs, so its entries are DOM
  // elements already (unlike the object refs above). Do not read `.current`
  // from them: doing so passes `undefined` to GSAP.
  const [bubbleLeft, bubbleRight] = bubbleRefs

  if (prefersReducedMotion) {
    // Sec. 5.4: no tilt, no typing beats, no timed hold — everything
    // that would eventually be visible is simply shown together, once,
    // via a single simple fade. The final fade-out is skipped entirely
    // too, since removing content the reader hasn't chosen to scroll
    // past would be disorienting without the motion that normally
    // explains it.
    gsap.set([phoneRef.current, screenRef.current, bubbleLeft, bubbleRight], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      filter: 'blur(0px)',
    })
    gsap.set([typingLeftRef.current, typingRightRef.current], { opacity: 0 })
    return
  }

  // Initial states for everything this timeline reveals.
  gsap.set(phoneRef.current, {
    opacity: 0,
    scale: 0.94,
    rotateY: -8,
    rotateX: 4,
    transformPerspective: 1200,
    transformOrigin: 'center center',
  })
  gsap.set(screenRef.current, { opacity: 0 })
  gsap.set([typingLeftRef.current, typingRightRef.current], { opacity: 0 })
  gsap.set([bubbleLeft, bubbleRight], {
    opacity: 0,
    y: 16,
    filter: 'blur(4px)',
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top 70%',
      once: true,
    },
  })

  // 1. Phone fades in with a slight 3D tilt.
  tl.to(phoneRef.current, {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    duration: 1.4,
    ease: EASE_REVEAL,
  })

    // 2. The DM screen opens.
    .to(screenRef.current, { opacity: 1, duration: 0.8, ease: EASE_REVEAL }, '-=0.6')

    // 3. Typing indicator (left).
    .to(typingLeftRef.current, { opacity: 1, duration: 0.5, ease: EASE_REVEAL }, '+=0.5')

    // 4. Left bubble appears — the typing indicator hides as it does.
    .to(typingLeftRef.current, { opacity: 0, duration: 0.3, ease: 'none' }, '+=1.3')
    .to(
      bubbleLeft,
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: EASE_REVEAL },
      '<',
    )

    // 5. Pause — a plain position offset before step 6 begins, not a timer.

    // 6. Typing indicator (right).
    .to(typingRightRef.current, { opacity: 1, duration: 0.5, ease: EASE_REVEAL }, '+=1.1')

    // 7. Right bubble appears.
    .to(typingRightRef.current, { opacity: 0, duration: 0.3, ease: 'none' }, '+=1.3')
    .to(
      bubbleRight,
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: EASE_REVEAL },
      '<',
    )

    // 8. Hold for 2 seconds — again, a timeline position offset.

    // 9. Slow cinematic push-in.
    .to(phoneRef.current, { scale: 1.1, duration: 2.6, ease: EASE_SCRUB }, '+=2.0')

  // As Story Two's image, the conversation must remain visible beside its
  // narrative rather than fading away into a subsequent spread.
  if (!embedded) {
    tl.to(sectionRef.current, { opacity: 0, duration: 1.6, ease: EASE_SCRUB }, '+=0.2')
  }
}

export default createInstagramConversationTimeline
