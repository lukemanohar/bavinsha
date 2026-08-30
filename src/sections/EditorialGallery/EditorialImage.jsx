import styles from './EditorialGallery.module.css'

function EditorialImage({ image, imageRef, className = '' }) {
  const classes = `${styles.imageFrame} ${styles[`tone${image.tone[0].toUpperCase()}${image.tone.slice(1)}`]} ${className}`

  return (
    <figure ref={imageRef} className={classes}>
      {image.src ? (
        <img src={image.src} alt={image.alt} loading="lazy" />
      ) : (
        <div className={styles.imagePlaceholder} role="img" aria-label={image.alt}>
          <span>Photograph<br />placeholder</span>
        </div>
      )}
    </figure>
  )
}

export default EditorialImage
