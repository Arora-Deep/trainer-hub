// Tiny sound + haptic primitives. No external assets — synthesized via WebAudio.
let ctx: AudioContext | null = null;
function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
    catch { return null; }
  }
  return ctx;
}

function blip(freq: number, dur = 0.08, type: OscillatorType = "sine", gain = 0.05) {
  const a = audio(); if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(a.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export function playXp(enabled = true) {
  if (!enabled) return;
  blip(880, 0.06, "triangle", 0.04);
  setTimeout(() => blip(1320, 0.08, "triangle", 0.035), 50);
}
export function playLevelUp(enabled = true) {
  if (!enabled) return;
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, 0.12, "sine", 0.06), i * 70));
}
export function playMission(enabled = true) {
  if (!enabled) return;
  blip(660, 0.07, "square", 0.03);
  setTimeout(() => blip(990, 0.1, "square", 0.03), 60);
}
export function haptic(pattern: number | number[] = 12, enabled = true) {
  if (!enabled) return;
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(pattern); } catch { /* noop */ }
  }
}
