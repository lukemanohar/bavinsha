import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Ending.module.css'
import { useInViewport } from '../../hooks/useInViewport'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function Ending() {
  const sectionRef = useRef(null)
  const statementRef = useRef(null)
  const becomingRef = useRef(null)
  const nameRef = useRef(null)
  const birthdayRef = useRef(null)
  const signatureRef = useRef(null)
  const isInView = useInViewport(sectionRef, { rootMargin: '0px', once: true })
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!isInView) return undefined

    const ctx = gsap.context(() => {
      const lines = [statementRef.current, becomingRef.current, nameRef.current, birthdayRef.current, signatureRef.current]
      const duration = prefersReducedMotion ? 0.25 : 1.15

      gsap.set(sectionRef.current, { backgroundColor: 'var(--color-ivory)' })
      gsap.set(lines, { opacity: 0, y: prefersReducedMotion ? 0 : 12 })

      const reveal = gsap.timeline({ defaults: { ease: 'power2.out' } })
        .to(sectionRef.current, { backgroundColor: 'var(--color-black)', duration: prefersReducedMotion ? 0.1 : 1.4 })
        .to(statementRef.current, { opacity: 1, y: 0, duration }, '-=0.35')
        .to(becomingRef.current, { opacity: 1, y: 0, duration }, '-=0.72')
        .to(nameRef.current, { opacity: 1, y: 0, duration: duration * 0.8 }, '+=0.28')
        .to(birthdayRef.current, { opacity: 1, y: 0, duration: duration * 0.8 }, '-=0.68')
        .to(signatureRef.current, { opacity: 1, y: 0, duration: duration * 0.8 }, '+=0.12')

      return () => reveal.kill()
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView, prefersReducedMotion])

  return (
    <section ref={sectionRef} className={styles.ending} data-chapter="6" aria-label="Birthday ending">
      <div className={styles.closing}>
        <p ref={statementRef} className={styles.statement}>Some stories are not meant to end.</p>
        <p ref={becomingRef} className={styles.becoming}>They are meant to keep becoming.</p>
        <div className={styles.signatureBlock}>
          <p ref={nameRef} className={styles.name}>BAVINSHA</p>
          <p ref={birthdayRef} className={styles.birthday}>Happy Birthday.</p>
          <p ref={signatureRef} className={styles.signature}>— Luke</p>
        </div>
      </div>
    </section>
  )
}

export default Ending
