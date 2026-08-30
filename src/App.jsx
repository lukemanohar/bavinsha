import { lazy, Suspense } from 'react'
import Hero from './sections/Hero'
import SmoothScrollProvider from './components/SmoothScrollProvider'
import AudioController from './components/AudioController'
import AppProvider from './components/AppProvider'
import ProgressRail from './components/ProgressRail'
import MinimalNav from './components/MinimalNav'
import AccessGate from './AccessGate'

// Milestone 16 (Sec. 11.5.4): "each chapter section is React.lazy-loaded
// except Hero (which must paint immediately)." Hero stays a normal
// static import — splitting it would delay first paint, the opposite of
// what code-splitting is for. The other five are dynamically imported,
// so their code only downloads as the user actually scrolls toward them.
const CinematicTransition = lazy(() => import('./sections/CinematicTransition'))
const Story = lazy(() => import('./sections/Story'))
const EditorialGallery = lazy(() => import('./sections/EditorialGallery'))
const Letter = lazy(() => import('./sections/Letter'))
const Ending = lazy(() => import('./sections/Ending'))

// Milestone 14 adds AppProvider (Sec. 11.5.3's shared context, scoped to
// activeChapter/scrollProgress), ProgressRail, and MinimalNav — all
// persistent, top-level components per design-blueprint.md Sec. 8's
// component tree, alongside SmoothScrollProvider and AudioController
// rather than nested inside any single chapter. The chapters themselves
// remain untouched.
//
// Each lazy chapter gets its own Suspense boundary, rather than one
// boundary wrapping all five — a single shared boundary would hold
// Story back from rendering just because Ending's chunk (much further
// down the scroll) hadn't finished downloading yet. Fallback is `null`:
// the body's own black background (global.css) already shows through
// with no visible flash, the same reasoning already used for
// the lazy editorial gallery's own independent loading boundary.
function App() {
  return (
    <AccessGate>
      <SmoothScrollProvider>
        <AppProvider>
          <main>
            <Hero />
          <Suspense fallback={null}>
            <CinematicTransition />
          </Suspense>
          <Suspense fallback={null}>
            <Story />
          </Suspense>
          <Suspense fallback={null}>
            <EditorialGallery />
          </Suspense>
          <Suspense fallback={null}>
            <Letter />
          </Suspense>
          <Suspense fallback={null}>
            <Ending />
          </Suspense>
          </main>
          <AudioController />
          <ProgressRail />
          <MinimalNav />
        </AppProvider>
      </SmoothScrollProvider>
    </AccessGate>
  )
}

export default App
