---
name: brand-identity-directions
description: Use when someone wants to create a brand, brand kit, design system, visual identity, or product identity from scratch — "I need a brand", "help me brand my product", "pick colors and fonts for me", "make it look professional" — especially non-technical non-designers with no existing brand assets.
---

<!-- SKILL_VERSION: 1.0.0 — keep in sync with package.json on each release -->
**Skill version:** `1.0.0`

# Brand Identity — Show 3, Pick 1

## Overview

Interview-driven brand creation for people who are not designers, marketers, or
developers. You run a **short conversation** (five questions plus an optional
moodboard), propose **three genuinely distinct visual directions**, render them
**side by side in one browser page** so the user can *see* the difference, let
them **pick one**, then refine that pick into a single self-contained **product
identity** HTML document (logo/wordmark, color, typography, components, spacing,
voice & tone, in-use examples).

**Core principle: the user makes taste decisions by comparing finished options;
you make the design decisions that produce them.** Be a consultant, not a form.
Never ask design-jargon questions ("what hue? what border-radius?"). Ask about
their product and what they want remembered, then translate — every
recommendation carries a rationale.

This is product identity only. A full brand strategy (purpose, mission,
archetype, personas, messaging) is a future extension — do NOT expand into it
unless the user asks.

## When to Use

- User wants a brand / brand kit / design system / visual identity and has little
  or nothing yet
- User asks "what colors/fonts should I use?" for a product, app, or company
- NOT for refreshing an existing mature brand system (audit that instead), and
  NOT for logo illustration work (the wordmark is typographic only)

## Process

Run these five phases in order. Phase 2 (concept confirmation) and Phase 4 (the
pick) are gates — do not render or finalize past them without the user.

### 1. Discovery — 5 questions, ONE message at a time

Ask in plain language, conversationally (NOT AskUserQuestion — these are
open-ended). Wait for each answer before asking the next. Tell the user up front
this is a conversation, not a rigid form, and they can drop into chat anytime.

1. **What do you do?** (also capture the brand/product name — ask if not given)
2. **Who is it for?**
3. **Why should they care?** (what makes it different)
4. **Who are you competing with?** (names or "nobody direct" — used later to push
   the directions *away* from their look)
5. **The one memorable thing** — "What's the one thing you want someone to
   remember after they see this for the first time?" One sentence: a feeling, a
   visual, a claim, or a posture. Write it down. **Every later decision must
   serve this.** Design that tries to be memorable for everything is memorable
   for nothing.

If an answer is thin, ask ONE follow-up max, then move on. Non-designers stall
when over-interviewed.

**No perception sliders.** The three directions explore the personality space
visually instead of pinning it with a questionnaire.

### 2. Inspo & moodboard — invite, then read it back

Ask the user for any of: **a moodboard** (several images dragged into chat),
**brands / websites** they admire, or **colors** they like (names or hex).
Optional but strongly encouraged — a moodboard makes the directions far sharper.

If they give images, **read them and extract a vibe profile** (see
`design-mapping.md` → "Moodboard → vibe profile"): dominant palette + temperature,
saturation, contrast, texture/materiality, shape language, typographic feel, and
3–5 mood adjectives. **Show the user your read and let them correct it** before
generating concepts: *"Here's what I'm getting from your moodboard: warm,
editorial, a little vintage, ink-on-cream with one hot accent. Right?"*

If the moodboard images conflict, **name the tension** rather than averaging them
into mud: *"Two of these are warm and hand-made, one is cold and technical — I'll
treat warm-and-made as the through-line unless you'd rather chase the cold one."*

If no inspo/moodboard is given, proceed from discovery alone and derive the
directions from the answers.

### 3. Three concepts → render side by side

**3a. Name the three concepts in words first.** Derive three genuinely distinct
directions from discovery + vibe profile (see `design-mapping.md` →
"Deriving three distinct concepts"). Present as a lettered list, one line each:

