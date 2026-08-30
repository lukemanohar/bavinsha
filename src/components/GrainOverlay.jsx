import styles from './GrainOverlay.module.css'

/**
 * A persistent, subtle, animated grain texture (design-blueprint.md
 * Sec. 1.1: "a subtle film-grain overlay (2-4% opacity, animated at low
 * frequency) sits above every chapter to unify the palette"; Sec. 8 also
 * lists it specifically as Chapter 6's own FilmGrainOverlay).
 *
 * Built as a genuinely shared, reusable component — per Sec. 11.5.2's
 * folder plan, which named it in components/ from the start — even
 * though this milestone only wires it into Ending. Applying it site-wide
 * the way Sec. 1.1 ultimately envisions would mean touching every
 * already-completed chapter, which is out of scope for this milestone's
 * diff; this component is ready for that whenever it's explicitly asked
 * for.
 *
 * Pure CSS: an inline SVG feTurbulence data-URI tiled as a background,
 * animated via a low-frequency stepped keyframe — no per-frame JS cost,
 * no external texture asset needed.
 */
function GrainOverlay() {
  return <div className={styles.grainOverlay} aria-hidden="true" />
}

export default GrainOverlay
