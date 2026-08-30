import styles from './InstagramConversation.module.css'

/**
 * A compact recreation of Instagram's DM header, including identity,
 * presence, and familiar call/video controls. Icons are drawn with CSS
 * so the component remains self-contained.
 */
function InstagramHeader({ username }) {
  return (
    <header className={styles.header}>
      <span className={styles.backChevron} aria-hidden="true" />
      <span className={styles.headerAvatar} aria-hidden="true">
        {username.charAt(0).toUpperCase()}
      </span>
      <div className={styles.headerIdentity}>
        <span className={styles.headerUsername}>{username}</span>
        <span className={styles.headerStatus}>Active now</span>
      </div>
      <div className={styles.headerActions} aria-hidden="true">
        <span className={`${styles.headerIcon} ${styles.callIcon}`} />
        <span className={`${styles.headerIcon} ${styles.videoIcon}`} />
      </div>
    </header>
  )
}

export default InstagramHeader
