import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Reads the user's OS-level `prefers-reduced-motion` preference and stays
 * in sync if it changes mid-session (e.g. the user toggles it in their
 * system settings while the tab is open).
 *
 * This is the single detection point referenced by design-blueprint.md
 * Sec. 11.5.4 ("prefers-reduced-motion is checked once in a shared hook
 * and threaded through every section — never re-detected per-component").
 * useLenis.js consumes this to decide whether to enable smooth-scroll at
 * all; later milestones' GSAP timelines and the R3F scene will import it
 * the same way rather than calling matchMedia themselves.
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY)
    const handleChange = (event) => setPrefersReducedMotion(event.matches)

    // addEventListener is the modern API; Safari <14 needs the legacy
    // addListener fallback.
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange)
      return () => mediaQueryList.removeEventListener('change', handleChange)
    }

    mediaQueryList.addListener(handleChange)
    return () => mediaQueryList.removeListener(handleChange)
  }, [])

  return prefersReducedMotion
}

export default useReducedMotion
