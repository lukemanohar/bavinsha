# assets/audio/

Empty by design. When real audio is ready:

1. Drop the files here — e.g. `ambient-bed.mp3`, `letter-vinyl-crackle.mp3`,
   `ending-swell.mp3`.
2. Set the matching `src` in `data/content.js`'s `audio` key
   (`audio.ambientBed.src`, `audio.accents[5].src`, `audio.accents[6].src`).
3. Nothing else changes — `AudioController.jsx` only renders an `<audio>`
   element once a real `src` exists, and `useAudioController.js`'s
   cross-fade/volume logic already works correctly against real files.

Keep files reasonably compressed (audio is not lazy-loaded per-chapter
yet — `preload="none"` is set, but a very large file will still be a
slow first request once the user unmutes).
