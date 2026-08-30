import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from './Hero.module.css'
import PortraitFrame from './PortraitFrame'
import EditorialLabel from '../../components/EditorialLabel'
import { content } from '../../data/content'
import { createHeroTimeline } from '../../animations/hero'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Chapter 1 — Hero (design-blueprint.md Sec. 8, Chapter1_Hero):
 *   EditorialLabel → PortraitFrame → CoverTitle → SubtitleDeck → ScrollCue
 *
 * Composition is static (Milestone 4); motion is wired here in Milestone 5
 * via animations/hero.js — an entrance "Reveal" for the text stack plus a
 * scroll-scrubbed portrait "Dolly" (Sec. 5.2). The GSAP work runs inside a
 * gsap.context() scoped to sectionRef, so ctx.revert() on unmount cleans up
 * every tween and ScrollTrigger this section creates.
 *
 * CoverTitle, SubtitleDeck, and ScrollCue are composed inline here rather
 * than split into their own files — each is single-use and non-repeating
 * (unlike, say, Story's StorySpread), so separate files would add
 * indirection without benefit. PortraitFrame gets its own file because it
 * carries real logic (the placeholder-vs-image branch); EditorialLabel is
 * a genuinely shared, cross-chapter component and lives in components/.
 *
 * Mobile/tablet layout adjustments are explicitly out of scope here per
 * implementation-roadmap.md — that's Milestone 15's full responsive pass.
 */
function Hero() {
  const sectionRef = useRef(null)
  const portraitRef = useRef(null)
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const issueLineRef = useRef(null)
  const scrollCueRef = useRef(null)

  const prefersReducedMotion = useReducedMotion()

  const { hero } = content

  useEffect(() => {
    const ctx = gsap.context(() => {
      createHeroTimeline(
        { sectionRef, portraitRef, labelRef, titleRef, subtitleRef, issueLineRef, scrollCueRef },
        prefersReducedMotion,
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])

  return (
    <section ref={sectionRef} className={styles.hero} data-chapter="1">
      <div ref={portraitRef} className={styles.portraitLayer}>
        <PortraitFrame image={hero.portrait} />
      </div>

      <div ref={labelRef} className={styles.topMeta}>
        <EditorialLabel>{hero.editorialLabel}</EditorialLabel>
      </div>

      <div className={styles.contentBlock}>
        <h1 ref={titleRef} className={styles.coverTitle}>
          {hero.titleLines.map((line) => (
            <span key={line} data-title-line className={styles.titleLine}>
              {/* Split each line into characters so we can animate per-letter on scroll. */}
              {Array.from(line).map((char, i) => (
                // Preserve spaces as non-breaking so layout doesn't collapse
                <span
                  key={`${line}-${i}`}
                  data-title-char
                  className={styles.titleChar}
                  aria-hidden={char === ' '}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p ref={subtitleRef} className={styles.subtitleDeck}>
          {hero.subtitle}
        </p>

        <span ref={issueLineRef} className={styles.issueLine}>
          {hero.issueLine}
        </span>
      </div>

      <div ref={scrollCueRef} className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollCueLine} />
        <span className={styles.scrollCueLabel}>{hero.scrollCueLabel}</span>
      </div>
    </section>
  )
}

export default Hero
