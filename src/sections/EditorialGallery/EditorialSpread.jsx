import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import EditorialLabel from '../../components/EditorialLabel'
import { createEditorialSpreadReveal } from '../../animations/editorialGallery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import EditorialImage from './EditorialImage'
import styles from './EditorialGallery.module.css'

function EditorialSpread({ spread }) {
  const spreadRef = useRef(null)
  const copyRef = useRef(null)
  const imageRefs = useRef([])
  imageRefs.current = []
  const prefersReducedMotion = useReducedMotion()
  const registerImage = (node) => node && imageRefs.current.push(node)

  useEffect(() => {
    const ctx = gsap.context(() => {
      createEditorialSpreadReveal({ spreadRef, imageRefs, copyRef }, prefersReducedMotion)
    }, spreadRef)
    return () => ctx.revert()
  }, [prefersReducedMotion])

  const image = (index, className) => {
    const imageData = spread.images[index]
    if (!imageData) return null
    return <EditorialImage key={imageData.id} image={imageData} imageRef={registerImage} className={className} />
  }
  const copy = (className = '') => (
    <div ref={copyRef} className={`${styles.copy} ${className}`}>
      <EditorialLabel>{spread.label}</EditorialLabel>
      {spread.title && <h2 className={styles.title}>{spread.title}</h2>}
      {spread.quote && <blockquote className={styles.quote}>{spread.quote}</blockquote>}
      {spread.caption && <p className={styles.caption}>{spread.caption}</p>}
    </div>
  )

  let composition
  switch (spread.variant) {
    case 'collage': composition = <>{image(0, styles.collageTall)}{image(1, styles.collageDetail)}{image(2, styles.collageWide)}{copy(styles.collageCopy)}</>; break
    case 'editorialCollage': composition = <>{image(0, styles.editorialCollagePrimary)}{image(1, styles.editorialCollageDetail)}{copy(styles.editorialCollageCopy)}</>; break
    case 'triptych': composition = <>{image(0, styles.triptychOne)}{image(1, styles.triptychTwo)}{image(2, styles.triptychThree)}{copy(styles.triptychCopy)}</>; break
    case 'whitespace': composition = <>{copy(styles.whitespaceCopy)}{image(0, styles.whitespaceImage)}</>; break
    case 'quietWhitespace': composition = <>{image(0, styles.quietWhitespaceImage)}{copy(styles.quietWhitespaceCopy)}</>; break
    case 'fullWidthStill': composition = <>{image(0, styles.fullWidthStillImage)}{copy(styles.fullWidthStillCopy)}</>; break
    case 'quote': composition = <>{image(0, styles.quoteImage)}{copy(styles.quoteCopy)}</>; break
    case 'twoColumn': composition = <>{image(0, styles.columnImage)}{copy(styles.columnCopy)}{image(1, styles.columnImage)}</>; break
    case 'contactSheet': composition = <>{copy(styles.contactCopy)}<div className={styles.contactGrid}>{spread.images.map((_, index) => image(index, styles.contactImage))}</div></>; break
    case 'polaroids': composition = <>{copy(styles.polaroidCopy)}<div className={styles.polaroidGrid}>{image(0, styles.polaroidOne)}{image(1, styles.polaroidTwo)}{image(2, styles.polaroidThree)}</div></>; break
    case 'portraitCaption': composition = <>{image(0, styles.portraitImage)}{copy(styles.portraitCopy)}</>; break
    case 'split': composition = <>{image(0, styles.splitPortrait)}{copy(styles.splitCopy)}{image(1, styles.splitLandscape)}</>; break
    case 'cinematic': composition = <>{image(0, styles.cinematicImage)}{copy(styles.cinematicCopy)}</>; break
    case 'finalFrame': composition = <>{image(0, styles.finalFrameImage)}{copy(styles.finalFrameCopy)}</>; break
    default: composition = <>{image(0, styles.fullBleedImage)}{copy(styles.fullBleedCopy)}</>
  }

  return <article ref={spreadRef} className={`${styles.spread} ${styles[`variant${spread.variant[0].toUpperCase()}${spread.variant.slice(1)}`]}`}>{composition}</article>
}

export default EditorialSpread
