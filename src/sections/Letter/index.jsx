import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from './Letter.module.css'
import { content } from '../../data/content'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function Letter() {
  const letterRef = useRef(null)
  const sheetRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { letter } = content

  useEffect(() => {
    const ctx = gsap.context(() => {
      const contentTargets = sheetRef.current.querySelectorAll('[data-letter-content]')
      gsap.set(sheetRef.current, { opacity: 0, y: 24 })
      gsap.set(contentTargets, { opacity: 0, y: 8 })
      const reveal = gsap.timeline({
        scrollTrigger: { trigger: sheetRef.current, start: 'top 82%', once: true },
        defaults: { ease: 'power2.out' },
      })
        .to(sheetRef.current, { opacity: 1, y: 0, duration: prefersReducedMotion ? 0.45 : 1 })
        .to(contentTargets, { opacity: 1, y: 0, duration: prefersReducedMotion ? 0.3 : 0.65, stagger: prefersReducedMotion ? 0 : 0.08 }, 0.2)

      return () => reveal.kill()
    }, letterRef)

    return () => {
      ctx.revert()
    }
  }, [prefersReducedMotion])

  return (
    <section ref={letterRef} className={styles.letter} data-chapter="5">
      <div ref={sheetRef} className={styles.letterSheet}>
          <p className={styles.salutation} data-letter-content>{letter.salutation}</p>

          {letter.paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.paragraph} data-letter-content>{paragraph}</p>
          ))}

          <p className={styles.signature} data-letter-content>{letter.signature}</p>
      </div>
    </section>
  )
}

export default Letter
