import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from '../Story.module.css'
import StoryImage from '../StoryImage'
import EditorialLabel from '../../../components/EditorialLabel'
import labelStyles from '../../../components/EditorialLabel.module.css'
import { createStorySpreadReveal } from '../../../animations/story'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/**
 * StorySpread — the repeatable unit in Chapter 3 (design-blueprint.md
 * Sec. 8: ImagePanel → NarrativePanel → MicroCaption). One component,
 * driven entirely by `index`:
 *
 * - Image side alternates left/right every spread (index % 2) — this is
 *   what "no manually duplicated mirrored components" means in practice:
 *   there is exactly one StorySpread, and it reorders its own two panels
 *   rather than a second "StorySpreadReversed" component existing.
 * - Grid ratio cycles through the three ratios Sec. 4.1 permits — 7/5,
 *   8/4, 5/7 — never a plain 6/6 split, and never the same ratio twice
 *   in a row for three-or-fewer spreads.
 *
 * Adding or removing a story in data/content.js needs no changes here —
 * Story/index.jsx just maps the `stories` array to one <StorySpread>
 * per entry.
 *
 * Motion (Milestone 8): each instance runs its own
 * createStorySpreadReveal inside a gsap.context() scoped to its own
 * <article> root, so every spread gets an independent ScrollTrigger and
 * reveals as it individually enters the viewport — not one shared
 * timeline for the whole chapter.
 */
const RATIOS = [
  [7, 5],
  [8, 4],
  [5, 7],
]

