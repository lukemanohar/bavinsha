import styles from './ProgressRail.module.css'
import { useAppContext } from './AppProvider'
import { useIsMobile } from '../hooks/useIsMobile'

/**
 * ChapterProgressRail (design-blueprint.md Sec. 8): a thin vertical line
 * on the right edge that fills as the reader scrolls through the entire
 * six-chapter journey. Minimizes to a small dot on mobile — Sec. 8 gives
 * "hidden on mobile or minimized to a dot" as the choice, and a dot was
 * picked over hiding entirely, since a tiny persistent progress cue
 * costs almost nothing on screen and stays genuinely useful there.
 *
 * Mounted once at the app root (App.jsx); reads `scrollProgress` from
 * AppProvider rather than tracking scroll itself.
 */
function ProgressRail() {
  const { scrollProgress } = useAppContext()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div
        className={styles.dot}
        style={{
          opacity: 0.4 + scrollProgress * 0.6,
          transform: `scale(${0.7 + scrollProgress * 0.3})`,
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className={styles.rail} aria-hidden="true">
      <div className={styles.railTrack}>
        <div className={styles.railFill} style={{ transform: `scaleY(${scrollProgress})` }} />
      </div>
    </div>
  )
}

export default ProgressRail