```
A) "Quiet Ledger" — precise, restrained, monospace accents; numerals as hero
B) "Warm Signal"  — editorial warmth, a real serif, an ember accent
C) "Field Notes"  — soft, human, organic; grain and rounded forms
```

**Anti-convergence is a hard requirement:** the three MUST use different font
families, different color temperatures, and different shape/layout rhythms. If
someone could swap the wordmark between two of them without noticing, one failed
— regenerate it in a deliberately different direction. They should feel like they
came from three different design teams.

Get a quick confirm ("build those" / "swap C for something bolder"). Max 2 rounds
of concept revision — this is the cheap place to iterate, before rendering.

**3b. Build the comparison page.** Generate ONE self-contained
`brand-directions.html` with all three directions rendered full-fidelity, per
`output-spec.md` → "Comparison page". Each direction panel shows: wordmark, color
swatches (name + hex), a type specimen, a few real components (buttons, a card,
an input) using **the user's own domain content**, one in-use example, and a
plain-language **Safe / Risk note**.

**Self-gate before showing — hard gate.** For each direction ask: *"Would a
designer be embarrassed to put their name on this?"* If yes, discard and
regenerate. Triggers: purple/violet gradient hero, 3-column icon-in-circle grid,
centered-everything uniform spacing, Inter or Space Grotesk body text, bubble
radius on everything, gradient CTA button, generic stock-photo vibe, system-ui as
the display/body font. Any one = reject and redo that direction.

Open it in the user's browser (SendUserFile with `display: "render"`, or `open`).
Tell them: *"Three directions, side by side. Look them over and tell me which one
clicks — you can also mix ('B, but the accent from A')."*

### 4. The pick — chat is the chooser

The user states their pick in chat, with any remix notes. There are no
interactive buttons and no server — the page is for looking, the chat is for
deciding. Confirm you understood: *"Going with B — Warm Signal — and pulling A's
brighter accent into it. Right?"* before proceeding.

### 5. Refine & deliver the final identity doc

Refine the chosen direction conversationally (apply remix notes, adjust anything).
Then build the final `product-identity.html` (name it after the product, e.g.
`pact.html`) following `output-spec.md` → "Final identity document". Then:

- **Compute contrast ratios with a script — never guess.** Every text/background
  pair shown must be real WCAG ratios; fix any body-text pair under 4.5:1 before
  delivering.
- Fill component examples and voice do/don'ts with content from THEIR domain, not
  lorem ipsum.
- Render or screenshot to verify nothing is broken, then send it (SendUserFile,
  render).
- Close by telling them what they got and the natural next step (logo design,
  full brand strategy) without starting it.

## Quick Reference

| Input | How collected | Feeds |
|---|---|---|
| Discovery ×5 | open questions, one at a time | concepts, copy, voice, component content |
| Memorable thing | question 5 | the anchor every decision serves |
| Inspo / moodboard | images / brands / hexes | vibe profile → concepts, palette, type |
| The pick | chat, after the comparison page | which direction becomes the final doc |

**References:** `design-mapping.md` (moodboard→vibe, deriving 3 concepts, palette
recipe, font guidance, blacklists, anti-slop, safe/risk) · `output-spec.md`
(comparison page + final identity document structure)

## Common Mistakes

- **Asking all discovery questions in one message** → users answer one and ignore
  the rest. One at a time.
- **Three directions that look like siblings** → the convergence trap. Different
  fonts, temperatures, and rhythms, or it isn't three options.
- **Skipping the concept-confirm gate** → rendering three full directions the
  user could have redirected in one text line.
- **Averaging a conflicted moodboard** → muddy, characterless result. Name the
  tension and pick a through-line.
- **Defaulting to Inter or Space Grotesk** → every AI tool converges there. Never
  use as primary unless the user names it. See the overused list.
- **Guessing contrast ratios** → published numbers that are wrong. Compute them.
- **Generic filler content** ("Lorem ipsum", "Acme Corp") → the doc only clicks
  when the button says *their* action and the card shows *their* data.
- **Expanding into full brand strategy** (mission, archetype, personas) → product
  identity only; offer the rest as a follow-up.
