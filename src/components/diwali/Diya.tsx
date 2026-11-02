import { motion } from "framer-motion";

export function Diya({ lit, size = 200 }: { lit: boolean; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {lit && (
        <motion.div
          className="halo pointer-events-none absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame-glow"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: size * 3, height: size * 3, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      <svg viewBox="0 0 200 200" className="relative h-full w-full overflow-visible">
        <defs>
          <linearGradient id="dg" x1="0" x2="1">
            <stop offset="0" stopColor="#7a5a26" />
            <stop offset=".35" stopColor="#E8D5A5" />
            <stop offset=".55" stopColor="#C6A15B" />
            <stop offset=".8" stopColor="#F3E6C2" />
            <stop offset="1" stopColor="#6b4c20" />
          </linearGradient>
          <radialGradient id="fl" cx=".5" cy=".75" r=".7">
            <stop offset="0" stopColor="#FFF7E9" />
            <stop offset=".35" stopColor="#F6CF7A" />
            <stop offset=".75" stopColor="#D88A32" />
            <stop offset="1" stopColor="#B9412E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="oil" cx=".5" cy=".3">
            <stop offset="0" stopColor={lit ? "#F6CF7A" : "#3a2418"} />
            <stop offset="1" stopColor="#281915" />
          </radialGradient>
        </defs>
        {/* shadow */}
        <ellipse cx="100" cy="176" rx="70" ry="7" fill="#000" opacity=".45" />
        {/* body */}
        <path d="M22 118 Q100 112 178 118 Q168 168 100 172 Q32 168 22 118 Z" fill="url(#dg)" />
        <path d="M22 118 Q100 112 178 118 Q168 168 100 172 Q32 168 22 118 Z" fill="none" stroke="#6b4c20" strokeWidth=".8" />
        {/* lip & spout */}
        <path d="M150 116 Q178 108 192 98 Q186 120 170 124 Z" fill="url(#dg)" />
        <ellipse cx="100" cy="118" rx="78" ry="9" fill="url(#oil)" stroke="#E8D5A5" strokeWidth="1" />
        {/* engraved pattern */}
        <g stroke="#6b4c20" strokeWidth=".9" fill="none" opacity=".7">
          <path d="M40 138 Q100 150 160 138" />
          {[50, 70, 90, 110, 130, 150].map((x) => (
            <path key={x} d={`M${x} 142 q5 -8 10 0 q-5 8 -10 0`} />
          ))}
          <path d="M55 156 Q100 164 145 156" />
        </g>
        {/* wick */}
        <path d="M184 100 q2 -6 0 -12" stroke="#281915" strokeWidth="2.5" strokeLinecap="round" />
        {/* flame */}
        {lit && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.34, 1.3, 0.64, 1] }}
            style={{ transformOrigin: "184px 90px" }}
          >
            <g className="flame" style={{ transformOrigin: "184px 90px" }}>
              <path d="M184 30 C204 58 202 80 184 92 C166 80 164 58 184 30 Z" fill="url(#fl)" />
              <g className="flame-inner" style={{ transformOrigin: "184px 90px" }}>
                <path d="M184 58 C193 72 192 82 184 89 C176 82 175 72 184 58 Z" fill="#FFF7E9" opacity=".9" />
              </g>
            </g>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
