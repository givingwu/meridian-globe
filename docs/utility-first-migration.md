# Utility-first migration

Component styles live in JSX `className`. `global.css` contains only font imports, Tailwind imports/theme tokens, breakpoint variants, the existing base reset, focus outlines and reduced-motion policy. There are no component selectors, `@apply` blocks or component stylesheet imports.

## Maintenance conventions

- Place layout, typography, state variants, gradients and backdrops on the element that owns them. Keep complete utility names in source so Tailwind can discover them.
- Reuse repeated markup through small React components such as `FactCard`. Avoid rebuilding the old global selector system in another CSS file or a large class-name registry.
- Use `aria-pressed` or `data-active` variants for control state. `data-ui` is an inspection hook, never a styling selector.
- Prettier's Tailwind plugin sorts classes with the project's CSS-first theme configuration.
- Keep non-overlapping `compact` (≤760 px), `tablet` (>760–1100 px) and `wide` (≥1550 px) variants. These preserve the original inclusive boundaries; substituting Tailwind's default breakpoints would change layout at the edges.
- Arbitrary pixel values preserve the existing design measurements. Arbitrary properties express exact gradients, shadows and transitions without adding component CSS. The WebGL shaders and animation logic are unchanged.

## Verification

Compared against pre-migration commit `87bf007`:

- All page elements and relevant pseudo-elements at widths 390, 760, 761, 1100, 1101, 1280, 1549, 1550 and 1600 px.
- Default, connections off, 2× selected, Explore hover, zoom hover, keyboard focus and modal states: no differences in the inspected computed style properties.
- Desktop (1280 px) and mobile (390 px) full-page screenshots, both default and modal: identical PNGs with reduced motion enabled and external fonts blocked equally for determinism. This is controlled regression evidence, not a claim of identical rasterization across browsers or fonts.
- 17 unit tests and 4 Chromium tests, including breakpoint boundaries, toggle pseudo-element placement, selected speed styling, dialog backdrop, focus behavior and route resource disposal.
- ESLint, Prettier and TypeScript/production build. Existing Three.js/data chunk-size warnings remain.
