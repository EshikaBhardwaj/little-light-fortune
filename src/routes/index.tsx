import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Diya } from "@/components/diwali/Diya";
import { CardArt, CardBack, CardFrame } from "@/components/diwali/CardArt";
import { CARDS, LINKS, pickFortune, type CardId, type Fortune } from "@/lib/fortunes";
import { setSound, sfx } from "@/lib/sound";
import { renderFortunePng } from "@/lib/exportCard";
import synergosLogo from "@/assets/synergos-logo.svg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Diwali Fortune — A Synergos Experience" },
      { name: "description", content: "Light the diya, pick a card and discover the fortune waiting for you this Diwali. A little light. A world of possibilities." },
      { property: "og:title", content: "Your Diwali Fortune — A Synergos Experience" },
      { property: "og:description", content: "A little light. A world of possibilities. This Diwali, discover the fortune waiting for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});

type Stage = "intro" | "lighting" | "ritual" | "reveal" | "synergos";
const EASE = [0.22, 1, 0.36, 1] as const;

function Particles({ count = 14 }: { count?: number }) {
  const ps = useMemo(
    () => Array.from({ length: count }).map(() => ({ l: 30 + Math.random() * 40, d: 5 + Math.random() * 6, del: Math.random() * 6, s: 2 + Math.random() * 3 })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {ps.map((p, i) => (
        <span key={i} className="particle absolute bottom-[20%] rounded-full bg-champagne" style={{ left: `${p.l}%`, width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.del}s`, boxShadow: "0 0 8px var(--saffron)" }} />
      ))}
    </div>
  );
}

function Ornament({ draw }: { draw: boolean }) {
  const paths = [
    "M200 40 C260 40 300 90 300 150 C300 210 260 260 200 260 C140 260 100 210 100 150 C100 90 140 40 200 40 Z",
    ...Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      const x = 200 + Math.cos(a) * 140, y = 150 + Math.sin(a) * 140;
      return `M200 150 Q${200 + Math.cos(a + 0.4) * 80} ${150 + Math.sin(a + 0.4) * 80} ${x} ${y} Q${200 + Math.cos(a - 0.4) * 80} ${150 + Math.sin(a - 0.4) * 80} 200 150`;
    }),
    "M60 150 H340",
  ];
  return (
    <svg viewBox="0 0 400 300" className="absolute left-1/2 top-1/2 w-[140vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-40">
      {paths.map((d, i) => (
        <motion.path key={i} d={d} fill="none" stroke="var(--gold)" strokeWidth={i === 0 ? 0.8 : 0.5} initial={{ pathLength: 0 }} animate={{ pathLength: draw ? 1 : 0 }} transition={{ duration: 3.2, delay: 0.4 + i * 0.18, ease: "easeInOut" }} />
      ))}
      <motion.circle r="2.5" fill="var(--champagne)" style={{ filter: "drop-shadow(0 0 6px var(--saffron))" }} initial={{ cx: 200, cy: 150, opacity: 0 }} animate={draw ? { cx: [200, 300, 200, 100, 200], cy: [150, 150, 260, 150, 40], opacity: [0, 1, 1, 1, 0] } : {}} transition={{ duration: 4.2, ease: "easeInOut" }} />
    </svg>
  );
}

function SoundToggle({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} aria-label={on ? "Mute sound" : "Enable sound"} className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-gold/50 bg-midnight/60 px-4 py-2 text-champagne backdrop-blur transition hover:border-gold">
      <span className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="w-[2px] bg-gold" animate={{ height: on ? [4, 12, 6][i]! : 3 }} transition={{ repeat: on ? Infinity : 0, repeatType: "mirror", duration: 0.5 + i * 0.15 }} />
        ))}
      </span>
      <span className="label-tracked">{on ? "Sound on" : "Sound off"}</span>
    </button>
  );
}

function GoldButton({ children, onClick, variant = "solid", href }: { children: React.ReactNode; onClick?: () => void; variant?: "solid" | "ghost"; href?: string }) {
  const cls = variant === "solid"
    ? "sweep relative overflow-hidden bg-foil text-midnight"
    : "border border-gold/60 text-champagne hover:bg-gold/10";
  const inner = <span className="relative z-10">{children}</span>;
  const base = `group inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 label-tracked text-[0.72rem] transition active:scale-[0.97] ${cls}`;
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className={base}>{inner}</a> : <button onClick={onClick} className={base}>{inner}</button>;
}

function Experience() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("intro");
  const [sound, setSoundState] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [lit, setLit] = useState(false);
  const [selected, setSelected] = useState<CardId | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 300);
    return () => clearTimeout(t);
  }, []);

  const [burst, setBurst] = useState(0);
  const toggleSound = () => {
    const n = !sound;
    setSoundState(n);
    setSound(n);
  };

  const lightDiya = () => {
    setStage("lighting");
    sfx.match();
    setTimeout(() => { setLit(true); }, reduce ? 100 : 1400);
    setTimeout(() => sfx.bell(), reduce ? 200 : 2000);
    setTimeout(() => sfx.sparkle(), reduce ? 300 : 2400);
    setTimeout(() => { setStage("ritual"); [0,1,2,3,4].forEach((k) => setTimeout(() => sfx.deal(), 800 + k * 120)); }, reduce ? 1200 : 5200);
  };

  const choose = (id: CardId) => {
    if (selected) return;
    sfx.chime();
    const f = pickFortune(id, seen.current);
    seen.current.add(f.id);
    setFortune(f);
    setSelected(id);
    setTimeout(() => setStage("reveal"), 900);
    setTimeout(() => { sfx.shimmer(); setFlipped(true); }, 1900);
    setTimeout(() => { sfx.reveal(); sfx.burst(); setBurst((b) => b + 1); }, 2900);
    setTimeout(() => sfx.burst(), 3500);
  };

  const another = () => {
    setFlipped(false);
    setSelected(null);
    setFortune(null);
    setStage("ritual");
  };

  const card = CARDS.find((c) => c.id === selected);

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-stage text-ivory">
      <SoundToggle on={sound} toggle={toggleSound} />
      <div className="fixed left-5 top-5 z-40 flex items-center gap-3">
        <img src={synergosLogo.url} alt="Synergos" className="h-6 w-auto sm:h-7" />
        <span className="label-tracked text-gold/80">· Diwali</span>
      </div>

      <AnimatePresence mode="wait">
        {(stage === "intro" || stage === "lighting") && (
          <motion.section key="intro" className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center" exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }} transition={{ duration: 1.2, ease: EASE }}>
            <Ornament draw={drawn} />
            {lit && <Particles />}
            <motion.p className="label-tracked mb-6 text-gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 1.5 }}>
              A little light · A world of possibilities
            </motion.p>
            <motion.h1 className="font-display text-[3.4rem] font-medium leading-[0.92] tracking-tight sm:text-7xl md:text-8xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8, duration: 1.6, ease: EASE }}>
              Some light<br />
              <span className="italic text-foil">is meant</span><br />
              to find you.
            </motion.h1>
            <motion.div className="relative my-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.6, duration: 1.4 }}>
              {stage === "lighting" && !lit && (
                <motion.span className="absolute z-10 h-2 w-2 rounded-full bg-champagne" style={{ boxShadow: "0 0 14px 4px var(--saffron)" }} initial={{ left: "-40%", top: "-60%" }} animate={{ left: "92%", top: "44%" }} transition={{ duration: 1.4, ease: "easeIn" }} />
              )}
              <Diya lit={lit} size={190} />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.4, duration: 1.2 }} className="relative z-10 max-w-sm">
              <p className="font-display text-xl italic text-champagne">This Diwali, a little surprise is waiting to unfold.</p>
              <AnimatePresence mode="wait">
                {stage === "intro" ? (
                  <motion.div key="cta" exit={{ opacity: 0 }} className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground">Take a moment. Make a wish. Let the light guide you.</p>
                    <GoldButton onClick={lightDiya}>Light the diya</GoldButton>
                  </motion.div>
                ) : (
                  <motion.p key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 label-tracked text-gold">{lit ? "Your light is lit" : "Striking the match…"}</motion.p>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.2, duration: 1.4 }} className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 px-6">
              <p className="label-tracked text-[0.55rem] text-gold/60">Imagined and created by</p>
              <a href={LINKS.main} target="_blank" rel="noopener noreferrer" aria-label="Visit Synergos">
                <img src={synergosLogo.url} alt="Synergos" className="h-5 w-auto transition hover:opacity-80 sm:h-6" />
              </a>
            </motion.div>
          </motion.section>
        )}

        {stage === "ritual" && (
          <motion.section key="ritual" className="relative flex min-h-[100svh] flex-col items-center px-6 pb-40 pt-24 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: EASE }}>
            <motion.p className="label-tracked text-gold" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>The ritual</motion.p>
            <motion.h2 className="mt-5 font-display text-5xl font-medium leading-[0.95] sm:text-7xl" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2, ease: EASE }}>
              A little light.<br /><span className="italic text-foil">A little destiny.</span>
            </motion.h2>
            <p className="mt-5 max-w-xs font-display text-lg italic text-champagne">Some wishes are written. Some are waiting to be discovered.</p>

            <div className="relative mt-14 flex h-[300px] w-full max-w-3xl items-center justify-center sm:h-[380px]" style={{ perspective: 1200 }}>
              {CARDS.map((c, i) => {
                const off = i - 2;
                const isSel = selected === c.id;
                return (
                  <motion.button
                    key={c.id}
                    aria-label={`Pick ${c.name}`}
                    onClick={() => choose(c.id)}
                    className="absolute left-1/2 top-1/2 -ml-[59px] -mt-[95px] h-[190px] w-[118px] sm:-ml-[87px] sm:-mt-[140px] sm:h-[280px] sm:w-[175px]"
                    initial={{ opacity: 0, y: 120, scale: 0.4, rotate: 0 }}
                    animate={
                      selected
                        ? isSel
                          ? { opacity: 1, x: 0, y: -10, scale: 1.25, rotate: 0, zIndex: 20 }
                          : { opacity: 0, y: 80, scale: 0.7, filter: "blur(6px)" }
                        : { opacity: 1, x: `${off * 44}%`, y: [Math.abs(off) * 14, Math.abs(off) * 14 - 6, Math.abs(off) * 14], rotate: off * 9, scale: 1 }
                    }
                    transition={selected ? { duration: 0.9, ease: EASE } : { delay: 0.8 + i * 0.12, duration: 1, ease: EASE, y: { repeat: Infinity, duration: 3 + i * 0.4, ease: "easeInOut", delay: 2 + i * 0.2 } }}
                    whileHover={selected ? {} : { y: Math.abs(off) * 14 - 22, scale: 1.05, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => !selected && sfx.hover(i)}
                    style={{ transformOrigin: "50% 120%" }}
                  >
                    <CardBack />
                  </motion.button>
                );
              })}
            </div>

            <motion.div className="mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              <h3 className="font-display text-2xl font-medium uppercase tracking-[0.12em] sm:text-3xl">Pick a card.<br /><span className="text-foil">Discover what awaits.</span></h3>
              <p className="mt-3 text-sm text-muted-foreground">Trust your instinct. Choose the one that speaks to you.</p>
            </motion.div>

            <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 opacity-90"><Diya lit size={90} /></div>
          </motion.section>
        )}

        {stage === "reveal" && card && fortune && (
          <motion.section key="reveal" className="relative flex min-h-[100svh] flex-col items-center px-6 pb-20 pt-24 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.8 }}>
            <Particles count={10} />
            <motion.div className="halo pointer-events-none absolute left-1/2 top-[40%] h-[120vw] max-h-[900px] w-[120vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame-glow" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: flipped ? 0.8 : 0.3, scale: 1 }} transition={{ duration: 2 }} />
            <Burst k={burst} />
            <p className="label-tracked relative text-gold">Your fortune</p>

            <div className="relative mt-8 aspect-[4/5] w-full max-w-[380px]" style={{ perspective: 1400 }}>
              <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }} initial={{ rotateY: 0, scale: 0.85 }} animate={{ rotateY: flipped ? 180 : 0, scale: 1 }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}>
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}><CardBack /></div>
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <CardFrame accent={card.accent}>
                    <div className="flex h-full flex-col items-center px-7 py-8">
                      <p className="label-tracked text-[0.6rem] text-gold">{card.name}</p>
                      <motion.div className="mt-2 h-[34%] w-[56%]" initial={{ scale: 0.6, opacity: 0 }} animate={flipped ? { scale: 1, opacity: 1 } : {}} transition={{ delay: 1.1, duration: 1.2, ease: EASE }} style={{ filter: "drop-shadow(0 0 18px color-mix(in oklab, var(--saffron) 60%, transparent))" }}>
                        <CardArt id={card.id} accent={card.accent} />
                      </motion.div>
                      <motion.h3 className="mt-2 font-display text-[1.75rem] font-semibold uppercase leading-[0.95] tracking-wide text-foil sm:text-3xl" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={flipped ? { clipPath: "inset(0 0% 0 0)" } : {}} transition={{ delay: 1.6, duration: 1.2, ease: EASE }}>
                        {fortune.category}
                      </motion.h3>
                      <motion.p className="mt-4 font-display text-[1.12rem] italic leading-snug text-ivory sm:text-xl" initial={{ opacity: 0, y: 12, filter: "blur(6px)" }} animate={flipped ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ delay: 2.2, duration: 1.4, ease: EASE }}>
                        “{fortune.text}”
                      </motion.p>
                      <p className="mt-auto label-tracked text-[0.5rem] text-gold/70">Happy Diwali · Synergos</p>
                    </div>
                  </CardFrame>
                </div>
              </motion.div>
            </div>

            <KeepFortune show={flipped} card={card} fortune={fortune} onAnother={another} onNext={() => { sfx.transition(); setStage("synergos"); window.scrollTo({ top: 0 }); }} />
          </motion.section>
        )}

        {stage === "synergos" && <Synergos key="syn" onRestart={another} />}
      </AnimatePresence>
    </main>
  );
}

function KeepFortune({ show, card, fortune, onAnother, onNext }: { show: boolean; card: (typeof CARDS)[number]; fortune: Fortune; onAnother: () => void; onNext: () => void }) {
  const [msg, setMsg] = useState("");
  const url = typeof window !== "undefined" ? window.location.origin : "";
  const shareText = `My Diwali fortune — ${fortune.category}:\n“${fortune.text}”\n\nDiscover yours: ${url}`;
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2200); };

  const save = async () => {
    const blob = await renderFortunePng(card, fortune);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `diwali-fortune-${card.id}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    flash("Saved to your device");
  };
  const share = async () => {
    try {
      const blob = await renderFortunePng(card, fortune);
      const file = new File([blob], "diwali-fortune.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: shareText, title: "My Diwali Fortune" });
      else if (navigator.share) await navigator.share({ text: shareText, url, title: "My Diwali Fortune" });
      else window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    } catch { /* cancelled */ }
  };
  const copy = async () => { await navigator.clipboard.writeText(url); flash("Link copied"); };

  return (
    <motion.div className="relative mt-16 w-full max-w-md" initial={{ opacity: 0, y: 30 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ delay: 3.6, duration: 1.2, ease: EASE }}>
      <p className="label-tracked text-gold">Keep it close</p>
      <h2 className="mt-4 font-display text-4xl font-medium leading-[0.95] sm:text-5xl">A little something<br /><span className="italic text-foil">to take with you.</span></h2>
      <p className="mx-auto mt-4 max-w-xs text-sm text-muted-foreground">May this little thought stay with you through the year ahead.</p>
      <div className="mt-8 flex flex-col gap-3">
        <GoldButton onClick={save}>Save my fortune</GoldButton>
        <GoldButton variant="ghost" onClick={share}>Share the good fortune</GoldButton>
        <div className="flex gap-3">
          <a className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-gold/30 label-tracked text-[0.62rem] text-champagne hover:border-gold" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <button className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-gold/30 label-tracked text-[0.62rem] text-champagne hover:border-gold" onClick={copy}>Copy link</button>
        </div>
        <button onClick={onAnother} className="mt-2 label-tracked text-gold underline-offset-8 hover:underline">Discover another fortune ↺</button>
        <p className="h-5 text-xs text-saffron" aria-live="polite">{msg}</p>
      </div>
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group mt-10 flex w-full cursor-pointer flex-col items-center gap-3 rounded-3xl border border-gold/30 px-6 py-6 text-champagne transition hover:border-gold hover:bg-gold/10"
      >
        <span className="label-tracked text-[0.6rem]">One more thing</span>
        <motion.span className="h-12 w-px bg-foil" animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.4 }} />
        <span className="font-display text-xl italic transition group-hover:text-foil">Who lit this light?</span>
        <span className="label-tracked text-[0.55rem] text-gold/70 transition group-hover:text-gold">Tap to meet the creators →</span>
      </motion.button>
    </motion.div>
  );
}

function Synergos({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.section className="relative flex min-h-[100svh] flex-col justify-center px-7 py-28 sm:px-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
      {/* light travelling to edges */}
      <motion.div className="pointer-events-none absolute inset-0" initial={{ boxShadow: "inset 0 0 0 0 transparent" }} animate={{ boxShadow: "inset 0 0 120px 0 color-mix(in oklab, var(--gold) 35%, transparent)" }} transition={{ duration: 2.4, delay: 0.3 }} />
      {["top-0 left-0 right-0 h-px origin-left", "bottom-0 left-0 right-0 h-px origin-right"].map((c, i) => (
        <motion.span key={c} className={`absolute ${c} bg-foil`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2, delay: 0.2 + i * 0.3, ease: EASE }} />
      ))}
      <div className="relative mx-auto w-full max-w-4xl">
        <motion.p className="label-tracked text-gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>The creator behind the light</motion.p>
        <motion.img src={synergosLogo.url} alt="Synergos" className="mt-8 h-10 w-auto sm:h-14" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1.1, ease: EASE }} />
        <h2 className="mt-6 font-display text-[3.2rem] font-medium leading-[0.9] tracking-tight sm:text-8xl">
          {["Every", "possibility", "begins with", "an idea."].map((w, i) => (
            <motion.span key={w} className={`block ${i === 3 ? "italic text-foil" : ""}`} initial={{ clipPath: "inset(0 0 100% 0)", y: 30 }} animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }} transition={{ delay: 0.9 + i * 0.25, duration: 1.1, ease: EASE }}>{w}</motion.span>
          ))}
        </h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: 1.2 }} className="mt-10 grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-champagne">From little moments of magic to meaningful brand experiences, we believe creativity can transform the way people connect with ideas.</p>
            <div className="my-8 h-px w-16 bg-foil" />
            <p className="font-display text-2xl italic leading-snug">This little Diwali experience was imagined and created by</p>
            <img src={synergosLogo.url} alt="Synergos" className="mt-4 h-8 w-auto sm:h-10" />
            <p className="mt-6 text-sm text-muted-foreground">Curious about what else we create?</p>
          </div>
          <div className="flex flex-col items-start gap-5">
            <GoldButton href={LINKS.main}>Explore Synergos</GoldButton>
            <a href={LINKS.work} target="_blank" rel="noopener noreferrer" className="font-display text-xl italic text-champagne underline-offset-4 hover:underline">Discover our work →</a>
            <a href={LINKS.about} target="_blank" rel="noopener noreferrer" className="label-tracked text-gold/80 hover:text-gold">About us</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }} className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-gold/20 pt-6">
          <p className="label-tracked text-gold/70">A little light. A world of possibilities.</p>
          <button onClick={onRestart} className="label-tracked text-champagne hover:text-gold">Pick another card ↺</button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Burst({ k }: { k: number }) {
  if (!k) return null;
  return (
    <div key={k} className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden>
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const d = 140 + (i % 5) * 45;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-[45%] h-1.5 w-1.5 rounded-full bg-foil"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 60, opacity: 0, scale: 0.2 }}
            transition={{ duration: 1.6 + (i % 3) * 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}
