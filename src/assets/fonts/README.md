# assets/fonts/

Empty by design. If/when the licensed typefaces named in
design-blueprint.md Sec. 3.1 (Canela, Suisse Intl) are purchased:

1. Drop the font files here (e.g. `canela-regular.woff2`, `suisse-intl-regular.woff2`).
2. Add `@font-face` rules for them in `src/styles/global.css`.
3. Nothing else changes — `tokens.css` already lists `'Canela'` and
   `'Suisse Intl'` first in `--font-display` / `--font-sans`, so the
   browser picks them up automatically over the Cormorant Garamond /
   Inter fallback loaded via Google Fonts in `index.html`.
