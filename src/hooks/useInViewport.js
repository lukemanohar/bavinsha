import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether an element is within — or near, via `rootMargin` — the
 * viewport, using IntersectionObserver.
 *
 * Introduced for Milestone 9a: the Memory World's R3F `<Canvas>` should
 * only exist while its chapter is actually needed, per design-blueprint.md
 * Sec. 11.5.4 ("an on-scroll visibility check that pauses the render loop
 * ... when Chapter 4 isn't in view"). Mounting/unmounting the canvas
 * component itself — rather than just toggling its render loop — is what
 * lets the WebGL context be created and torn down cleanly as the section
 * scrolls in and out, which is this milestone's test criterion.
 *
 * A generous default `rootMargin` means the canvas mounts slightly before
 * the section reaches the viewport edge, so there's no visible pop-in.
 *
 * Not chapter-specific — lives in hooks/ since any future section that
 * needs the same "only do expensive work near-viewport" behavior can
 * reuse it directly.
 */
export function useInViewport(ref, { rootMargin = '200px 0px', once = false } = {}) {
  const [isInView, setIsInView] = useState(false)
  const hasBeenInView = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenInView.current = true
          setIsInView(true)
        } else if (!once || !hasBeenInView.current) {
          setIsInView(false)
        }
      },
      { rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, rootMargin, once])

  return isInView
}

export default useInViewport
