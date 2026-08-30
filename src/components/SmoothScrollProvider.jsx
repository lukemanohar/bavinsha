import { useLenis } from '../hooks/useLenis'

/**
 * design-blueprint.md Sec. 8 lists SmoothScrollProvider (Lenis) as a
 * top-level wrapper in the component hierarchy, alongside AudioController
 * and the nav/progress components arriving in later milestones. This is
 * that component.
 *
 * It renders no DOM of its own — it exists purely to call useLenis() once,
 * at the root, for the lifetime of the app. Wrapping children (rather than
 * calling the hook directly in App.jsx) keeps App.jsx focused on chapter
 * composition and keeps the scroll-engine concern isolated and swappable.
 */
function SmoothScrollProvider({ children }) {
  useLenis()

  return children
}

export default SmoothScrollProvider
