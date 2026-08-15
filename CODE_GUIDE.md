# Mystery Deck — Code Guide

This guide is a practical map for browsing Mystery Deck on GitHub. It describes the responsibility of each source file, the data it receives, and the behavior it produces. Every file named below will be committed with the project, so the full implementation can be read directly in the repository.

## Application flow

The application begins in `client/src/main.tsx`, which mounts `App.tsx`. `App.tsx` renders `GameCanvas.tsx`, the single immersive game screen. `GameCanvas.tsx` owns the browser-facing state: it subscribes to the rule engine, controls the countdown, plays sounds, shows difficulty controls, and persists a record after a completed reading.

```text
main.tsx → App.tsx → GameCanvas.tsx
                        ├─ MemoryGame: turns, matches, restart, timeout
                        ├─ types.ts: challenge tiers and shared state shapes
                        ├─ sound.ts: interaction-gated Web Audio cues
                        ├─ scores.ts: browser local-storage records
                        ├─ scene.ts: velvet background and gold motes
                        └─ index.css: responsive gilded visual system
```

## Source files

| File | Read this for | Main responsibilities |
|---|---|---|
| `client/src/components/GameCanvas.tsx` | The game interface | Renders the brand, difficulty selector, timer ledger, card grid, personal-record row, sound toggle, live status text, and finished-reading overlay. |
| `client/src/game/memoryGame.ts` | Game rules | Builds a shuffled deck, tracks selected cards, counts moves, resolves mismatches after a short lock, marks matches, creates a timeout, and exposes demo behavior. |
| `client/src/game/types.ts` | Game configuration | Defines the `Initiate`, `Seeker`, and `Oracle` settings, symbol catalogue, card shape, phase names, and saved-score types. |
| `client/src/game/sound.ts` | Sound effects | Uses the Web Audio API to synthesize quiet flip, match, and completion motifs locally; no sound file download is required. |
| `client/src/game/scores.ts` | Best-score storage | Reads and writes `mystery-deck:best-scores:v1`, validates stored values, and decides whether a newly completed round is better. |
| `client/src/game/scene.ts` | Background ambience | Creates the non-interactive Babylon.js backdrop: velvet depth, low light, and animated gold motes. |
| `client/src/index.css` | Visual design | Defines the oxblood, parchment, and gold palette; card flips; foil shimmer; responsive grid; ornate ledger controls; and reduced-motion fallbacks. |
| `client/index.html` | Document shell | Sets the browser title and loads the Cormorant Garamond and DM Mono typefaces. |

## Gameplay system

`MemoryGame` is intentionally independent from React. That separation keeps the rules testable and prevents visual rerenders from changing a move. `selectCard()` returns an event—`flip`, `match`, `complete`, or `ignored`—so `GameCanvas` can decide whether to play a sound while the controller retains authority over the actual cards and phase.

The round phase is one of `ready`, `one-selected`, `resolving`, `complete`, or `timed-out`. While resolving a mismatch, the controller temporarily blocks another selection. When the timer reaches zero, `GameCanvas` calls `expire()`, which safely ends the round and clears any unfinished selection.

## Difficulty configuration

All challenge tuning lives in the `DIFFICULTIES` object in `client/src/game/types.ts`. To add a mode, create a new difficulty object, add its key to `DifficultyId` and `DIFFICULTY_ORDER`, then provide its pair count, columns, and time limit. The controller automatically generates the matching number of pairs and the interface updates its grid, pair total, and countdown from the selected object.

## Sound system

`RitualSoundscape` creates an `AudioContext` only after the player performs a game interaction. The component maps game events to the sound groups as follows.

| Gameplay event | Sound group | Effect |
|---|---|---|
| A hidden card turns over | `flip` | Quiet two-note chime |
| A pair is confirmed | `match` | Gentle upward three-note figure |
| The final pair is confirmed | `complete` | Restrained four-note ending cadence |

The audio toggle only changes local component state; it does not write a profile or use an external service.

## Personal records

The `scores.ts` module stores one record per difficulty in the player’s browser. A record has `moves`, `seconds`, and `completedAt` fields. `isBetterScore()` ranks lower move counts first, then breaks a tie using fewer elapsed seconds. If local storage is disabled, the game still plays and completes normally; it simply cannot preserve a new record.

## Visual system

The DOM holds gameplay cards so they remain keyboard accessible, while Babylon.js renders only the decorative reading-table background. This split keeps the interaction model straightforward: the component can use native `<button>` cards with focus styles, and the scene can remain a low-cost ambient layer.

The visual contract in `client/src/index.css` has three materials: oxblood velvet for the surrounding room, parchment for revealed card faces, and Reliquary Gold for frames, separators, and highlights. The tarot cards flip using `transform: rotateY(180deg)` and use a short foil-sheen animation after reveal.

## Customization quick reference

| Desired change | Edit location |
|---|---|
| Change the title or title line | `client/src/components/GameCanvas.tsx` and `client/index.html` |
| Add, remove, or rebalance a difficulty | `client/src/game/types.ts` |
| Change matching or mismatch timings | `client/src/game/memoryGame.ts` |
| Alter the countdown behavior | `client/src/components/GameCanvas.tsx` |
| Tune tones or mute logic | `client/src/game/sound.ts` |
| Adjust the best-score rule or storage key | `client/src/game/scores.ts` |
| Change the tabletop, card, or control styling | `client/src/index.css` |
| Change the animated scene | `client/src/game/scene.ts` |
