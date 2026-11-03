let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let voiceBus: GainNode | null = null;
let ambient: { stop: () => void } | null = null;
let enabled = false;

function ac() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 18;
    compressor.ratio.value = 3;
    master.connect(compressor).connect(ctx.destination);
    voiceBus = ctx.createGain();
    voiceBus.connect(master);
    const echo = ctx.createDelay(1);
    echo.delayTime.value = 0.32;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.22;
    const damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 1800;
    const wet = ctx.createGain();
    wet.gain.value = 0.18;
    voiceBus.connect(echo).connect(damp).connect(wet).connect(master);
    damp.connect(feedback).connect(echo);
  }
  return ctx;
}

export function setSound(on: boolean) {
  enabled = on;
  if (!on && !ctx) return;
  const c = ac();
  if (!master) return;
  master.gain.cancelAndHoldAtTime(c.currentTime);
  master.gain.linearRampToValueAtTime(on ? 0.38 : 0, c.currentTime + (on ? 1.2 : 0.25));
  if (on) {
    void c.resume();
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
  if (!voiceBus) return;
  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.075, c.currentTime + 5);
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = 650;
  g.connect(filt).connect(voiceBus);
  // tanpura-like drone: Sa, Pa, Sa'
  const oscs = [130.81, 196, 261.63, 130.81 * 1.003].map((f, i) => {
    const o = c.createOscillator();
    o.type = i === 1 ? "triangle" : "sine";
    o.frequency.value = f;
    const og = c.createGain();
    og.gain.value = i === 0 ? 0.5 : 0.25;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.08 + i * 0.05;
    const lg = c.createGain();
    lg.gain.value = 0.035;
    lfo.connect(lg).connect(og.gain);
    o.connect(og).connect(g);
    o.start();
    lfo.start();
    return [o, lfo];
  });
  // soft bell twinkles every few seconds
  const tw = setInterval(() => {
    const notes = [392, 440, 523.25, 587.33, 659.25, 783.99];
    tone(notes[Math.floor(Math.random() * notes.length)] ?? 523.25, 3.8, 0.018, "sine");
  }, 6200);
  ambient = {
    stop: () => {
      clearInterval(tw);
      g.gain.cancelAndHoldAtTime(c.currentTime);
      g.gain.linearRampToValueAtTime(0, c.currentTime + 1);
      setTimeout(() => {
        oscs.flat().forEach((o) => { o.stop(); o.disconnect(); });
        g.disconnect(); filt.disconnect();
      }, 1100);
    },
  };
}

function tone(freq: number, dur: number, vol = 0.2, type: OscillatorType = "sine", delay = 0) {
  if (!enabled) return;
  const c = ac();
  if (!voiceBus) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(voiceBus);
  o.onended = () => { o.disconnect(); g.disconnect(); };
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(dur: number, vol: number, freq: number, q = 1, delay = 0) {
  if (!enabled) return;
  const c = ac();
  if (!voiceBus) return;
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
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + Math.min(0.04, dur / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(voiceBus);
  s.onended = () => { s.disconnect(); f.disconnect(); g.disconnect(); };
  s.start(t);
  s.stop(t + dur);
}

export const sfx = {
  match: () => {
    noise(0.2, 0.11, 1400, 0.6);
    noise(1.1, 0.055, 500, 0.5, 0.15);
  },
  bell: () => [392, 784, 1176].forEach((f, i) => tone(f, 4 - i * 0.6, 0.08 / (i + 1))),
  chime: () => {
    tone(659.25, 1.8, 0.055);
    tone(783.99, 1.6, 0.025, "sine", 0.12);
  },
  shimmer: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 2, 0.028, "sine", i * 0.16)),
  reveal: () => [261.63, 329.63, 392, 523.25].forEach((f, i) => tone(f, 3.6, 0.05, "sine", i * 0.22)),
  hover: (i: number) => tone([523.25, 587.33, 659.25, 783.99, 880][i % 5] ?? 523.25, 1, 0.02, "sine"),
  deal: () => noise(0.18, 0.045, 1000, 0.7),
  sparkle: () => [783.99, 880, 1046.5, 1174.66, 1318.5].forEach((f, i) => tone(f, 1.6, 0.016, "sine", i * 0.15)),
  burst: () => [523.25, 783.99, 1046.5].forEach((f, i) => tone(f, 2.8, 0.018, "sine", i * 0.18)),
  transition: () => [196, 293.7, 392].forEach((f, i) => tone(f, 3, 0.05, "sine", i * 0.3)),
};
