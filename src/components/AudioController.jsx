import styles from './AudioController.module.css'
import { useAudioController } from '../hooks/useAudioController'
import { content } from '../data/content'

/**
 * AudioController (design-blueprint.md Sec. 8: "AudioController
 * (floating, persistent across chapters)"). Mounted once at the app
 * root, alongside SmoothScrollProvider, per Sec. 8's top-level component
 * tree — not nested inside any single chapter.
 *
 * Renders two things:
 * 1. The actual <audio> elements (ambient bed + per-chapter accents),
 *    invisible, entirely driven by useAudioController.
 * 2. The toggle itself — a thin gold ring, bottom corner (Sec. 6) —
 *    muted by default. Audio only ever starts from this explicit click,
 *    which is both the locked design's rule and what browser autoplay
 *    policy requires regardless.
 *
 * No real audio files exist yet (every `src` in data/content.js's
 * `audio` key is `null`) — the same honest-placeholder approach as
 * Hero's PortraitFrame and Story's StoryImage. <audio> elements are
 * simply not rendered until a real src is set; the toggle and all
 * cross-fade logic in the hook work correctly either way, no-oping
 * safely when there's nothing to actually play.
 */
function AudioController() {
  const { audio } = content
  const { isMuted, toggle, ambientRef, accentRefs } = useAudioController()

  return (
    <>
      {audio.ambientBed.src && (
        <audio ref={ambientRef} src={audio.ambientBed.src} loop preload="none" />
      )}

      {Object.entries(audio.accents).map(([chapter, accent]) =>
        accent.src ? (
          <audio
            key={chapter}
            ref={(el) => {
              accentRefs.current[chapter] = el
            }}
            src={accent.src}
            loop
            preload="none"
          />
        ) : null,
      )}

      <button
        type="button"
        className={styles.toggle}
        onClick={toggle}
        aria-pressed={!isMuted}
        aria-label={isMuted ? 'Play ambient music' : 'Mute ambient music'}
      >
        <span className={styles.ring} data-active={!isMuted} />
      </button>
    </>
  )
}

export default AudioController
