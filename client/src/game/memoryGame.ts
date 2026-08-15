/**
 * Mystery Deck game rules: deterministic turn resolution, variable decks,
 * and a timeout state that lock input without compromising a saved score.
 */

import {
  ARCANA,
  DIFFICULTIES,
  type DifficultyId,
  type GameCard,
  type GameEvent,
  type GameSnapshot,
} from "./types";

type SnapshotListener = (snapshot: GameSnapshot) => void;

function shuffle<T>(items: T[], random: () => number) {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

function createDeck(difficultyId: DifficultyId, random: () => number): GameCard[] {
  const difficulty = DIFFICULTIES[difficultyId];
  const chosenSymbols = shuffle(ARCANA, random).slice(0, difficulty.pairs);
  const cards = chosenSymbols.flatMap((symbol) =>
    [0, 1].map((copy) => ({
      id: `${symbol.name.toLowerCase()}-${copy}`,
      symbol,
      isFaceUp: false,
      isMatched: false,
      isMismatch: false,
    })),
  );

  return shuffle(cards, random);
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export class MemoryGame {
  private listener: SnapshotListener;
  private snapshot: GameSnapshot;
  private selectedIds: string[] = [];
  private resolveTimer: number | undefined;
  private turnToken = 0;
  private demoIndex = 0;

  constructor(listener?: SnapshotListener, difficultyId: DifficultyId = "oracle", seed?: number) {
    this.listener = listener ?? (() => undefined);
    this.snapshot = this.createSnapshot(difficultyId, 1, seed);
  }

  getSnapshot() {
    return this.snapshot;
  }

  setListener(listener: SnapshotListener) {
    this.listener = listener;
  }

  selectCard(cardId: string): GameEvent {
    if (this.snapshot.phase === "resolving" || this.snapshot.phase === "complete" || this.snapshot.phase === "timed-out") {
      return "ignored";
    }

    const card = this.snapshot.cards.find((candidate) => candidate.id === cardId);
    if (!card || card.isFaceUp || card.isMatched) return "ignored";

    card.isFaceUp = true;
    this.selectedIds = [...this.selectedIds, cardId];

    if (this.selectedIds.length === 1) {
      this.snapshot.phase = "one-selected";
      this.emit();
      return "flip";
    }

    const [firstId, secondId] = this.selectedIds;
    const first = this.snapshot.cards.find((candidate) => candidate.id === firstId)!;
    const second = this.snapshot.cards.find((candidate) => candidate.id === secondId)!;
    this.snapshot.moves += 1;

    if (first.symbol.name === second.symbol.name) {
      first.isMatched = true;
      second.isMatched = true;
      this.selectedIds = [];
      this.snapshot.matchedPairs += 1;
      this.snapshot.phase =
        this.snapshot.matchedPairs === this.snapshot.difficulty.pairs ? "complete" : "ready";
      this.emit();
      return this.snapshot.phase === "complete" ? "complete" : "match";
    }

    first.isMismatch = true;
    second.isMismatch = true;
    this.snapshot.phase = "resolving";
    const token = ++this.turnToken;
    this.emit();

    this.resolveTimer = window.setTimeout(() => {
      if (token !== this.turnToken) return;
      const activeCards = this.snapshot.cards.filter((candidate) => this.selectedIds.includes(candidate.id));
      activeCards.forEach((activeCard) => {
        activeCard.isFaceUp = false;
        activeCard.isMismatch = false;
      });
      this.selectedIds = [];
      this.snapshot.phase = "ready";
      this.emit();
    }, 950);

    return "flip";
  }

  expire() {
    if (this.snapshot.phase === "complete" || this.snapshot.phase === "timed-out") return false;
    this.turnToken += 1;
    if (this.resolveTimer !== undefined) window.clearTimeout(this.resolveTimer);
    this.snapshot.cards.forEach((card) => {
      if (!card.isMatched) {
        card.isFaceUp = false;
        card.isMismatch = false;
      }
    });
    this.selectedIds = [];
    this.snapshot.phase = "timed-out";
    this.emit();
    return true;
  }

  restart(difficultyId: DifficultyId = this.snapshot.difficulty.id, seed?: number) {
    this.turnToken += 1;
    if (this.resolveTimer !== undefined) window.clearTimeout(this.resolveTimer);
    this.selectedIds = [];
    this.demoIndex = 0;
    this.snapshot = this.createSnapshot(difficultyId, this.snapshot.roundId + 1, seed);
    this.emit();
  }

  advanceDemo() {
    if (this.snapshot.phase === "resolving") return;
    if (this.snapshot.phase === "complete" || this.snapshot.phase === "timed-out") {
      this.restart(this.snapshot.difficulty.id, 143 + this.snapshot.roundId);
      return;
    }

    const availableSymbols = Array.from(
      new Map(this.snapshot.cards.map((card) => [card.symbol.name, card.symbol])).values(),
    );
    const symbol = availableSymbols[this.demoIndex % availableSymbols.length];
    const pair = this.snapshot.cards.filter(
      (card) => card.symbol.name === symbol.name && !card.isMatched,
    );
    if (pair.length === 0) {
      this.demoIndex += 1;
      return;
    }

    const next = pair.find((card) => !card.isFaceUp);
    if (next) this.selectCard(next.id);
    if (pair.every((card) => card.isFaceUp || card.isMatched)) this.demoIndex += 1;
  }

  dispose() {
    this.turnToken += 1;
    if (this.resolveTimer !== undefined) window.clearTimeout(this.resolveTimer);
  }

  private createSnapshot(difficultyId: DifficultyId, roundId: number, seed?: number): GameSnapshot {
    const difficulty = DIFFICULTIES[difficultyId];
    return {
      cards: createDeck(difficultyId, seed === undefined ? Math.random : seededRandom(seed)),
      difficulty,
      moves: 0,
      matchedPairs: 0,
      phase: "ready",
      roundId,
    };
  }

  private emit() {
    this.listener({
      ...this.snapshot,
      cards: this.snapshot.cards.map((card) => ({ ...card })),
    });
  }
}
