/**
 * Mystery Deck sound contract: small, interaction-gated Web Audio gestures
 * support the ritual without needing remote media assets or autoplay permission.
 */

export type RitualSound = "flip" | "match" | "complete";

type Note = { frequency: number; delay: number; duration: number; gain: number };

const SOUND_NOTES: Record<RitualSound, Note[]> = {
  flip: [
    { frequency: 622.25, delay: 0, duration: 0.055, gain: 0.028 },
    { frequency: 783.99, delay: 0.045, duration: 0.06, gain: 0.018 },
  ],
  match: [
    { frequency: 523.25, delay: 0, duration: 0.08, gain: 0.035 },
    { frequency: 659.25, delay: 0.075, duration: 0.09, gain: 0.03 },
    { frequency: 783.99, delay: 0.16, duration: 0.12, gain: 0.026 },
  ],
  complete: [
    { frequency: 392, delay: 0, duration: 0.11, gain: 0.026 },
    { frequency: 523.25, delay: 0.1, duration: 0.12, gain: 0.029 },
    { frequency: 659.25, delay: 0.21, duration: 0.14, gain: 0.027 },
    { frequency: 783.99, delay: 0.34, duration: 0.2, gain: 0.022 },
  ],
};

export class RitualSoundscape {
  private context: AudioContext | null = null;
  private muted = false;

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  play(sound: RitualSound) {
    if (this.muted || typeof window === "undefined") return;
    const context = this.getContext();
    if (!context) return;
    if (context.state === "suspended") void context.resume();

    const now = context.currentTime;
    SOUND_NOTES[sound].forEach((note) => this.scheduleNote(context, now, note));
  }

  dispose() {
    if (this.context && this.context.state !== "closed") void this.context.close();
    this.context = null;
  }

  private getContext() {
    if (this.context) return this.context;
    if (!("AudioContext" in window)) return null;
    this.context = new AudioContext();
    return this.context;
  }

  private scheduleNote(context: AudioContext, now: number, note: Note) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + note.delay;
    const end = start + note.duration;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(note.frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(note.gain, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.015);
  }
}
