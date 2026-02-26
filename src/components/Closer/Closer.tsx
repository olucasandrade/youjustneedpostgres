import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "../../hooks/useTypewriter";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { TerminalWindow } from "../TerminalWindow";

const closerLines = [
  "$ You've been managing 7 databases.",
  "$ You've been paying for 7 services.",
  "$ You've been learning 7 query languages.",
  "$ You've been waking up at 3 AM for 7 reasons.",
  "$",
  `$ It's ${new Date().getFullYear()}.`,
];

function colorLine(line: string) {
  if (line === "$") return <span>&nbsp;</span>;
  if (line.startsWith("$")) {
    return (
      <>
        <span className="prompt-char">$ </span>
        <span className="text-text">{line.slice(2)}</span>
      </>
    );
  }
  return <span>{line}</span>;
}

export function Closer() {
  const { ref, isInView } = useScrollReveal({ margin: "-100px" });
  const [showCTA, setShowCTA] = useState(false);

  const { displayedLines, isTyping, isComplete } = useTypewriter(
    closerLines,
    isInView,
    {
      speed: 28,
      commandSpeed: 20,
      lineDelay: 600,
      startDelay: 400,
      onComplete: () => setTimeout(() => setShowCTA(true), 800),
    },
  );

  return (
    <section
      ref={ref}
      className="py-20 sm:py-32 px-4 sm:px-6 min-h-screen flex flex-col items-center justify-center relative"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(51,103,145,0.1) 0%, transparent 60%)",
        }}
      />

      <div className="w-full max-w-2xl relative z-10">
        <TerminalWindow title="psql — the final word">
          <div className="min-h-[160px]">
            {displayedLines.map((line, i) => (
              <div key={i} className="leading-relaxed">
                {colorLine(line)}
                {i === displayedLines.length - 1 && isTyping && (
                  <span className="cursor-blink text-electric">▋</span>
                )}
              </div>
            ))}
            {isComplete && !showCTA && (
              <div>
                <span className="cursor-blink text-electric">▋</span>
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>

      {/* Big CTA headline */}
      <AnimatePresence>
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", damping: 15 }}
            className="mt-10 sm:mt-14 text-center relative z-10"
          >
            <h2
              className="glitch font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-text-bright leading-none"
              data-text="JUST. USE. POSTGRES."
            >
              JUST. USE. POSTGRES.
            </h2>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <a
                href="https://www.postgresql.org/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-pg-blue text-white font-mono text-sm font-bold tracking-wide
                  hover:bg-electric transition-colors duration-300 glow-blue"
              >
                Install PostgreSQL →
              </a>
              <a
                href="https://www.postgresql.org/docs/current/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-dark-border text-text-dim font-mono text-sm
                  hover:border-electric/50 hover:text-electric transition-all duration-300"
              >
                Read the Docs →
              </a>
              <a
                href="https://pgxn.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-dark-border text-text-dim font-mono text-sm
                  hover:border-amber/50 hover:text-amber transition-all duration-300"
              >
                Explore Extensions →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 text-center"
      >
        <p className="text-xs text-muted font-mono">
          Made with love, frustration, and PostgreSQL.
        </p>
        <p className="text-sm text-text-dim font-mono mt-3">
          by{" "}
          <a
            href="https://github.com/olucasandrade"
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric hover:text-amber transition-colors duration-300 underline underline-offset-2"
          >
            Lucas Andrade
          </a>
        </p>
      </motion.footer>
    </section>
  );
}
