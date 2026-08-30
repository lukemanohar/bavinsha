import { createContext, useContext } from 'react'
import { useActiveChapter } from '../hooks/useActiveChapter'

const AppContext = createContext(null)

/**
 * design-blueprint.md Sec. 11.5.3: "Global concerns (audio on/off,
 * current chapter index for the progress rail, reduced-motion flag)
 * live in a small AppContext." This is that context.
 *
 * Scoped, for this milestone, to exactly what ChapterProgressRail and
 * MinimalNav need — `activeChapter` and `scrollProgress`. Audio state
 * deliberately stays where it already lives (useAudioController's own
 * local state, Milestone 13) rather than being folded in here: moving it
 * would mean modifying a completed milestone's files, out of scope for
 * this one.
 *
 * Mounted once at the app root in App.jsx, wrapping everything that
 * needs to read scroll position — mirrors SmoothScrollProvider's
 * placement and role.
 */
function AppProvider({ children }) {
  const activeChapterState = useActiveChapter()

  return <AppContext.Provider value={activeChapterState}>{children}</AppContext.Provider>
}

/**
 * Consumer hook for AppContext. Throws outside a provider rather than
 * silently returning undefined, so a missing <AppProvider> in the tree
 * fails loudly during development instead of producing a confusing
 * blank progress rail.
 */
export function useAppContext() {
  const contextValue = useContext(AppContext)
  if (!contextValue) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return contextValue
}

export default AppProvider
