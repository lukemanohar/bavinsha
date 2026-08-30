import { useChapterObserver } from './useChapterObserver'

/**
 * Tracks two related but distinct things about where the reader is in
 * the overall six-chapter journey:
 *
 * - `activeChapter`: whichever `[data-chapter]` element (1-6, as a
 *   string) currently has the greatest intersection with the viewport —
 *   discrete, jumps between exactly six values. Used by MinimalNav to
 *   highlight the current chapter in its jump-list.
 * - `scrollProgress`: a continuous 0-1 value for how far through the
 *   *entire* document the user has scrolled — used by ChapterProgressRail
 *   for a smooth fill, which should track continuously rather than jump
 *   in six discrete steps.
 *
 * As of Milestone 16, this is a thin delegate to useChapterObserver.js —
 * the actual IntersectionObserver/ScrollTrigger logic now lives there,
 * shared with useAudioController.js, instead of being duplicated between
 * the two (see useChapterObserver.js's own doc comment for why Milestone
 * 16's code-splitting is what forced that consolidation). Kept as its
 * own file, with the same exported name and return shape, purely so
 * AppProvider.jsx — which already imports `useActiveChapter` — needs no
 * changes at all.
 */
export function useActiveChapter() {
  return useChapterObserver()
}

export default useActiveChapter
