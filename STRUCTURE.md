# Structure: Arcana Match

## Runtime

This is a small **React, CSS, and Babylon.js browser game**. React frames the playable DOM HUD and accessible card controls; Babylon.js owns a subtle animated velvet-table backdrop below it. The interaction model is two-dimensional and gains visual quality from generated deck art, material styling, CSS transitions, and the living canvas background.

## Ownership

| Module | Responsibility |
|---|---|
| `client/src/game/types.ts` | Defines immutable tarot symbol metadata, card state, and game-phase types. |
| `client/src/game/memoryGame.ts` | Owns shuffling, card selection rules, moves, pair count, lockout timing tokens, restart, and deterministic demo sequencing. It has no React imports. |
| `client/src/components/GameCanvas.tsx` | Owns the full-screen host, Babylon lifecycle, accessible game screen, and synchronizes the plain controller with React rendering. It renders visual card state and routes user intent into the controller. |
| `client/src/game/scene.ts` | Creates the Babylon scene, including the moving gold motes that give the velvet table a quiet living quality. |
| `client/src/index.css` | Owns global material treatment, responsive layout, card geometry, flip, shimmer, focus, and reduced-motion rules. |

## State Model

The game controller maintains a `GameSnapshot` containing a 16-card ordered deck, a selected-card ID list, `moves`, `matchedPairs`, `phase`, and a `roundId`. `phase` is one of `ready`, `one-selected`, `resolving`, or `complete`. React gets a new snapshot after every mutation and does not decide whether a match is valid.

## Asset Hints

| Asset | Runtime role | Intended size |
|---|---|---|
| Tarot back art | Cropped background on the face-down card surface. | 104 × 156 px desktop card surface; scales responsively. |
| Tarot face art sheet | Visual reference for the eight symbols; implementation retains crisp vector-like local line work for responsive individual faces. | 104 × 156 px per face-up card. |
| Crescent-star emblem | Brand mark in header and a completion seal. | 52 × 52 px header; 80 × 80 px completion seal. |
| In-game reference | Visual QA target only. | 1920 × 1080 px. |

## Input

Cards are semantic `button` elements. Pointer click and Enter/Space trigger the same `selectCard` action. Disabled card state applies while the controller is resolving or when a card is already matched/selected. Restart always begins a new round.
