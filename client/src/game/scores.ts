/**
 * Mystery Deck persistence contract: personal records are local, optional,
 * and ranked first by moves, then by completion time.
 */

import type { BestScore, BestScoreMap, DifficultyId } from "./types";

const STORAGE_KEY = "mystery-deck:best-scores:v1";

function isScore(value: unknown): value is BestScore {
  if (!value || typeof value !== "object") return false;
  const score = value as Record<string, unknown>;
  return (
    typeof score.moves === "number" &&
    typeof score.seconds === "number" &&
    typeof score.completedAt === "string"
  );
}

export function loadBestScores(): BestScoreMap {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [DifficultyId, BestScore] => isScore(entry[1])),
    ) as BestScoreMap;
  } catch {
    return {};
  }
}

export function isBetterScore(candidate: BestScore, current?: BestScore) {
  if (!current) return true;
  return candidate.moves < current.moves || (candidate.moves === current.moves && candidate.seconds < current.seconds);
}

export function saveBestScore(difficultyId: DifficultyId, candidate: BestScore) {
  const scores = loadBestScores();
  const isNewRecord = isBetterScore(candidate, scores[difficultyId]);
  if (!isNewRecord) return { scores, isNewRecord };

  const nextScores = { ...scores, [difficultyId]: candidate };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextScores));
  } catch {
    // Storage may be unavailable in a privacy-restricted browser. The round still completes normally.
  }
  return { scores: nextScores, isNewRecord };
}
