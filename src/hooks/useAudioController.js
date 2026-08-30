import { useCallback, useEffect, useRef, useState } from 'react'
import { useChapterObserver } from './useChapterObserver'

// Sec. 6: "never above -18dB perceived loudness." Volume here is linear
// (0-1, standard HTMLMediaElement.volume), so this is converted from dB:
// volume = 10^(dB/20) → 10^(-18/20) ≈ 0.1259. Rounded down slightly to
// stay safely at-or-under the ceiling rather than right at its edge.
const MAX_VOLUME = 0.125

// Sec. 6: "Fade music between chapters... cross-fade over 1.5s. Never a
// hard cut." Used for both the ambient bed's mute/unmute fade and every
// chapter accent's in/out cross-fade.
const CROSSFADE_MS = 1500
const FADE_STEP_MS = 50

/**
 * Linearly fades an <audio> element's volume from its current value
 * toward `target` over `durationMs`, in small steps rather than a single
 * jump — this is what makes every transition a cross-fade instead of a
 * hard cut. Returns a cleanup function that cancels the fade early if
 * called (e.g. if another fade needs to start before this one finishes).
 */
function fadeVolume(audioEl, target, durationMs) {
  if (!audioEl) return () => {}

  const start = audioEl.volume
  const steps = Math.max(1, Math.round(durationMs / FADE_STEP_MS))
  let currentStep = 0

  const interval = setInterval(() => {
    currentStep += 1
    const progress = currentStep / steps
    audioEl.volume = start + (target - start) * progress

    if (currentStep >= steps) {
      audioEl.volume = target
      clearInterval(interval)
    }
  }, FADE_STEP_MS)

  return () => clearInterval(interval)
}

/**
 * Drives AudioController.jsx: playback state, the muted-by-default
 * toggle, and chapter-aware cross-fading of accent tracks.
 *
 * Chapter tracking (as of Milestone 16) comes from the shared
 * useChapterObserver hook rather than an internal IntersectionObserver
 * built here — this file used to have its own, near-identical copy of
 * that logic (Milestone 13), which was flagged as a duplication
 * candidate the moment useActiveChapter.js (Milestone 14) built a second
 * one independently. Milestone 16's code-splitting (App.jsx) is what
 * actually forced consolidating them: see useChapterObserver.js's own
 * doc comment for why the original once-on-mount querySelectorAll
 * approach breaks once chapters are lazy-loaded.
 *
 * design-blueprint.md Sec. 6 in full:
 * - Muted by default; audio only ever starts from an explicit user
 *   toggle (also required by browser autoplay policy — this hook never
 *   calls .play() on mount).
 * - A single ambient bed loops continuously once unmuted.
 * - Per-chapter accent tracks (keyed by chapter number in
 *   data/content.js) cross-fade in as their chapter becomes active and
 *   out as it's left, never abruptly.
 * - Nothing ever exceeds MAX_VOLUME (~-18dB).
 */
export function useAudioController() {
  const [isMuted, setIsMuted] = useState(true)
  const { activeChapter } = useChapterObserver()

  const ambientRef = useRef(null)
  const accentRefs = useRef({})
  const activeFades = useRef([])

  const cancelActiveFades = useCallback(() => {
    activeFades.current.forEach((cancel) => cancel())
    activeFades.current = []
  }, [])

  // Cross-fade accent tracks in/out as the active chapter changes.
  useEffect(() => {
    if (isMuted) return

    Object.entries(accentRefs.current).forEach(([chapter, el]) => {
      if (!el) return

      if (chapter === activeChapter) {
        el.play?.().catch(() => {
          // Autoplay can still be blocked in some browsers even after a
          // prior user gesture unmuted the ambient bed; failing silently
          // here just means this accent stays inaudible, never a thrown
          // error the user sees.
        })
        activeFades.current.push(fadeVolume(el, MAX_VOLUME, CROSSFADE_MS))
      } else if (!el.paused) {
        activeFades.current.push(fadeVolume(el, 0, CROSSFADE_MS))
      }
    })
  }, [activeChapter, isMuted])

  const toggle = useCallback(() => {
    setIsMuted((wasMuted) => {
      const nextMuted = !wasMuted
      cancelActiveFades()

      if (nextMuted) {
        if (ambientRef.current) {
          fadeVolume(ambientRef.current, 0, CROSSFADE_MS)
          setTimeout(() => ambientRef.current?.pause(), CROSSFADE_MS)
        }
        Object.values(accentRefs.current).forEach((el) => {
          if (el && !el.paused) fadeVolume(el, 0, CROSSFADE_MS)
        })
      } else if (ambientRef.current) {
        ambientRef.current.play?.().catch(() => {})
        fadeVolume(ambientRef.current, MAX_VOLUME, CROSSFADE_MS)
      }

      return nextMuted
    })
  }, [cancelActiveFades])

  return { isMuted, toggle, ambientRef, accentRefs }
}

export default useAudioController
