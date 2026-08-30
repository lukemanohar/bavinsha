import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '../utils/breakpoints'

const QUERY = `(max-width: ${BREAKPOINTS.tablet - 1}px)`

/**
 * Reports whether the viewport is currently below the tablet breakpoint
 * (design-blueprint.md Sec. 4.1, mirrored in utils/breakpoints.js).
 *
 * Introduced for Milestone 9b: Memory World needs to render fewer
 * floating objects on narrow viewports per Sec. 10 ("mobile... reduces
 * object count"), which is one of this milestone's own test criteria —
 * not deferred to Milestone 15's full responsive pass. Kept generic
 * (not chapter-specific) since any earlier chapter's future coarse
 * mobile/not-mobile check can reuse it the same way useReducedMotion is
 * reused, rather than each chapter reimplementing its own matchMedia call.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY)
    const handleChange = (event) => setIsMobile(event.matches)

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange)
      return () => mediaQueryList.removeEventListener('change', handleChange)
    }

    mediaQueryList.addListener(handleChange)
    return () => mediaQueryList.removeListener(handleChange)
  }, [])

  return isMobile
}

export default useIsMobile
