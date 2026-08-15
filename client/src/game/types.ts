/**
 * Mystery Deck design contract: ceremonial Art Nouveau tarot with clear,
 * tactile play states and challenge tiers that remain easy to understand.
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

export type DifficultyId = "initiate" | "seeker" | "oracle";

export type Difficulty = {
  id: DifficultyId;
  label: string;
  pairs: number;
  columns: number;
  timeLimitSeconds: number;
  description: string;
};

export const DIFFICULTIES: Record<DifficultyId, Difficulty> = {
  initiate: {
    id: "initiate",
    label: "Initiate",
    pairs: 4,
    columns: 4,
    timeLimitSeconds: 90,
    description: "Four pairs · 1:30 sandglass",
  },
  seeker: {
    id: "seeker",
    label: "Seeker",
    pairs: 6,
    columns: 4,
    timeLimitSeconds: 120,
    description: "Six pairs · 2:00 sandglass",
  },
  oracle: {
    id: "oracle",
    label: "Oracle",
    pairs: 8,
    columns: 4,
    timeLimitSeconds: 150,
    description: "Eight pairs · 2:30 sandglass",
  },
};

export const DIFFICULTY_ORDER: DifficultyId[] = ["initiate", "seeker", "oracle"];

export type GamePhase =
  | "ready"
  | "one-selected"
  | "resolving"
  | "complete"
  | "timed-out";

export type GameEvent = "ignored" | "flip" | "match" | "complete";

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
  difficulty: Difficulty;
  moves: number;
  matchedPairs: number;
  phase: GamePhase;
  roundId: number;
};

export type BestScore = {
  moves: number;
  seconds: number;
  completedAt: string;
};

export type BestScoreMap = Partial<Record<DifficultyId, BestScore>>;

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