function StorySpread({ story, index, imageContent = null }) {
  const spreadRef = useRef(null)
  const imageRef = useRef(null)
  const narrativeRef = useRef(null)

  const prefersReducedMotion = useReducedMotion()

  const isReversed = index % 2 === 1
  const isMemoryThree = story.id === 'story-03'
  const isMemoryFour = story.id === 'story-04'
  const memoryFourTitleParts = isMemoryFour ? story.title.split(/ (?=[^ ]+$)/) : null
  const [imageFr, narrativeFr] = RATIOS[index % RATIOS.length]

  const gridTemplateColumns = isReversed
    ? `${narrativeFr}fr ${imageFr}fr`
    : `${imageFr}fr ${narrativeFr}fr`

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMemoryThree) {
        const paragraphs = narrativeRef.current.querySelectorAll('[data-memory-three-paragraph]')
        const label = narrativeRef.current.querySelector(`.${labelStyles.label}`)
        const title = narrativeRef.current.querySelector('[data-memory-three-title]')
        const caption = narrativeRef.current.querySelector('[data-memory-three-caption]')

        if (prefersReducedMotion) {
          gsap.set([imageRef.current, label, title, paragraphs, caption], { opacity: 0 })
          gsap.to([imageRef.current, label, title, paragraphs, caption], {
            opacity: 1,
            duration: 0.4,
            ease: 'none',
            scrollTrigger: { trigger: spreadRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          })
        } else {
          gsap.set(imageRef.current, { scale: 1.03 })
          gsap.set([label, title, paragraphs, caption], { opacity: 0, y: 14 })

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: spreadRef.current,
              start: 'top 85%',
              end: 'top 45%',
              scrub: 0.8,
            },
            defaults: { ease: 'power2.out' },
          })

          timeline
            .to(imageRef.current, { scale: 1, duration: 1.2 }, 0)
            .to(label, { opacity: 1, y: 0, duration: 0.65 }, 0.18)
            .to(title, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
            .to(paragraphs, { opacity: 1, y: 0, stagger: 0.16, duration: 0.7 }, 0.48)
            .to(caption, { opacity: 1, y: 0, duration: 0.65 }, 0.78)
        }
      } else if (isMemoryFour) {
        const paragraphs = narrativeRef.current.querySelectorAll('[data-memory-four-paragraph]')
        const label = narrativeRef.current.querySelector(`.${labelStyles.label}`)
        const title = narrativeRef.current.querySelector('[data-memory-four-title]')
        const caption = narrativeRef.current.querySelector('[data-memory-four-caption]')

        if (prefersReducedMotion) {
          gsap.set([imageRef.current, label, title, paragraphs, caption], { opacity: 0 })
          gsap.to([imageRef.current, label, title, paragraphs, caption], {
            opacity: 1,
            duration: 0.4,
            ease: 'none',
            scrollTrigger: { trigger: spreadRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          })
        } else {
          gsap.set(imageRef.current, { opacity: 0, scale: 1.03 })
          gsap.set([label, title, paragraphs, caption], { opacity: 0, y: 14 })

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: spreadRef.current,
              start: 'top 85%',
              end: 'top 45%',
              scrub: 0.8,
            },
            defaults: { ease: 'power2.out' },
          })

          timeline
            .to(imageRef.current, { opacity: 1, scale: 1, duration: 1.2 }, 0)
            .to(label, { opacity: 1, y: 0, duration: 0.65 }, 0.18)
            .to(title, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
            .to(paragraphs, { opacity: 1, y: 0, stagger: 0.16, duration: 0.7 }, 0.48)
            .to(caption, { opacity: 1, y: 0, duration: 0.65 }, 0.78)
        }
      } else {
        createStorySpreadReveal(
          { spreadRef, imageRef, narrativeRef },
          isReversed,
          prefersReducedMotion,
          // mark featured (Memory One) specially so animation/layout tweak applies
          index === 0,
        )
      }
    }, spreadRef)

    return () => ctx.revert()
  }, [index, isMemoryFour, isMemoryThree, isReversed, prefersReducedMotion])

  const imagePanel = (
    <div key="image" ref={imageRef} className={styles.imagePanel}>
      {imageContent || <StoryImage image={story.image} />}
    </div>
  )

  const narrativePanel = (
    <div key="narrative" ref={narrativeRef} className={`${styles.narrativePanel} ${index === 0 ? styles.featuredNarrative : ''} ${isMemoryThree ? styles.memoryThreeNarrative : ''} ${isMemoryFour ? styles.memoryFourNarrative : ''}`}>
      {index === 0 ? (
        // Featured Memory One — use an editorial, stacked composition
        <>
          <span data-feature-label className={labelStyles.label}>MEMORY ONE</span>
          <h3 data-feature-title className={styles.storyTitle}>
            <span className={styles.titlePart}>{'The First'}</span>
            <span className={styles.titlePart}>{'Hello'}</span>
          </h3>
          <div className={styles.storyParagraph}>
            <p>We met at a café through a mutual friend.</p>
            <p>At the time, it felt like an ordinary meeting.</p>
            <p>Neither of us knew that this simple meeting would become the beginning of our story.</p>
          </div>
          <span data-feature-caption className={styles.microCaption}>WHERE IT ALL BEGAN · 2024</span>
        </>
      ) : isMemoryThree ? (
        <>
          <EditorialLabel>{story.editorialLabel}</EditorialLabel>
          <h3 data-memory-three-title className={styles.storyTitle}>{story.title}</h3>
          <div className={styles.storyParagraph}>
            {story.paragraphs.map((paragraph) => (
              <p data-memory-three-paragraph key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <span data-memory-three-caption className={styles.microCaption}>{story.caption}</span>
        </>
      ) : isMemoryFour ? (
        <>
          <EditorialLabel>{story.editorialLabel}</EditorialLabel>
          <h3 data-memory-four-title className={styles.storyTitle}>
            {memoryFourTitleParts[0]}<br />{memoryFourTitleParts[1]}
          </h3>
          <div className={styles.storyParagraph}>
            {story.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                data-memory-four-paragraph
                className={paragraphIndex === 0 ? styles.dateLine : ''}
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <span data-memory-four-caption className={styles.microCaption}>{story.caption}</span>
        </>
      ) : (
        // Default narrative layout for other memories
        <>
          <EditorialLabel>{story.editorialLabel}</EditorialLabel>
          <h3 className={styles.storyTitle}>{story.title}</h3>
          <p className={styles.storyParagraph}>{story.paragraph}</p>
          <span className={styles.microCaption}>{story.caption}</span>
        </>
      )}
    </div>
  )

  const panels = isReversed ? [narrativePanel, imagePanel] : [imagePanel, narrativePanel]

  const spreadClass = index === 0
    ? `${styles.spread} ${styles.featured}`
    : isMemoryThree
      ? `${styles.spread} ${styles.memoryThree}`
      : isMemoryFour
        ? `${styles.spread} ${styles.memoryFour}`
        : styles.spread

  return (
    <article ref={spreadRef} className={spreadClass} style={{ gridTemplateColumns }}>
      {panels}
    </article>
  )
}

export default StorySpread
