# Game Plan: Arcana Match

## Risk Tasks

### 1. Flip, lockout, and mismatch timing
- **Why isolated:** Two quick selections and the delayed reset create an input-timing risk; without a strict turn state, players can select a third card or cause a mismatch to resolve after a restart.
- **Approach:** Use an explicit round state (`ready`, `one-selected`, `resolving`, `complete`) in the gameplay controller. Lock card input during resolving and token-check delayed callbacks against the current game round.
- **Verify:** A first click exposes one card; a second exposes exactly one additional card and increments moves by one; a mismatch remains visible briefly, ignores further clicks, then reliably returns both cards to face-down; restart during a mismatch does not alter the fresh board.

### 2. Card turn and shimmer presentation
- **Why isolated:** The card must preserve legible face/back art through 3D rotation without reverse-facing artifacts, while the foil highlight needs to be visible but not distracting.
- **Approach:** Use CSS-backed card elements with separate front and back surfaces, `backface-visibility: hidden`, and a state-driven shimmer pseudo-element. The game state stays independent from DOM animation.
- **Verify:** A card rotates cleanly in both directions, never renders mirrored art, honors reduced-motion preferences, and shows a brief gold shimmer on flip and match.

## Main Build

Build a responsive 4-by-4 memory board with eight distinct tarot symbols, a deterministic `?demo` cycle for visual proof, a moves counter, a pairs counter, a compact restart action, keyboard-accessible cards, an in-page completion panel, and generated visual assets framed by an oxblood velvet reading-table composition.

- **Assets needed:** A 16:9 in-game visual target, one vertical tarot-card back texture, one eight-card tarot face art sheet, and a transparent crescent-star emblem.
- **Verify:**
  - The board presents 16 cards in a clear 4-by-4 spread at desktop widths and a usable four-column spread at small phone widths.
  - A move increments only after two different unmatched cards are revealed.
  - A matching pair stays face up, increments pairs, and renders as collected; a mismatched pair returns to face down after its visible pause.
  - The completion panel appears only after all eight pairs match and reports the actual move count.
  - Restart creates a shuffled fresh round with counters reset to zero.
  - Cards respond to mouse, touch, and keyboard activation; focus is visible.
  - UI has no overflow or overlap, visual surfaces use generated art rather than placeholder assets, and no browser-console errors occur during capture.
  - Reference consistency: deep oxblood velvet, antique gold, parchment ivory, ornate Art Nouveau linework, upper bookplate/ledger framing, and a softly shimmering card flip.
  - **Presentation proof bundle:** WebDev screenshots of the standard game and deterministic `?demo` state demonstrate the playfield, card reveal, counters, and collected matched pair state.
