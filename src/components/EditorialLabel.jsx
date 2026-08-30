import styles from './EditorialLabel.module.css'

/**
 * Shared editorial-style label — the small, uppercase, tracked-out text
 * that precedes a headline (design-blueprint.md Sec. 3.2, "Editorial
 * Label" type role; example format given in Sec. 3.3: "CHAPTER ONE — THE
 * BEGINNING"). Listed as a shared component in Sec. 11.5.2 / this folder's
 * README, since every chapter uses this same label treatment.
 *
 * First consumed by Hero (Milestone 4).
 *
 * `as` lets a consumer render it as a heading-level element when needed
 * for document outline purposes, while keeping the same visual treatment.
 */
function EditorialLabel({ children, as: Component = 'span', className = '' }) {
  const classes = className ? `${styles.label} ${className}` : styles.label
  return <Component className={classes}>{children}</Component>
}

export default EditorialLabel
