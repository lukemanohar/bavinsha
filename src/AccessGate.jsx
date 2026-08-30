import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import styles from './AccessGate.module.css'
import { useReducedMotion } from './hooks/useReducedMotion'
import accessPhoto from './assets/images/WhatsApp Image 2026-08-24 at 01.46.14.jpeg'

const ACCESS_PASSWORD = '241225'
const REMEMBER_ACCESS = true
const ACCESS_STORAGE_KEY = 'birthday-experience-access'
const GATE_PHOTO = accessPhoto

function hasRememberedAccess() {
  if (!REMEMBER_ACCESS || typeof window === 'undefined') return false
  return window.sessionStorage.getItem(ACCESS_STORAGE_KEY) === 'granted'
}

function AccessGate({ children }) {
  const gateRef = useRef(null)
  const photoRef = useRef(null)
  const copyRef = useRef(null)
  const formRef = useRef(null)
  const inputRef = useRef(null)
  const errorRef = useRef(null)
  const [isGranted, setIsGranted] = useState(hasRememberedAccess)
  const [error, setError] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (isGranted) return undefined

    const ctx = gsap.context(() => {
      const content = copyRef.current.children
      gsap.set(photoRef.current, { autoAlpha: 0, y: 12 })
      gsap.set(content, { autoAlpha: 0, y: 10 })
      const entrance = gsap.timeline({ defaults: { ease: 'power2.out' } })
        .to(photoRef.current, { autoAlpha: 1, y: 0, duration: prefersReducedMotion ? 0.2 : 0.9 })
        .to(content, { autoAlpha: 1, y: 0, duration: prefersReducedMotion ? 0.2 : 0.7, stagger: prefersReducedMotion ? 0 : 0.08 }, '-=0.45')

      return () => entrance.kill()
    }, gateRef)

    return () => ctx.revert()
  }, [isGranted, prefersReducedMotion])

  const grantAccess = () => {
    if (REMEMBER_ACCESS) window.sessionStorage.setItem(ACCESS_STORAGE_KEY, 'granted')
    if (prefersReducedMotion) {
      setIsGranted(true)
      return
    }

    gsap.ticker.wake()
    gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => setIsGranted(true),
    })
      .to(formRef.current, { autoAlpha: 0, y: -8, duration: 0.35 })
      .to(photoRef.current, { scale: 0.9, autoAlpha: 0, duration: 0.8 }, '-=0.05')
      .to(gateRef.current, { autoAlpha: 0, duration: 0.9 }, '-=0.42')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (inputRef.current.value.trim().toLowerCase() !== ACCESS_PASSWORD) {
      setError(true)
      gsap.fromTo(inputRef.current, { x: 0 }, { x: 4, duration: 0.08, repeat: 3, yoyo: true, clearProps: 'x' })
      inputRef.current.focus()
      return
    }
    setError(false)
    inputRef.current.disabled = true
    grantAccess()
  }

  if (isGranted) return children

  return (
    <>
      {children}
      <div ref={gateRef} className={styles.gate} role="dialog" aria-modal="true" aria-label="Private birthday entrance">
        <div className={styles.inner}>
          <p className={styles.kicker}>A LITTLE SOMETHING FOR YOU</p>
          <img ref={photoRef} className={styles.photo} src={GATE_PHOTO} alt="Bavinsha" />
          <div ref={copyRef} className={styles.copy}>
            <h1>BAVINSHA</h1>
            <p>something made just for you</p>
          </div>
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="access-password">Enter the password</label>
            <input ref={inputRef} id="access-password" className={styles.input} type="password" placeholder="Enter the password" autoComplete="current-password" aria-invalid={error} aria-describedby={error ? 'access-error' : undefined} />
            <button className={styles.submit} type="submit">ENTER</button>
            <p ref={errorRef} id="access-error" className={`${styles.error} ${error ? styles.errorVisible : ''}`} style={{ opacity: error ? 1 : undefined }} aria-live="polite">Try again.</p>
          </form>
        </div>
      </div>
    </>
  )
}

export default AccessGate
