# Design Mapping — discovery & moodboard → three directions

The skill's job between "what the user told me" and "three rendered directions."
Read the section that matches the step you're on.

## Moodboard → vibe profile

When the user drops images, extract a compact **vibe profile** and read it back to
them before generating concepts. Pull:

- **Palette + temperature** — the 3–5 dominant colors; is the whole thing warm
  (reds/ambers/creams), cool (blues/greens/grays), or neutral? Note any single
  hot accent that recurs.
- **Saturation & contrast** — muted/desaturated vs. vivid; soft low-contrast vs.
  stark ink-on-paper.
- **Texture / materiality** — flat and digital, or grain/paper/print/photographic?
- **Shape language** — rounded vs. sharp, geometric vs. organic, tight vs. airy.
- **Typographic feel** — serif / sans / mono; light-and-refined vs. heavy-and-loud;
  editorial vs. utilitarian (infer even from non-text images by mood).
- **Mood adjectives** — 3–5 words ("calm, precise, vintage, warm, hand-made").

**Read it back and let them correct it.** Your extraction is approximate; a wrong
read poisons every downstream choice. *"Here's what I'm getting: … Right?"*

**Conflicting images:** do NOT average. Name the tension and choose a through-line
(usually the mood that recurs most, or the one closest to the memorable thing),
and offer the other as one of the three directions if it's viable.

If there's no moodboard, build the vibe profile from discovery answers + the
memorable thing instead.

## Deriving three distinct concepts

Produce three directions that feel like three different design teams. Each gets a
two-word name, a one-line description, and — internally — a distinct **aesthetic
direction**, font family, color temperature, and shape rhythm.

**How to spread them (pick the spread that fits what you learned):**
- One built **from the moodboard/inspo** (their comfort zone), one deliberately
  **unlike the named competitors** (differentiation), one **wildcard** that still
  serves the memorable thing.
- Or three different **aesthetic directions** from the library below that could
  each plausibly fit the product.

Every direction must still serve the memorable thing — differently. Anti-slop and
the blacklists below apply to all three.

**Convergence test:** if the wordmark could be swapped between two directions
without anyone noticing, they're too close — redo one with a different font
class, a different color temperature, and a different corner/shape language.

### Aesthetic direction library

Pick directions that fit the product; never all three from the same family.

- **Brutally minimal** — type and whitespace only, no decoration, modernist.
- **Editorial / magazine** — strong type hierarchy, serifs, asymmetric grids,
  pull quotes.
- **Industrial / utilitarian** — function-first, data-dense, monospace accents,
  muted palette.
- **Warm / humanist** — friendly sans, warm neutrals, comfortable spacing,
  approachable.
- **Luxury / refined** — high-contrast serifs, generous whitespace, restrained
  metallics.
- **Organic / natural** — earth tones, rounded forms, grain and hand-drawn
  texture.
- **Playful / toy-like** — rounded, bold primaries, bouncy, approachable and fun.
- **Retro-futuristic** — vintage-tech nostalgia, CRT glow, warm monospace.
- **Art deco / geometric** — precision, symmetry, metallic accents, decorative
  borders.
- **Technical / precise** — grid-locked, tabular numerals, restrained accent,
  engineered feel.

## Safe / Risk note (per direction)

Coherence is table stakes — every product in a category can be coherent and still
look identical. State, in plain language, per direction:

- **Safe:** the 1–2 choices that match category convention (what users expect,
  keeps you literate in your space).
- **Risk:** the 1 deliberate departure that gives this direction its own face —
  what it is, and in a clause, what you gain by it.

Example: *"Safe: neutral grays and a readable humanist body. Risk: the streak
numbers are set in a serif at display size — unusual for a habit app, makes
progress feel like a milestone, not a metric."*

## Anti-slop — never emit

Reject any direction (self-gate before showing) that uses:

