import gsap from 'gsap'
import { EASE_SCRUB } from '../utils/easing'

/**
 * Gives each editorial spread one restrained ScrollTrigger reveal. Images
 * settle from a barely enlarged crop while the accompanying type rises a
 * few pixels; no looping or simulated camera movement is used.
 */
export function createEditorialSpreadReveal({ spreadRef, imageRefs, copyRef }, prefersReducedMotion = false) {
  const images = imageRefs.current.filter(Boolean)
  const targets = [...images, copyRef.current].filter(Boolean)

  if (!spreadRef.current || targets.length === 0) return

  if (prefersReducedMotion) {
    gsap.set(targets, { opacity: 0 })
    gsap.to(targets, {
      opacity: 1,
      duration: 0.45,
      ease: 'none',
      scrollTrigger: { trigger: spreadRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    })
    return
  }

  gsap.set(images, { autoAlpha: 0, scale: 1.05 })
  if (copyRef.current) gsap.set(copyRef.current, { autoAlpha: 0, y: 18 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: spreadRef.current,
      start: 'top 82%',
      end: 'top 35%',
      scrub: 0.65,
    },
    defaults: { ease: EASE_SCRUB },
  })

  if (images.length) tl.to(images, { autoAlpha: 1, scale: 1, duration: 1, stagger: 0.1 }, 0)
  if (copyRef.current) tl.to(copyRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.12)
}

export default createEditorialSpreadReveal
