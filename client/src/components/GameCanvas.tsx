/**
 * Arcana Match design contract: a Gilded Reliquary reading-table composition with a dominant card spread.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import {
  Castle,
  Eye,
  Flower2,
  KeyRound,
  Moon,
  Orbit,
  Sparkles,
  Star,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { MemoryGame } from "@/game/memoryGame";
import { createGameScene, type GameHandle } from "@/game/scene";
import type { ArcanaName, ArcanaSymbol, GameSnapshot } from "@/game/types";

const LOGO_URL = "/manus-storage/arcana-logo_f857af6e.png";
const CARD_BACK_URL = "/manus-storage/arcana-tarot-back_d280492e.png";
const CARD_FACES_URL = "/manus-storage/arcana-tarot-faces_4425e662.png";

const iconByArcana: Record<ArcanaName, LucideIcon> = {
  Moon,
  Sun,
  Star,
  Tower: Castle,
  Eye,
  Key: KeyRound,
  Rose: Flower2,
  Serpent: Orbit,
};

function statusMessage(snapshot: GameSnapshot) {
  if (snapshot.phase === "complete") return `The constellation is complete in ${snapshot.moves} moves.`;
  if (snapshot.phase === "resolving") return "The arcana do not answer together.";
  if (snapshot.phase === "one-selected") return "One card is listening. Turn another.";
  if (snapshot.matchedPairs > 0) return `${snapshot.matchedPairs} pairs have joined the reading.`;
  return "Turn two hidden arcana to begin the reading.";
}

function CardFace({ symbol }: { symbol: ArcanaSymbol }) {
  const Icon = iconByArcana[symbol.name];
  const artPosition = {
    "--art-x": symbol.artX,
    "--art-y": symbol.artY,
    backgroundImage: `linear-gradient(rgba(250, 241, 215, 0.78), rgba(250, 241, 215, 0.9)), url(${CARD_FACES_URL})`,
  } as CSSProperties;

  return (
    <div className="tarot-card__surface tarot-card__front" style={artPosition}>
      <span className="tarot-card__corner tarot-card__corner--top">✦</span>
      <span className="tarot-card__frame" aria-hidden="true" />
      <span className="tarot-card__medallion" aria-hidden="true">
        <Icon strokeWidth={1.25} />
      </span>
      <span className="tarot-card__corner tarot-card__corner--bottom">✦</span>
    </div>
  );
}

function TarotCard({
  card,
  onSelect,
  isBlocked,
}: {
  card: GameSnapshot["cards"][number];
  onSelect: () => void;
  isBlocked: boolean;
}) {
  const visible = card.isFaceUp || card.isMatched;
  const disabled = isBlocked || card.isMatched || card.isFaceUp;
  const stateClass = [
    visible ? "is-flipped" : "",
    card.isMatched ? "is-matched" : "",
    card.isMismatch ? "is-mismatch" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={`tarot-card ${stateClass}`}
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-label={visible ? `${card.symbol.name}, revealed tarot card` : "Face-down tarot card"}
    >
      <span className="tarot-card__inner">
        <span
          className="tarot-card__surface tarot-card__back"
          style={{ backgroundImage: `url(${CARD_BACK_URL})` }}
          aria-hidden="true"
        >
          <span className="tarot-card__back-seal">✦</span>
        </span>
        <CardFace symbol={card.symbol} />
      </span>
    </button>
  );
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);
  const isDemoRef = useRef(new URLSearchParams(window.location.search).has("demo"));
  const gameRef = useRef<MemoryGame | null>(null);
  if (!gameRef.current) {
    gameRef.current = new MemoryGame(undefined, isDemoRef.current ? 143 : undefined);
  }
  const game = gameRef.current;
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => game.getSnapshot());

  useEffect(() => {
    game.setListener(setSnapshot);
    return () => game.setListener(() => undefined);
  }, [game]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || startedRef.current) return;
    startedRef.current = true;

    const engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      adaptToDeviceRatio: true,
    });
    let handle: GameHandle | null = null;
    let cancelled = false;

    createGameScene(engine, canvas)
      .then((sceneHandle) => {
        if (cancelled) {
          sceneHandle.dispose();
          return;
        }
        handle = sceneHandle;
        engine.runRenderLoop(() => sceneHandle.scene.render());
      })
      .catch((error) => console.error("Unable to create Arcana Match scene", error));

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      handle?.dispose();
      engine.dispose();
      startedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isDemoRef.current) return;
    const demoTimer = window.setInterval(() => game.advanceDemo(), 620);
    return () => window.clearInterval(demoTimer);
  }, [game]);

  useEffect(() => () => game.dispose(), [game]);

  const isBlocked = snapshot.phase === "resolving" || snapshot.phase === "complete";

  return (
    <main className="arcana-shell">
      <canvas ref={canvasRef} className="arcana-canvas" aria-hidden="true" />
      <div className="arcana-grain" aria-hidden="true" />

      <header className="arcana-header">
        <div className="brand-bookplate">
          <img src={LOGO_URL} alt="Arcana Match crescent and star emblem" className="brand-bookplate__crest" />
          <div>
            <p className="brand-bookplate__kicker">A memory reading in eight pairs</p>
            <h1>Arcana Match</h1>
          </div>
        </div>

        <div className="score-ledger" aria-label="Game progress">
          <div className="score-ledger__item">
            <span>Moves</span>
            <strong>{String(snapshot.moves).padStart(2, "0")}</strong>
          </div>
          <span className="score-ledger__separator" aria-hidden="true" />
          <div className="score-ledger__item">
            <span>Pairs</span>
            <strong>{String(snapshot.matchedPairs).padStart(2, "0")}<em>/08</em></strong>
          </div>
        </div>
      </header>

      <section className="game-reading" aria-label="Arcana Match game board">
        <div className="reading-rule reading-rule--top" aria-hidden="true"><span>✦</span></div>
        <div className="tarot-grid">
          {snapshot.cards.map((card) => (
            <TarotCard
              key={`${snapshot.roundId}-${card.id}`}
              card={card}
              onSelect={() => game.selectCard(card.id)}
              isBlocked={isBlocked}
            />
          ))}
        </div>
        <div className="reading-rule reading-rule--bottom" aria-hidden="true"><span>✦</span></div>
      </section>

      <section className="arcana-footer" aria-label="Game controls and guidance">
        <p className="turn-instruction" aria-live="polite">{statusMessage(snapshot)}</p>
        <button type="button" className="shuffle-button" onClick={() => game.restart()}>
          <Sparkles size={14} strokeWidth={1.7} aria-hidden="true" />
          Shuffle the deck
        </button>
      </section>

      {isDemoRef.current && <p className="demo-label">Demonstration reading</p>}

      {snapshot.phase === "complete" && (
        <div className="completion-scrim" role="status" aria-live="assertive">
          <section className="completion-card" aria-label="Reading complete">
            <img src={LOGO_URL} alt="" className="completion-card__crest" />
            <p className="completion-card__eyebrow">The constellation is complete</p>
            <h2>{snapshot.moves} moves</h2>
            <p>Every hidden arcana has found its twin. Begin another reading when you are ready.</p>
            <button type="button" className="completion-card__action" onClick={() => game.restart()}>
              Lay a new spread
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
