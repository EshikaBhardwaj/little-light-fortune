import type { CardId } from "@/lib/fortunes";

const G = "url(#cg)";

function Symbol({ id }: { id: CardId }) {
  switch (id) {
    case "sun":
      return (
        <g>
          {Array.from({ length: 24 }).map((_, i) => (
            <path key={i} d={`M100 ${i % 2 ? 46 : 36} L104 70 L96 70 Z`} fill={G} transform={`rotate(${i * 15} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="30" fill="none" stroke={G} strokeWidth="2" />
          <circle cx="100" cy="100" r="22" fill="#D88A32" opacity=".85" />
          <path d="M88 98 q4 -4 8 0 M104 98 q4 -4 8 0 M92 110 q8 6 16 0" stroke="#281915" strokeWidth="1.6" fill="none" />
        </g>
      );
    case "lotus":
      return (
        <g fill="none" stroke={G} strokeWidth="1.8">
          {[-60, -30, 0, 30, 60].map((r) => (
            <path key={r} d="M100 130 C80 105 85 70 100 50 C115 70 120 105 100 130 Z" transform={`rotate(${r} 100 130)`} fill={r === 0 ? "#B9412E" : "none"} fillOpacity=".7" />
          ))}
          <path d="M50 140 Q100 155 150 140" />
          <path d="M60 152 Q100 162 140 152" opacity=".6" />
          <circle cx="100" cy="88" r="3" fill="#E8D5A5" />
        </g>
      );
    case "star":
      return (
        <g>
          <path d="M100 38 L110 90 L162 100 L110 110 L100 162 L90 110 L38 100 L90 90 Z" fill={G} />
          <path d="M100 62 L106 94 L138 100 L106 106 L100 138 L94 106 L62 100 L94 94 Z" fill="#4B101D" opacity=".55" />
          {[[50, 52], [152, 58], [148, 150], [56, 146], [100, 26]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 2 : 3} fill="#E8D5A5" />
          ))}
          <circle cx="100" cy="100" r="58" fill="none" stroke={G} strokeWidth=".8" strokeDasharray="2 5" />
        </g>
      );
    case "elephant":
      return (
        <g fill="none" stroke={G} strokeWidth="2" strokeLinecap="round">
          <path d="M60 130 L60 100 Q60 66 96 64 Q134 62 140 96 L140 130" />
          <path d="M140 96 Q160 100 158 124 Q156 140 146 142" />
          <path d="M72 130 v12 M88 130 v12 M118 130 v12 M134 130 v12" />
          <path d="M60 130 H140" />
          <path d="M70 84 Q100 74 130 84 L124 104 Q100 112 76 104 Z" fill="#701F2D" fillOpacity=".8" />
          <path d="M100 76 v30 M82 82 l4 20 M118 82 l-4 20" strokeWidth="1" />
          <circle cx="150" cy="96" r="2.4" fill="#E8D5A5" />
          <path d="M96 52 L100 40 L104 52 Z" fill="#D88A32" />
        </g>
      );
    case "diya":
      return (
        <g>
          <circle cx="100" cy="82" r="40" fill="#D88A32" opacity=".18" />
          <path d="M100 42 C118 66 116 88 100 98 C84 88 82 66 100 42 Z" fill="#D88A32" />
          <path d="M100 66 C107 78 106 88 100 94 C94 88 93 78 100 66 Z" fill="#FFF7E9" />
          <path d="M50 110 Q100 104 150 110 Q142 146 100 148 Q58 146 50 110 Z" fill={G} />
          <ellipse cx="100" cy="110" rx="50" ry="6" fill="#281915" stroke="#E8D5A5" strokeWidth=".8" />
        </g>
      );
  }
}

export function CardArt({ id, accent }: { id: CardId; accent: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6a32" />
          <stop offset=".35" stopColor="#E8D5A5" />
          <stop offset=".6" stopColor="#C6A15B" />
          <stop offset="1" stopColor="#F3E6C2" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="78" fill="none" stroke={accent} strokeWidth=".8" opacity=".6" />
      <Symbol id={id} />
    </svg>
  );
}

/** Card frame with ornamental corners */
export function CardFrame({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-maroon shadow-card">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 38%, color-mix(in oklab, ${accent} 35%, transparent), transparent 65%)` }} />
      <div className="absolute inset-[6px] rounded-sm border border-gold/70" />
      <div className="absolute inset-[10px] rounded-sm border border-gold/30" />
      {["left-[4px] top-[4px]", "right-[4px] top-[4px]", "left-[4px] bottom-[4px]", "right-[4px] bottom-[4px]"].map((p) => (
        <span key={p} className={`absolute ${p} h-2 w-2 rotate-45 bg-foil`} />
      ))}
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}

export function CardBack() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-burgundy shadow-card">
      <div className="absolute inset-[6px] rounded-sm border border-gold/70" />
      <svg viewBox="0 0 100 150" className="absolute inset-0 h-full w-full p-4 opacity-80">
        <g fill="none" stroke="#C6A15B" strokeWidth=".5">
          {[10, 18, 26, 34].map((r) => <circle key={r} cx="50" cy="75" r={r} strokeDasharray={r % 16 ? "1 2" : undefined} />)}
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d="M50 75 Q54 55 50 38 Q46 55 50 75" transform={`rotate(${i * 30} 50 75)`} />
          ))}
          <path d="M50 8 L56 16 L50 24 L44 16 Z M50 126 L56 134 L50 142 L44 134 Z" />
        </g>
      </svg>
    </div>
  );
}