- purple/violet gradient as the default accent
- a 3-column feature grid with icons in colored circles
- centered-everything with uniform spacing
- uniform bubbly border-radius on all elements
- gradient buttons as the primary CTA
- generic stock-photo-style hero
- `system-ui` / `-apple-system` as the display or body font ("I gave up on
  typography")
- "Built for X" / "Designed for Y" copy patterns

## Palette recipe

Build 6–8 tokens per direction, no more:

1. **Primary** — from the moodboard/inspo if given (adjust saturation to the vibe:
   muted vs. vivid); else pick a hue from the concept (blue=trust/tech,
   green=growth/nature, violet=creative/premium — but avoid the purple-gradient
   trap — red-orange=energy, ink-only=luxury/editorial).
2. **Accent (1, max 2)** — complementary or adjacent to primary; a second accent
   only for the more expressive directions.
3. **Ink** — near-black text color (#0A0A0A–#302D2A; warm or cool per the
   direction's temperature).
4. **Neutral surface** — light gray/beige (temperature per direction).
5. **Paper** — #FFFFFF or a warm off-white for warmer/expensive directions.
6. **Tints** — one light tint per primary/accent for backgrounds.
7. Optional **semantic** (critical/success) only if the product is a
   tool/dashboard.

Give every color a memorable two-word-max name ("Signal Yellow", "Fog") and state
a usage ratio (e.g. primary : accent ≈ 6 : 1).

**Contrast rule:** compute WCAG ratios with a script (quick node/python snippet).
Body text ≥ 4.5:1, large display ≥ 3:1. Adjust lightness until true; publish the
real numbers in the final doc.

## Fonts

Prefer ONE family per direction, weights 400/500/600 (700–800 only for the strong
/ industrial directions). Body text is never bold. Load from Google Fonts via
`<link>` with only the weights used; user-supplied files → base64 `@font-face`
data URIs so the HTML is standalone.

| Direction lean | Families |
|---|---|
| Warm / humanist | Work Sans, Karla, Alegreya Sans, Manrope, DM Sans |
| Established / authoritative | IBM Plex Sans, Archivo, Source Sans 3 |
| Luxury / refined / editorial | Fraunces, Newsreader, Source Serif 4, Cormorant Garamond, Libre Caslon Text |
| Playful | Nunito, Quicksand, Baloo 2 |
| Technical / industrial | IBM Plex Mono, JetBrains Mono (accents), Barlow, Archivo |
| Retro / characterful | Bricolage Grotesque, Syne, Unbounded, Instrument Serif |

Pairing (only when a direction leans both refined AND contemporary): serif display
+ sans body (e.g. Fraunces + Work Sans). Add a mono only for developer-facing
products.

### Font blacklist — never recommend

Papyrus, Comic Sans, Lobster, Impact, Jokerman, Bradley Hand, Brush Script, Hobo,
Trajan, Raleway, Clash Display, Courier New (for body).

### Overused fonts — never as primary unless the user names them

Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Montserrat, Poppins,
**Space Grotesk**. Space Grotesk is on this list specifically because every AI
design tool converges on it as "the safe alternative to Inter." Treat it the same
as Inter: only if the user asks for it by name.

## Coherence validation

When the user overrides one choice, check the rest still coheres and nudge gently
— never block, always accept the final choice. E.g. "Brutally minimal aesthetic +
expressive motion is unusual — fine if intentional. Want motion that fits, or
keep it?"

## Optional: personality vocabulary (fallback)

If you need finer language to describe a direction, these axes map feeling to
decisions. Use as vocabulary, not a questionnaire — the skill no longer asks
sliders.

| Axis (− ↔ +) | Controls | − end | + end |
|---|---|---|---|
| Simple ↔ Complex | palette size, density | 1 accent, whitespace, flat | 2–3 accents, dense, layered |
| Subtle ↔ Bright | saturation | muted, tints for emphasis | high-chroma, solid fills |
| Classic ↔ Contemporary | serif vs sans, spacing | serif display, book spacing | tight sans, airy negative space |
| Friendly ↔ Authoritative | corner radius, voice | rounded 8–12px, warm copy | square 0–4px, declarative copy |
| Playful ↔ Serious | accent usage | accent in UI moments | accents rationed, measured |
| Industrial ↔ Natural | neutral temperature | cool grays, mono, hard edges | warm beiges/greens, organic |
| Casual ↔ Elegant | tracking, display style | normal tracking, chunky UI | negative tracking, refined |
| Refined ↔ Strong | display weight | 400–500, hairline rules | 700–800, thick bars |
