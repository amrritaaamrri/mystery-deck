/**
 * Arcana Match design contract: keep the memory ritual reliable and separate from its gilded presentation.
 */

import { ARCANA, type GameCard, type GameSnapshot } from "./types";

type SnapshotListener = (snapshot: GameSnapshot) => void;

const PAIR_COUNT = ARCANA.length;

function createDeck(random: () => number): GameCard[] {
  const cards = ARCANA.flatMap((symbol) =>
    [0, 1].map((copy) => ({
      id: `${symbol.name.toLowerCase()}-${copy}`,
      symbol,
      isFaceUp: false,
      isMatched: false,
      isMismatch: false,
    })),
  );

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  return cards;
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

  constructor(listener?: SnapshotListener, seed?: number) {
    this.listener = listener ?? (() => undefined);
    this.snapshot = {
      cards: createDeck(seed === undefined ? Math.random : seededRandom(seed)),
      moves: 0,
      matchedPairs: 0,
      phase: "ready",
      roundId: 1,
    };
  }

  getSnapshot() {
    return this.snapshot;
  }

  setListener(listener: SnapshotListener) {
    this.listener = listener;
  }

  selectCard(cardId: string) {
    if (this.snapshot.phase === "resolving" || this.snapshot.phase === "complete") return;

    const card = this.snapshot.cards.find((candidate) => candidate.id === cardId);
    if (!card || card.isFaceUp || card.isMatched) return;

    card.isFaceUp = true;
    this.selectedIds = [...this.selectedIds, cardId];

    if (this.selectedIds.length === 1) {
      this.snapshot.phase = "one-selected";
      this.emit();
      return;
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
      this.snapshot.phase = this.snapshot.matchedPairs === PAIR_COUNT ? "complete" : "ready";
      this.emit();
      return;
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
  }

  restart(seed?: number) {
    this.turnToken += 1;
    if (this.resolveTimer !== undefined) window.clearTimeout(this.resolveTimer);
    this.selectedIds = [];
    this.demoIndex = 0;
    this.snapshot = {
      cards: createDeck(seed === undefined ? Math.random : seededRandom(seed)),
      moves: 0,
      matchedPairs: 0,
      phase: "ready",
      roundId: this.snapshot.roundId + 1,
    };
    this.emit();
  }

  advanceDemo() {
    if (this.snapshot.phase === "resolving") return;
    if (this.snapshot.phase === "complete") {
      this.restart(143 + this.snapshot.roundId);
      return;
    }

    const symbol = ARCANA[this.demoIndex % ARCANA.length];
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

  private emit() {
    this.listener({
      ...this.snapshot,
      cards: this.snapshot.cards.map((card) => ({ ...card })),
    });
  }
}
