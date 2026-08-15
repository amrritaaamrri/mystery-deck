# Arcana Match — Design Exploration

## Three Directions

### The Gilded Reliquary
**Very Brief Intro:** A ceremonial tabletop game rendered as a small antique object: wine-dark velvet, burnished metal, engraved paper, and careful Art Nouveau linework. The feeling is hushed, tactile, and deliberate rather than gothic horror.

**Probability:** 0.07

### Lanterns on the Conservatory Floor
**Very Brief Intro:** A pale, botanical salon with verdigris, vellum, glass, and soft morning light. It would make the matching ritual feel fresh and scholarly.

**Probability:** 0.04

### The Astral Printer’s Workshop
**Very Brief Intro:** A high-contrast indigo print studio where celestial symbols appear as overprinted inks, registration marks, and metallic foil. It would feel graphic, collectible, and contemporary.

**Probability:** 0.09

## Chosen Direction: The Gilded Reliquary

### Design Movement

This game uses **late Art Nouveau bookbinding and esoteric ephemera** as its primary visual language. The interface should feel like a finely made tarot deck laid out inside a private reading room, not a generic fantasy dashboard.

### Core Principles

1. **Ritual over spectacle.** Every interaction is quiet and intentional: a card turn has weight, a match settles with a controlled gold glint, and the win state feels like a completed reading.
2. **Tactile material truth.** Velvet has directional grain, card edges cast restrained shadows, foil accents vary in brightness, and parchment carries a faint tooth.
3. **Ornament earns its place.** Filigree frames, starbursts, and hairline dividers guide attention and reinforce the deck motif without overwhelming the game board.
4. **Rules stay legible.** Gameplay counters, card state, and restart action remain immediately readable in a low-light palette.

### Color Philosophy

The background is deep **oxblood velvet** to make the board feel intimate and to let ivory faces emerge cleanly. **Antique gold** is the ownable accent: it signals discovery, creates the shimmer behavior, and connects every interactive surface. **Parchment ivory** carries face-up icons for high contrast, while ink-black supplies line-art definition. The palette uses warmth and patina rather than magical neon.

### Layout Paradigm

The game is a **reading-table composition**, not a centered dashboard. The board holds the visual center as the object of focus; the title and emblem sit as an upper-left bookplate, while move and pair counters align as a small, upper-right ledger. A narrow lower action rail grounds the reset control. On small screens, the ledger moves beneath the bookplate but the card spread remains the dominant element.

### Signature Elements

1. A **crescent-and-eight-point-star crest** appears in the brand mark, card back, matched-pair sparkle, and completion seal.
2. A **double-gilt frame** with tiny corner stars defines every card and actionable control.
3. A **velvet grain and damask whisper** sit behind the board, offset by sparse gold dust on successful turns.

### Interaction Philosophy

Clicks should behave like physical handling: cards depress slightly before they turn, unmatched cards pause long enough to be remembered and then fold closed, and matched cards remain visible as a collected spread. Keyboard users get the same order and clear focus treatment, never a hidden interaction.

### Animation

Card turns use a 520ms three-dimensional rotateY transition with a firm custom ease-out. Gold shimmer is a narrow moving highlight that occurs only at the end of the turn and on matches. An incorrect pair uses a quiet 120ms horizontal nudge before the delayed return, while a correct pair earns one restrained starburst. Ambient velvet grain may drift imperceptibly only when reduced-motion is not requested; no continuously glowing UI.

### Typography System

**Cormorant Garamond** is the display serif for the title and numerals; it gives the label a bookish, engraved character. **DM Mono** is the small ledger face for counters, labels, and controls, preserving clarity at compact sizes. Headlines use uppercase with generous tracking; body and instructions use sentence case. The card faces carry symbols rather than textual labels.

### Brand Essence

**Arcana Match is a tactile tarot memory ritual for players who want a focused, elegant challenge rather than a noisy casual game.** Its personality is **ceremonial, meticulous, and quietly luminous**.

### Brand Voice

Headlines are concise and a little ceremonial; CTAs sound like actions in a reading rather than generic app prompts. Microcopy gives practical feedback with measured warmth.

> “Turn the hidden arcana.”

> “The constellation is complete.”

### Wordmark & Logo

The wordmark uses an extended, tracked serif title with a small gold crescent-and-star crest set like a publisher’s colophon. The logo is the crest alone: a crescent holding an eight-point star within a slender botanical arch.

### Signature Brand Color

**Reliquary Gold — #C9A45B**

## Style Decisions

- Use the card spread as the page’s dominant reading surface; avoid a generic centered app-shell card.
- Maintain deep oxblood, antique gold, parchment ivory, and ink-black as the only primary colors.
- Keep rounded corners small and structural; no large pill UI.
- Use high-contrast text and an always-visible keyboard focus ring.
- The crescent-and-star crest is a small colophon, card-back emblem, match sparkle, or completion seal; it must never become a dominant full-page image.
- Oxblood velvet is the default page atmosphere, while parchment ivory is reserved for cards and small reading surfaces, never the main background field.
- Card faces are symbol-first; visible prose stays in ritual feedback and accessibility labels rather than functioning as the card face’s primary content.
