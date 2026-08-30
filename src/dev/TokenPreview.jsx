import styles from './TokenPreview.module.css'

/**
 * QA-ONLY component for Milestone 2.
 *
 * This is the "throwaway test page" called for in implementation-roadmap.md
 * (Milestone 2 test criteria): a visual ladder of every color, type role,
 * and spacing value in tokens.css, side by side, so they can be checked
 * against design-blueprint.md Sections 2-4 by eye before any real chapter
 * is built on top of them.
 *
 * NOT imported by App.jsx and never mounted in production. To use it:
 *   1. Temporarily add `import TokenPreview from './dev/TokenPreview'`
 *      and `<TokenPreview />` in src/main.jsx (in place of <App />).
 *   2. Run `npm run dev` and review.
 *   3. Revert main.jsx before committing — this file can stay in the
 *      repo permanently as a reusable QA harness, but it should never
 *      be part of the shipped render tree.
 */
function TokenPreview() {
  const colors = [
    { name: '--color-black', var: 'var(--color-black)' },
    { name: '--color-ivory', var: 'var(--color-ivory)' },
    { name: '--color-gold', var: 'var(--color-gold)' },
    { name: '--color-white', var: 'var(--color-white)' },
    { name: '--color-muted', var: 'var(--color-muted)' },
    { name: '--color-ink', var: 'var(--color-ink)' },
    { name: '--color-ink-muted', var: 'var(--color-ink-muted)' },
  ]

  const typeRoles = [
    { name: 'Cover Title', sizeVar: '--fs-cover-title', font: 'var(--font-display)', sample: 'Happy Birthday' },
    { name: 'Chapter Title', sizeVar: '--fs-chapter-title', font: 'var(--font-display)', sample: 'The Beginning' },
    { name: 'Editorial Label', sizeVar: '--fs-editorial-label', font: 'var(--font-sans)', sample: 'CHAPTER ONE — THE BEGINNING' },
    { name: 'Subtitle / Deck', sizeVar: '--fs-subtitle', font: 'var(--font-display)', sample: 'A love letter, told in six chapters.', italic: true },
    { name: 'Body — Story', sizeVar: '--fs-body-story', font: 'var(--font-sans)', sample: 'ISSUE 08 — 29' },
    { name: 'Body — Letter', sizeVar: '--fs-body-letter', font: 'var(--font-display)', sample: 'My dearest, there are so many things I have wanted to tell you.' },
    { name: 'Caption', sizeVar: '--fs-caption', font: 'var(--font-sans)', sample: 'Photographed, somewhere we both remember.' },
    { name: 'Nav / UI', sizeVar: '--fs-nav', font: 'var(--font-sans)', sample: 'CHAPTER 03' },
  ]

  const spacingTokens = [
    '--space-1',
    '--space-2',
    '--space-3',
    '--space-4',
    '--space-5',
    '--space-6',
    '--space-7',
    '--space-8',
  ]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.kicker}>MILESTONE 2 QA HARNESS</span>
        <h1 className={styles.title}>Design Token Preview</h1>
        <p className={styles.subtitle}>
          Not part of the production render tree — see the comment at the
          top of this file for how to mount it temporarily.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Color Palette (Sec. 2)</h2>
        <div className={styles.colorGrid}>
          {colors.map((color) => (
            <div key={color.name} className={styles.colorCard}>
              <div
                className={styles.swatch}
                style={{ backgroundColor: color.var }}
              />
              <span className={styles.colorLabel}>{color.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Type Scale (Sec. 3.2)</h2>
        <div className={styles.typeLadder}>
          {typeRoles.map((role) => (
            <div key={role.name} className={styles.typeRow}>
              <span className={styles.typeMeta}>
                {role.name} — {role.sizeVar}
              </span>
              <p
                className={styles.typeSample}
                style={{
                  fontFamily: role.font,
                  fontSize: `var(${role.sizeVar})`,
                  fontStyle: role.italic ? 'italic' : 'normal',
                }}
              >
                {role.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Spacing Scale (Sec. 4.2)</h2>
        <div className={styles.spacingRuler}>
          {spacingTokens.map((token) => (
            <div key={token} className={styles.spacingRow}>
              <span className={styles.spacingLabel}>{token}</span>
              <div
                className={styles.spacingBar}
                style={{ width: `var(${token})` }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TokenPreview
