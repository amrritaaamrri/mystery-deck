# Mystery Deck — Challenge Systems

The game will offer three readings: **Initiate** has four pairs in a four-column spread and a ninety-second sandglass; **Seeker** has six pairs in a four-column spread and a one-hundred-and-twenty-second sandglass; **Oracle** has all eight pairs in a four-column spread and a one-hundred-and-fifty-second sandglass. Changing the reading immediately lays a fresh spread, preventing scores from leaking between difficulties.

Each round exposes its remaining time in seconds. When the sandglass is empty, new card selections are locked and the completion panel becomes a graceful timeout panel. A completed reading can earn a personal record. Records are stored in the browser under `the-gilded-deck:best-scores:v1`, indexed by difficulty. A record is better when it uses fewer moves; if moves tie, less elapsed time wins.

Audio is generated locally with the browser Web Audio API rather than downloaded media. The first interaction unlocks the audio context. A card flip uses a quiet, short two-note chime; a match uses a gentle three-note upward figure; completion uses a restrained four-note cadence. A visible mute control is always available and its setting persists for the session.

| Module | Responsibility |
|---|---|
| `client/src/game/types.ts` | Difficulty catalog, round state, card and score types |
| `client/src/game/memoryGame.ts` | Deck creation, turn rules, countdown status, outcomes |
| `client/src/game/sound.ts` | Interaction-gated Web Audio feedback |
| `client/src/game/scores.ts` | Safe local-storage reads, score comparison, record writes |
| `client/src/components/GameCanvas.tsx` | Difficulty controls, timer lifecycle, gameplay view, accessible feedback |
| `client/src/index.css` | Responsive reading-table layout and tier/control styles |
