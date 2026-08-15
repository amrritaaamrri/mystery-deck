# Mystery Deck

**Mystery Deck** is a browser-based tarot memory game. Players turn two ornate cards at a time, discover matching pairs before the sandglass empties, and try to improve their personal record for each challenge tier.

## Play modes

| Reading | Board | Countdown | Intended challenge |
|---|---:|---:|---|
| Initiate | 4 pairs | 1:30 | Learn the symbols and the match rhythm. |
| Seeker | 6 pairs | 2:00 | Balance quick recall with a larger spread. |
| Oracle | 8 pairs | 2:30 | Clear the complete tarot deck efficiently. |

The game keeps the best result for every reading in browser local storage. A score is ranked by fewer moves first, then by a faster completion time.

## Run locally

Install dependencies and start the development server with the following commands.

```bash
pnpm install
pnpm dev
```

Run a type check with `pnpm check` and build the production version with `pnpm build`.

## Project map

The primary game files are listed below. The complete guided walk-through is available in [CODE_GUIDE.md](./CODE_GUIDE.md).

| Location | Purpose |
|---|---|
| `client/src/components/GameCanvas.tsx` | Main game screen, controls, countdown wiring, accessible status updates, and completion panels. |
| `client/src/game/memoryGame.ts` | Matching rules, deck generation, turn-locking, timeout state, restart behavior, and demo mode. |
| `client/src/game/types.ts` | Difficulty catalogue and shared card, game-state, and personal-record types. |
| `client/src/game/sound.ts` | Browser-native flip, match, and completion soundscape. |
| `client/src/game/scores.ts` | Local-storage loading, comparison, and saving of personal records. |
| `client/src/game/scene.ts` | Babylon.js velvet-table ambience and animated gold motes. |
| `client/src/index.css` | Responsive visual system, tarot-card flip treatment, and gilded control styles. |

## Accessibility and controls

Cards are native buttons with readable labels and visible keyboard focus. The game honors reduced-motion preferences. Sound remains user-controlled through the header control and is only generated after an interaction, so the page does not force audio on a visitor.

## License

This project is released under the MIT license declared in `package.json`.
