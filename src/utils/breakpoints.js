// Breakpoint constants — must stay numerically identical to the
// --breakpoint-* custom properties in styles/tokens.css. CSS custom
// properties can't be read inside @media conditions, so JS-driven
// responsive logic (e.g. conditionally mounting a lighter R3F scene
// in Milestone 9) reads from here instead of duplicating magic numbers.
//
// Source of truth: design-blueprint.md Sec. 4.1 / Sec. 10.

export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1440,
}

export const GRID = {
  desktop: { columns: 12, margin: 80, gutter: 24, maxWidth: 1440 },
  tablet: { columns: 8, margin: 48, gutter: 20 },
  mobile: { columns: 4, margin: 24, gutter: 16 },
}
