import styles from './Story.module.css'

/**
 * Renders a real photo if one is set, otherwise an honest placeholder —
 * same pattern as Hero/PortraitFrame.jsx (Milestone 4), duplicated here
 * rather than shared globally because image handling is chapter-specific
 * per design-blueprint.md Sec. 8 (Hero's PortraitFrame, Story's own image
 * handling, and Letter's future PaperSurface are each visually and
 * structurally distinct).
 *
 * Local to the Story chapter only: both StorySpread (subcomponents/) and
 * MinimalCaptionBlock (composed directly in index.jsx) need the same
 * few lines, so this exists to avoid duplicating them twice within one
 * chapter — it is not promoted to components/ because no other chapter
 * uses this exact treatment.
 *
 * The parent is expected to size/crop via its own container (aspect-ratio
 * + overflow: hidden); this component fills that container at 100%/100%.
 *
 * Milestone 16 (Sec. 11.5.4, image optimization): every image in this
 * chapter is below the fold, so `loading="lazy"` is appropriate here —
 * the opposite choice from Hero's LCP portrait. `image.sources`
 * (optional, currently unset everywhere in content.js since no real
 * photos exist yet) lets a `<picture>` with AVIF/WebP variants be
 * supplied later — absent, as it is today, this renders a plain `<img>`
 * exactly as before, zero behavior change.
 */
function StoryImage({ image }) {
  const { src, alt, sources } = image

  if (!src) {
    return (
      <div className={styles.imagePlaceholder} role="img" aria-label={alt}>
        <span className={styles.imagePlaceholderLabel}>
          Photo pending — add to src/assets/images/
        </span>
      </div>
    )
  }

  if (sources?.length) {
    return (
      <picture>
        {sources.map((source) => (
          <source key={source.type} srcSet={source.srcSet} type={source.type} />
        ))}
        <img className={styles.storyImage} src={src} alt={alt} loading="lazy" />
      </picture>
    )
  }

  return <img className={styles.storyImage} src={src} alt={alt} loading="lazy" />
}

export default StoryImage
