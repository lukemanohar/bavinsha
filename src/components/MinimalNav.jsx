import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './MinimalNav.module.css'
import { useAppContext } from './AppProvider'
import { content } from '../data/content'

// "Idle-hover near top edge" (Sec. 8) — cursor Y position, in px, that
// counts as "near the top."
const TOP_EDGE_THRESHOLD = 80
// A deliberate upward scroll gesture, not ordinary scroll jitter.
const SCROLL_UP_THRESHOLD = 6
// How long the nav stays visible after its last trigger before hiding
// itself again.
const AUTO_HIDE_DELAY = 3000

/**
 * MinimalNav (design-blueprint.md Sec. 8: "MinimalNav (hidden until
 * scroll-up gesture or idle-hover near top edge; shows chapter jump-list
 * only)").
 *
 * Two independent reveal triggers, either of which shows the nav:
 * - Scrolling upward by more than SCROLL_UP_THRESHOLD px
 * - The cursor coming within TOP_EDGE_THRESHOLD px of the viewport's top
 *
 * Once shown, it auto-hides after AUTO_HIDE_DELAY ms of no further
 * trigger — unless the cursor or keyboard focus is directly on the nav
 * itself, which cancels the hide timer for as long as that's true.
 *
 * This reveal logic is kept local to this component rather than
 * extracted into hooks/ — unlike useActiveChapter or useIsMobile, it
 * isn't obviously reusable anywhere else in this project.
 *
 * Chapter links use the browser's native `scrollIntoView` rather than
 * Lenis's own eased scroll: Lenis's instance is created privately inside
 * useLenis.js (Milestone 3) with no way exposed to command it from
 * elsewhere, and adding that would mean modifying a completed
 * milestone's files — out of scope here. Flagged as a candidate for a
 * future pass, the same as this project's other documented follow-ups.
 */
function MinimalNav() {
  const [isVisible, setIsVisible] = useState(false)
  const { activeChapter } = useAppContext()
  const lastScrollY = useRef(0)
  const hideTimerRef = useRef(null)
  const isHoveredRef = useRef(false)

  const { chapters } = content.nav

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) setIsVisible(false)
    }, AUTO_HIDE_DELAY)
  }, [])

  const reveal = useCallback(() => {
    setIsVisible(true)
    scheduleHide()
  }, [scheduleHide])

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (lastScrollY.current - currentScrollY > SCROLL_UP_THRESHOLD) {
        reveal()
      }
      lastScrollY.current = currentScrollY
    }

    const handleMouseMove = (event) => {
      if (event.clientY <= TOP_EDGE_THRESHOLD) {
        reveal()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [reveal])

  const handleNavEnter = () => {
    isHoveredRef.current = true
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    setIsVisible(true)
  }

  const handleNavLeave = () => {
    isHoveredRef.current = false
    scheduleHide()
  }

  const handleJump = (chapterNumber) => {
    document
      .querySelector(`[data-chapter="${chapterNumber}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      className={isVisible ? `${styles.nav} ${styles.navVisible}` : styles.nav}
      onMouseEnter={handleNavEnter}
      onMouseLeave={handleNavLeave}
      onFocus={handleNavEnter}
      onBlur={handleNavLeave}
      aria-label="Chapter navigation"
    >
      <ul className={styles.list}>
        {chapters.map((chapter) => (
          <li key={chapter.number}>
            <button
              type="button"
              className={
                activeChapter === chapter.number
                  ? `${styles.link} ${styles.linkActive}`
                  : styles.link
              }
              onClick={() => handleJump(chapter.number)}
            >
              <span className={styles.linkNumber}>{chapter.number.padStart(2, '0')}</span>
              <span className={styles.linkLabel}>{chapter.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MinimalNav
