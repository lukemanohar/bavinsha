import { forwardRef } from 'react'
import styles from './CinematicTransition.module.css'

/**
 * One depth-sorted layer in the pinned sequence (design-blueprint.md
 * Sec. 8: "LayeredImages[] (depth-sorted, independent scale/blur/opacity
 * curves)"). Three instances are stacked in CinematicTransition/index.jsx
 * (back, mid, front) — each identical in structure, differentiated only
 * by a CSS variant class and by the independent GSAP curve driving it
 * from animations/cinematicTransition.js.
 *
 * No real photography exists yet, so each layer renders an honest
 * placeholder (a subtle vignette + label) rather than a fake stock image —
 * the same pattern Hero/PortraitFrame.jsx established in Milestone 4.
 * Swapping in real photography later means replacing this component's
 * placeholder branch with an <img>, exactly like PortraitFrame — no
 * change to the animation or pin logic.
 *
 * forwardRef so index.jsx can attach its own ref per instance directly,
 * which is what the GSAP timeline animates.
 */
const DepthLayer = forwardRef(function DepthLayer({ label, variant }, ref) {
  const variantClass = styles[`depthLayer${variant}`]

  return (
    <div ref={ref} className={`${styles.depthLayer} ${variantClass}`}>
      <span className={styles.depthLayerLabel}>{label}</span>
    </div>
  )
})

export default DepthLayer
