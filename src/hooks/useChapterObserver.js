import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Shared, single source of truth for "which chapter is currently active"
 * (via IntersectionObserver on each section's `data-chapter` attribute)
 * plus overall document `scrollProgress` (via ScrollTrigger).
 *
 * This consolidates what were, through Milestone 15, two separate,
 * near-identical IntersectionObservers doing the same work independently —
 * useAudioController.js's own internal one (Milestone 13) and
 * useActiveChapter.js's own one (Milestone 14). That duplication was
 * flagged in both milestones' documentation as a consolidation candidate,
 * the same way `EASE_SCRUB` was before its own cleanup — but it's
 * Milestone 16 that actually forces the issue, not just tidiness:
 *
 * Code-splitting every chapter after Hero via `React.lazy` (App.jsx)
 * means their `[data-chapter]` DOM elements no longer all exist
 * synchronously at first render — each appears only once its chunk has
 * downloaded and mounted. Both of the original observers queried
 * `document.querySelectorAll('[data-chapter]')` exactly once, on mount;
 * any chapter whose chunk hadn't resolved yet by that moment would
 * silently never be tracked afterward. Fixing that race correctly in two
 * separate places was worse than fixing it once, so this hook is that
 * fix, done a single time:
 *
 * - A `MutationObserver` watches for new `[data-chapter]` elements
 *   appearing anywhere in the document, and re-subscribes the
 *   IntersectionObserver whenever one does.
 * - The same moment also calls `ScrollTrigger.refresh()`, since a lazy
 *   chapter mounting changes the document's total scrollable height
 *   without firing a `resize` event — which is what ScrollTrigger
 *   normally relies on to know to re-measure.
 * - The mutation callback reacts only when the total *count* of
 *   `[data-chapter]` elements increases versus the last known count —
 *   not by inspecting individual mutations' added nodes. That distinction
 *   matters: GSAP's pin-spacer (from Cinematic Transition's `pin: true`
 *   ScrollTrigger) reparents the existing chapter section into a wrapper
 *   div, which is a childList mutation containing a `[data-chapter]`
 *   descendant even though no chapter actually changed. Reacting to that
 *   by calling `ScrollTrigger.refresh()` retriggered the same mutation,
 *   which called `refresh()` again — an infinite synchronous loop that
 *   froze the main thread. Counting elements instead is immune to a node
 *   simply being moved, and still correctly catches a genuinely new lazy
 *   chapter mounting.
 */
export function useChapterObserver() {
  const [activeChapter, setActiveChapter] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const intersectionObserverRef = useRef(null)
  const ratiosRef = useRef(new Map())

  useEffect(() => {
    const updateActiveChapter = () => {
      let topChapter = null
      let topRatio = 0
      ratiosRef.current.forEach((ratio, chapter) => {
        if (ratio > topRatio) {
          topRatio = ratio
          topChapter = chapter
        }
      })
      if (topChapter) setActiveChapter(topChapter)
    }

    const observeChapters = () => {
      intersectionObserverRef.current?.disconnect()

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            ratiosRef.current.set(entry.target.getAttribute('data-chapter'), entry.intersectionRatio)
          })
          updateActiveChapter()
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      )

      const chapterEls = document.querySelectorAll('[data-chapter]')
      chapterEls.forEach((el) => observer.observe(el))
      intersectionObserverRef.current = observer

      return chapterEls.length
    }

    let knownChapterCount = observeChapters()

    // Bug fix (post-Milestone 16): this used to detect "did a
    // [data-chapter] node just get added" by inspecting each mutation's
    // addedNodes directly. That falsely matched GSAP's pin-spacer wrapper
    // (created by Cinematic Transition's `pin: true` ScrollTrigger),
    // which *reparents* the existing data-chapter="2" section into a new
    // spacer div — a childList mutation whose added node contains a
    // [data-chapter] descendant, even though no new chapter mounted.
    // That produced a synchronous feedback loop: this callback called
    // ScrollTrigger.refresh(), which adjusts the pin-spacer, which
    // re-triggered this same callback, forever — freezing the main
    // thread solid (Chrome's "Page Unresponsive").
    //
    // Comparing the *count* of matched elements instead is immune to
    // reparenting: moving an existing chapter's node around never
    // changes how many [data-chapter] elements exist, so it's correctly
    // ignored. Only a genuinely new lazy-loaded chapter mounting
    // increases the count, which is the one case this observer actually
    // needs to react to.
    const mutationObserver = new MutationObserver(() => {
      const currentChapterCount = document.querySelectorAll('[data-chapter]').length
      if (currentChapterCount <= knownChapterCount) return

      knownChapterCount = observeChapters()
      ScrollTrigger.refresh()
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      intersectionObserverRef.current?.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setScrollProgress(self.progress),
    })

    return () => trigger.kill()
  }, [])

  return { activeChapter, scrollProgress }
}

export default useChapterObserver
