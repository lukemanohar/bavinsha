import styles from './Hero.module.css'

/**
 * Full-bleed portrait + vignette for Hero's background layer
 * (design-blueprint.md Sec. 8: "PortraitFrame (full-bleed image,
 * scroll-scale bound)"). The scroll-scale binding itself is GSAP work
 * that arrives in Milestone 5 — this component is static composition only.
 *
 * Local to Hero (not in components/) because, unlike EditorialLabel, no
 * other chapter reuses this exact full-bleed-portrait-with-vignette
 * pattern — Story's ImagePanel and Letter's PaperSurface are visually
 * and structurally distinct, each chapter-specific per Sec. 8.
 *
 * Renders a graceful placeholder (never a broken-image icon) when no
 * source is set yet in data/content.js, so the milestone is fully
 * demoable before a real photo exists.
 *
 * Milestone 16 (Sec. 11.5.4, image optimization): this is the site's
 * Largest Contentful Paint element — the opposite of a lazy-load
 * candidate. `loading="eager"` + `fetchPriority="high"` tell the browser
 * to fetch it immediately and prioritize it over everything else on the
 * page, rather than the default heuristic priority. `image.sources`
 * (optional, currently unset in content.js since no real photo exists
 * yet) lets a `<picture>` with AVIF/WebP variants be supplied later —
 * absent, as it is today, this renders a plain `<img>` exactly as
 * before, zero behavior change.
 */
function PortraitFrame({ image }) {
  const { src, alt, sources } = image

  return (
    <div className={styles.portraitFrame}>
      {src ? (
        sources?.length ? (
          <picture>
            {sources.map((source) => (
              <source key={source.type} srcSet={source.srcSet} type={source.type} />
            ))}
            <img
              className={styles.portraitImage}
              src={src}
              alt={alt}
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        ) : (
          <img
            className={styles.portraitImage}
            src={src}
            alt={alt}
            loading="eager"
            fetchPriority="high"
          />
        )
      ) : (
        <div className={styles.portraitPlaceholder} role="img" aria-label={alt}>
          <span className={styles.portraitPlaceholderLabel}>
            Portrait pending — add a photo to src/assets/images/ and set
            content.hero.portrait.src
          </span>
        </div>
      )}
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  )
}

export default PortraitFrame
