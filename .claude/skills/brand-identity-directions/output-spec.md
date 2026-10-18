# Output Spec — two HTML artifacts

The skill produces two self-contained HTML files at different phases:

1. **`brand-directions.html`** — the 3-up comparison page (Phase 3). Disposable;
   how the user picks.
2. **`product-identity.html`** — the final identity document for the chosen
   direction (Phase 5), named after the product (e.g. `pact.html`). The
   deliverable.

Both are self-contained (only external request allowed: the Google Fonts `<link>`;
user-supplied fonts base64-embedded).

---

## Comparison page — `brand-directions.html`

One page, three directions rendered full-fidelity for side-by-side comparison. The
user looks at it in the browser and states their pick in chat.

### Global rules

- Each direction is fully **self-scoped** — its own CSS custom properties, fonts,
  and shape language. Two directions must never share a palette or typeface. Scope
  each direction's tokens under a wrapper class (e.g. `.dir-a`, `.dir-b`, `.dir-c`)
  so their `:root`-style variables don't collide.
- Layout: three columns side by side on wide screens (min ~360px each), stacking to
  one column under 1000px. A sticky top strip labels A / B / C by concept name.
- A thin neutral page chrome (its own, not any direction's) frames the three so
  none of them "wins" the page by default.
- Every example uses THE USER'S domain content — their product name, actions, data.
  No lorem ipsum, no Acme.

### Each direction panel contains, top to bottom

1. **Header** — the concept name ("A · Warm Signal") + its one-line description.
2. **Wordmark** — the brand name set in the direction's display font/weight, on the
   direction's paper color.
3. **Color** — swatch row (chip, two-word name, hex) for the 6–8 tokens.
4. **Type specimen** — display line + a body paragraph (a real sentence from their
   domain) in the direction's fonts, with px/weight labels.
5. **Components** — primary + secondary button, one input, and one domain card
   (with their content), all in the direction's tokens and radius.
6. **In use** — one small product-flavored moment (a promo tile or a list row set)
   that shows the direction living.
7. **Safe / Risk note** — two short lines: what's safe here, what's the one risk
   and what it buys (see `design-mapping.md` → "Safe / Risk note").

### Before showing

Run the self-gate on each direction ("would a designer be embarrassed?"). Reject
and regenerate any that trips an anti-slop trigger. Verify in a browser/screenshot
that fonts load and nothing overflows, then open it (SendUserFile, `display:
"render"`, or `open`).

---

## Final identity document — `product-identity.html`

Built for the chosen direction only, after the pick. Modeled on the Altana Network
product identity document. Save named after the product unless the user says
otherwise.

### Global rules

- All colors as CSS custom properties in `:root` (`--primary`, `--accent`,
  `--ink`, `--neutral`, `--paper`, tints), plus `--font` and weight variables. The
  whole doc must be re-themeable by editing `:root`.
- Max content width ~1180px, centered `.wrap` with 40px side padding (22px mobile).
- Sections numbered with an eyebrow label + horizontal rule head: `01 — Logo`,
  `02 — Color`, …
- Every example uses THE USER'S domain content — no lorem ipsum, no Acme.
- One `@media (max-width: 900px)` block collapsing grids to single column.
- Corner radius, density, weights, spacing: all derived from the chosen direction —
  do not default to Altana's values.

### Sections, in order

1. **Top bar** — dark strip: brand name + "Brand System · [Font]" left, "Brand Kit
   v0 — [year]" right.
2. **Header** — wordmark left (brand name in display font/weight), "Brand
   Guidelines v0" right.
3. **Hero** — kicker ("Brand Identity System"), brand name as huge display type
   (~104px), one-sentence description of the identity's intent (from the memorable
   thing + concept), and color chip strip.
4. **01 — Logo** — a *typographic wordmark*: brand name set in the display font on
   light and dark grounds. Include a sizes row and a clear-space/usage note. State
   plainly it's a starter wordmark, not a designed logo.
5. **02 — Color** — swatch grid (chip, name, hex); usage-ratio bar with
   explanation; **real computed contrast ratios** for the main text/background
   pairs; 3–4 color don'ts specific to this palette.
6. **03 — Typography** — typeface name + designer + "Google Fonts" (or "custom,
   embedded"); specimen table (Display / H2 / H3 / Body with px + weight) using
   sentences from their domain; character set card; weight ladder card with one
   line on when each weight is used.
7. **04 — Components** — buttons (primary / secondary / accent / link / disabled),
   tags & status badges, form input + search, and one domain card (entity/product/
   listing — whatever fits their product) with 2–3 stats.
8. **05 — Spacing & Grid** — spacing scale (2xs→3xl, 4–64px bars) and a 12-column
   grid demo with gutter/margin/max-width/breakpoints.
9. **06 — Voice & Tone** — three trait columns (traits from discovery + the chosen
   direction). Each: trait name, one-line meaning, one DO quote and one DON'T quote
   written for their audience. DON'T styling is neutral, not red.
10. **07 — In Use** — split panel: left a dark promo tile (wordmark, big headline
    with one accent-colored word, CTA button); right a small product-flavored mock
    (list rows with scores/badges, or whatever matches their domain).
11. **Footer** — wordmark left; "Brand Guidelines v0 · © [year] [Name] · Typeface:
    [Font]" right.

### Delivery

- Verify in a browser or screenshot before sending — check font loads, grids don't
  overflow, dark sections keep readable text.
- Send with SendUserFile (render) plus 2–3 sentences: what the file contains and
  how to reuse the `:root` tokens.
- Offer (don't start) next steps: real logo, favicon/app icon set, full brand
  strategy (purpose, archetype, personas, messaging).
