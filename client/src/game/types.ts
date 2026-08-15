/**
 * Arcana Match design contract: ceremonial Art Nouveau tarot with clear, tactile play states.
 */

export type ArcanaName =
  | "Moon"
  | "Sun"
  | "Star"
  | "Tower"
  | "Eye"
  | "Key"
  | "Rose"
  | "Serpent";

export type GamePhase = "ready" | "one-selected" | "resolving" | "complete";

export type ArcanaSymbol = {
  name: ArcanaName;
  flavor: string;
  artX: string;
  artY: string;
};

export type GameCard = {
  id: string;
  symbol: ArcanaSymbol;
  isFaceUp: boolean;
  isMatched: boolean;
  isMismatch: boolean;
};

export type GameSnapshot = {
  cards: GameCard[];
  moves: number;
  matchedPairs: number;
  phase: GamePhase;
  roundId: number;
};

export const ARCANA: ArcanaSymbol[] = [
  { name: "Moon", flavor: "The moon remembers", artX: "0%", artY: "0%" },
  { name: "Sun", flavor: "The sun reveals", artX: "33.333%", artY: "0%" },
  { name: "Star", flavor: "The star guides", artX: "66.666%", artY: "0%" },
  { name: "Tower", flavor: "The tower endures", artX: "100%", artY: "0%" },
  { name: "Eye", flavor: "The eye observes", artX: "0%", artY: "100%" },
  { name: "Key", flavor: "The key opens", artX: "33.333%", artY: "100%" },
  { name: "Rose", flavor: "The rose persists", artX: "66.666%", artY: "100%" },
  { name: "Serpent", flavor: "The serpent returns", artX: "100%", artY: "100%" },
];
