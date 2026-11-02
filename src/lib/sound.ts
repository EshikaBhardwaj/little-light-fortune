let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: { stop: () => void } | null = null;
let enabled = false;

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  return ctx!;
}

export function setSound(on: boolean) {
  enabled = on;
  if (on) {
    ac().resume();
    startAmbient();
  } else {
    ambient?.stop();
    ambient = null;
  }
}
export const soundOn = () => enabled;

function startAmbient() {
  if (ambient) return;
  const c = ac();
  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.09, c.currentTime + 4);
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = 900;
  g.connect(filt).connect(master!);
  // tanpura-like drone: Sa, Pa, Sa'
  const oscs = [130.81, 196, 261.63, 130.81 * 1.003].map((f, i) => {
    const o = c.createOscillator();
    o.type = i % 2 ? "triangle" : "sawtooth";
    o.frequency.value = f;
    const og = c.createGain();
    og.gain.value = i === 0 ? 0.5 : 0.25;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.08 + i * 0.05;
    const lg = c.createGain();
    lg.gain.value = 0.2;
    lfo.connect(lg).connect(og.gain);
    o.connect(og).connect(g);
    o.start();
    lfo.start();
    return [o, lfo];
  });
  // soft bell twinkles every few seconds
  const tw = setInterval(() => {
    const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    tone(notes[Math.floor(Math.random() * notes.length)]!, 2.5, 0.025, "sine");
  }, 3800);
  ambient = {
    stop: () => {
      clearInterval(tw);
      g.gain.linearRampToValueAtTime(0, c.currentTime + 1);
      setTimeout(() => oscs.flat().forEach((o) => o.stop()), 1100);
    },
  };
}

function tone(freq: number, dur: number, vol = 0.2, type: OscillatorType = "sine", delay = 0) {
  if (!enabled) return;
  const c = ac();
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master!);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(dur: number, vol: number, freq: number, q = 1, delay = 0) {
  if (!enabled) return;
  const c = ac();
  const t = c.currentTime + delay;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(master!);
  s.start(t);
}

export const sfx = {
  match: () => {
    noise(0.18, 0.5, 3000, 0.8);
    noise(0.9, 0.25, 600, 0.5, 0.15);
  },
  bell: () => [523.25, 1046.5, 1569.8, 2093].forEach((f, i) => tone(f, 3.5 - i * 0.6, 0.12 / (i + 1))),
  chime: () => {
    tone(1318.5, 1.2, 0.08);
    tone(1975.5, 1, 0.05, "sine", 0.05);
  },
  shimmer: () => [1046, 1318, 1568, 2093, 2637].forEach((f, i) => tone(f, 1.4, 0.04, "sine", i * 0.08)),
  reveal: () => [261.6, 329.6, 392, 523.3].forEach((f, i) => tone(f, 2.5, 0.07, "triangle", i * 0.15)),
  hover: (i: number) => tone([659.25, 783.99, 880, 987.77, 1174.66][i % 5]!, 0.6, 0.04, "sine"),
  deal: () => noise(0.12, 0.18, 2200, 1.5),
  sparkle: () => Array.from({ length: 10 }).forEach((_, i) => tone(1500 + Math.random() * 2000, 0.5, 0.025, "sine", i * 0.06)),
  burst: () => {
    noise(0.5, 0.35, 180, 0.7);
    Array.from({ length: 14 }).forEach((_, i) => noise(0.06, 0.12, 3000 + Math.random() * 3000, 2, 0.15 + Math.random() * 0.8));
  },
  transition: () => [196, 293.7, 392].forEach((f, i) => tone(f, 3, 0.05, "sine", i * 0.3)),
};
