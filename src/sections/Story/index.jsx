import styles from './Story.module.css'
import StorySpread from './subcomponents/StorySpread'
import InstagramConversation from './InstagramConversation'
import { content } from '../../data/content'

/**
 * Chapter 3 — Story. `stories` is mapped directly from content.js, while
 * InstagramConversation replaces the image panel for Memory Two.
 */
function Story() {
  const { story } = content

  return (
    <section className={styles.story} data-chapter="3">
      {story.stories.map((storyItem, index) => (
        <StorySpread
          key={storyItem.id}
          story={storyItem}
          index={index}
          imageContent={
            storyItem.id === 'story-02' ? <InstagramConversation embedded /> : null
          }
        />
      ))}
    </section>
  )
}

export default Story
