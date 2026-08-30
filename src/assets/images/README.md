# assets/images/

Empty by design. When real photos are ready:

1. Drop files here — e.g. `hero-portrait.jpg`, `story-01.jpg`, etc.
2. Set the matching `src` in `data/content.js` (`content.hero.portrait.src`,
   each `content.story.stories[].image.src`,
   `content.story.minimalCaptionBlock.image.src`).
3. That alone is enough — `PortraitFrame.jsx` and `StoryImage.jsx` already
   handle a real `src` correctly (Milestone 16 added `loading="eager"` +
   `fetchPriority="high"` for Hero's portrait, since it's the site's
   Largest Contentful Paint element, and `loading="lazy"` for every Story
   image, since those are all below the fold).

## Optional: AVIF/WebP responsive formats

Both components also accept an optional `sources` array on the same image
object, for a `<picture>` with modern-format variants and the original
`src` as the final fallback:

```js
portrait: {
  src: '/src/assets/images/hero-portrait.jpg',
  alt: '...',
  sources: [
    { type: 'image/avif', srcSet: '/src/assets/images/hero-portrait.avif' },
    { type: 'image/webp', srcSet: '/src/assets/images/hero-portrait.webp' },
  ],
},
```

Omit `sources` entirely (as every image currently does) and both
components render a plain `<img>` — nothing breaks either way.
