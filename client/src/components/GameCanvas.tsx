/**
 * Mystery Deck design contract: a Gilded Reliquary reading-table composition
 * that keeps the card spread dominant while presenting challenge tools as a quiet ledger.
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
  TimerReset,
  Trophy,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import { MemoryGame } from "@/game/memoryGame";
import { loadBestScores, saveBestScore } from "@/game/scores";
import { RitualSoundscape, type RitualSound } from "@/game/sound";
import { createGameScene, type GameHandle } from "@/game/scene";
import {
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  type ArcanaName,
  type ArcanaSymbol,
  type BestScoreMap,
  type DifficultyId,
  type GameSnapshot,
} from "@/game/types";

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

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const seconds = Math.max(0, totalSeconds) % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function statusMessage(snapshot: GameSnapshot, remainingSeconds: number) {
  if (snapshot.phase === "timed-out") return "The sandglass has emptied. Lay a new spread to continue.";
  if (snapshot.phase === "complete") return `The constellation is complete in ${snapshot.moves} moves.`;
  if (snapshot.phase === "resolving") return "The symbols do not answer together.";
  if (snapshot.phase === "one-selected") return "One card is listening. Turn another.";
  if (remainingSeconds <= 15) return "The last grains fall. Trust the first pattern you saw.";
  if (snapshot.matchedPairs > 0) return `${snapshot.matchedPairs} pairs have joined the reading.`;
  return "Turn two hidden cards before the sandglass empties.";
}

function CardFace({ symbol }: { symbol: ArcanaSymbol }) {
  const Icon = iconByArcana[symbol.name];
  const artPosition = {
    "--art-x": symbol.artX,
    "--art-y": symbol.artY,
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
        <span className="tarot-card__surface tarot-card__back" aria-hidden="true">
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
  const soundsRef = useRef<RitualSoundscape | null>(null);
  const recordedRoundRef = useRef(0);

  if (!gameRef.current) {
    gameRef.current = new MemoryGame(undefined, "oracle", isDemoRef.current ? 143 : undefined);
  }
  if (!soundsRef.current) soundsRef.current = new RitualSoundscape();

  const game = gameRef.current;
  const sounds = soundsRef.current;
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => game.getSnapshot());
  const [remainingSeconds, setRemainingSeconds] = useState(() => game.getSnapshot().difficulty.timeLimitSeconds);
  const [bestScores, setBestScores] = useState<BestScoreMap>(() => loadBestScores());
  const [isMuted, setIsMuted] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const elapsedSeconds = snapshot.difficulty.timeLimitSeconds - remainingSeconds;
  const activeRecord = bestScores[snapshot.difficulty.id];

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
      .catch((error) => console.error("Unable to create Mystery Deck scene", error));

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

  useEffect(() => {
    setRemainingSeconds(snapshot.difficulty.timeLimitSeconds);
    setIsNewRecord(false);
  }, [snapshot.roundId, snapshot.difficulty.timeLimitSeconds]);

  useEffect(() => {
    if (isDemoRef.current || snapshot.phase === "complete" || snapshot.phase === "timed-out") return;
    if (remainingSeconds <= 0) {
      game.expire();
      return;
    }
    const timer = window.setTimeout(() => setRemainingSeconds((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [game, remainingSeconds, snapshot.phase]);

  useEffect(() => {
    if (snapshot.phase !== "complete" || recordedRoundRef.current === snapshot.roundId) return;
    recordedRoundRef.current = snapshot.roundId;
    const score = {
      moves: snapshot.moves,
      seconds: elapsedSeconds,
      completedAt: new Date().toISOString(),
    };
    const result = saveBestScore(snapshot.difficulty.id, score);
    setBestScores(result.scores);
    setIsNewRecord(result.isNewRecord);
  }, [elapsedSeconds, snapshot.difficulty.id, snapshot.moves, snapshot.phase, snapshot.roundId]);

  useEffect(() => () => {
    game.dispose();
    sounds.dispose();
  }, [game, sounds]);

  const isBlocked =
    snapshot.phase === "resolving" || snapshot.phase === "complete" || snapshot.phase === "timed-out";

  const play = (sound: RitualSound) => sounds.play(sound);

  const selectCard = (cardId: string) => {
    const event = game.selectCard(cardId);
    if (event === "flip") play("flip");
    if (event === "match") play("match");
    if (event === "complete") {
      play("match");
      play("complete");
    }
  };

  const layNewSpread = (difficultyId: DifficultyId = snapshot.difficulty.id) => {
    game.restart(difficultyId);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    sounds.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) play("flip");
  };

  const hasEnded = snapshot.phase === "complete" || snapshot.phase === "timed-out";

  return (
    <main className="arcana-shell">
      <canvas ref={canvasRef} className="arcana-canvas" aria-hidden="true" />
      <div className="arcana-grain" aria-hidden="true" />

      <header className="arcana-header">
        <div className="header-row">
          <div className="brand-bookplate">
            <span className="brand-bookplate__crest crest-mark" aria-label="Mystery Deck crescent and star emblem">
              <Moon strokeWidth={1.25} aria-hidden="true" />
              <Sparkles strokeWidth={1.2} aria-hidden="true" />
            </span>
            <div>
              <p className="brand-bookplate__kicker">A timed memory reading</p>
              <h1>Mystery Deck</h1>
            </div>
          </div>

          <div className="score-ledger" aria-label="Game progress">
            <div className="score-ledger__item score-ledger__item--timer">
              <span>Sand</span>
              <strong className={remainingSeconds <= 15 ? "is-urgent" : ""}>{formatTime(remainingSeconds)}</strong>
            </div>
            <span className="score-ledger__separator" aria-hidden="true" />
            <div className="score-ledger__item">
              <span>Moves</span>
              <strong>{String(snapshot.moves).padStart(2, "0")}</strong>
            </div>
            <span className="score-ledger__separator" aria-hidden="true" />
            <div className="score-ledger__item">
              <span>Pairs</span>
              <strong>{String(snapshot.matchedPairs).padStart(2, "0")}<em>/{String(snapshot.difficulty.pairs).padStart(2, "0")}</em></strong>
            </div>
          </div>
        </div>

        <div className="challenge-rail" aria-label="Reading difficulty and personal record">
          <div className="difficulty-cluster">
            <span className="challenge-rail__label">Choose a reading</span>
            <div className="difficulty-tabs" role="group" aria-label="Difficulty level">
              {DIFFICULTY_ORDER.map((difficultyId) => {
                const difficulty = DIFFICULTIES[difficultyId];
                return (
                  <button
                    key={difficulty.id}
                    type="button"
                    className={`difficulty-tab ${snapshot.difficulty.id === difficulty.id ? "is-active" : ""}`}
                    onClick={() => layNewSpread(difficulty.id)}
                    aria-pressed={snapshot.difficulty.id === difficulty.id}
                    title={difficulty.description}
                  >
                    {difficulty.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="difficulty-description">{snapshot.difficulty.description}</p>

          <div className="record-ledger" aria-label="Personal record for selected difficulty">
            <Trophy size={13} strokeWidth={1.45} aria-hidden="true" />
            <span>Best</span>
            <strong>{activeRecord ? `${activeRecord.moves} moves · ${formatTime(activeRecord.seconds)}` : "Awaiting a reading"}</strong>
          </div>

          <button
            type="button"
            className="sound-button"
            onClick={toggleSound}
            aria-pressed={!isMuted}
            aria-label={isMuted ? "Enable sound" : "Mute sound"}
            title={isMuted ? "Enable sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX size={15} strokeWidth={1.5} /> : <Volume2 size={15} strokeWidth={1.5} />}
            <span>{isMuted ? "Muted" : "Sound"}</span>
          </button>
        </div>
      </header>

      <section className="game-reading" aria-label="Mystery Deck game board">
        <div className="reading-rule reading-rule--top" aria-hidden="true"><span>✦</span></div>
        <div
          className="tarot-grid"
          style={{ "--grid-columns": snapshot.difficulty.columns } as CSSProperties}
        >
          {snapshot.cards.map((card) => (
            <TarotCard
              key={`${snapshot.roundId}-${card.id}`}
              card={card}
              onSelect={() => selectCard(card.id)}
              isBlocked={isBlocked}
            />
          ))}
        </div>
        <div className="reading-rule reading-rule--bottom" aria-hidden="true"><span>✦</span></div>
      </section>

      <section className="arcana-footer" aria-label="Game controls and guidance">
        <p className="turn-instruction" aria-live="polite">{statusMessage(snapshot, remainingSeconds)}</p>
        <button type="button" className="shuffle-button" onClick={() => layNewSpread()}>
          <TimerReset size={14} strokeWidth={1.7} aria-hidden="true" />
          Lay a new spread
        </button>
      </section>

      {isDemoRef.current && <p className="demo-label">Demonstration reading</p>}

      {hasEnded && (
        <div className="completion-scrim" role="status" aria-live="assertive">
          <section className="completion-card" aria-label={snapshot.phase === "complete" ? "Reading complete" : "Time expired"}>
            <span className="completion-card__crest crest-mark" aria-hidden="true">
              <Moon strokeWidth={1.25} />
              <Sparkles strokeWidth={1.2} />
            </span>
            <p className="completion-card__eyebrow">
              {snapshot.phase === "complete" ? "The constellation is complete" : "The sandglass is empty"}
            </p>
            <h2>{snapshot.phase === "complete" ? `${snapshot.moves} moves` : `${snapshot.matchedPairs}/${snapshot.difficulty.pairs} pairs`}</h2>
            <p>
              {snapshot.phase === "complete"
                ? "Every hidden card has found its twin before the final grain fell."
                : "The reading closes for now. A fresh spread may reveal a faster pattern."}
            </p>
            {snapshot.phase === "complete" && isNewRecord && (
              <p className="completion-card__record">New personal record · {formatTime(elapsedSeconds)}</p>
            )}
            <button type="button" className="completion-card__action" onClick={() => layNewSpread()}>
              <Sparkles size={14} strokeWidth={1.7} aria-hidden="true" />
              Lay a new spread
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
