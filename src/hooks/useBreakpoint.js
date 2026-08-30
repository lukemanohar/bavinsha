import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '../utils/breakpoints'

function getCategory(width) {
  if (width < BREAKPOINTS.tablet) return 'mobile'
  if (width < BREAKPOINTS.desktop) return 'tablet'
  return 'desktop'
}

/**
 * Reads the current breakpoint category ('mobile' | 'tablet' | 'desktop'),
 * kept in sync with window resize. Reads from utils/breakpoints.js rather
 * than duplicating the pixel values, so this and tokens.css's CSS media
 * queries never drift apart.
 *
 * Introduced for Milestone 9b: Memory World needs to know the current
 * breakpoint in JS (not just CSS) to decide how many floating objects to
 * render (design-blueprint.md Sec. 10: "Memory World reduces object
 * count ... on tablet, further on mobile"). Not chapter-specific — any
 * future section needing the same JS-side breakpoint awareness can reuse
 * this directly.
 */
export function useBreakpoint() {
  const [category, setCategory] = useState(() =>
    typeof window === 'undefined' ? 'desktop' : getCategory(window.innerWidth),
  )

  useEffect(() => {
    function handleResize() {
      setCategory(getCategory(window.innerWidth))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return category
}

export default useBreakpoint
