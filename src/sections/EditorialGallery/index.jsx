import styles from './EditorialGallery.module.css'
import { content } from '../../data/content'
import EditorialSpread from './EditorialSpread'

function EditorialGallery() {
  return (
    <section className={styles.gallery} data-chapter="4" aria-label="Bavinsha editorial gallery">
      <header className={styles.cover}>
        <p className={styles.coverKicker}>THE EDITORIAL</p>
        <h1 className={styles.coverTitle}>BAVINSHA</h1>
        <p className={styles.coverDeck}>A STUDY IN LIGHT, MOVEMENT &amp; HER</p>
      </header>
      {content.editorialGallery.spreads.map((spread) => <EditorialSpread key={spread.id} spread={spread} />)}
    </section>
  )
}

export default EditorialGallery
