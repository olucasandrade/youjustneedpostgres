import { motion } from "framer-motion";
import { useTypewriter } from "../../hooks/useTypewriter";
import { TerminalWindow } from "../TerminalWindow";

const terminalLines = [
  "$ connecting to production.db...",
  "$ SELECT COUNT(*) FROM your_microservices;",
  "  7",
  "$ -- Redis, Elasticsearch, Pinecone, MongoDB, Kafka, InfluxDB, and... oh right, Postgres.",
  "$ -- You're managing 7 databases.",
  "$ -- This is your fault.",
];

function colorLine(line: string) {
  if (line.startsWith("$") && line.includes("--")) {
    return <span className="comment-line">{line}</span>;
  }
  if (line.startsWith("$")) {
    return (
      <>
        <span className="prompt-char">$ </span>
        <span className="text-text">{line.slice(2)}</span>
      </>
    );
  }
  if (line.trim().match(/^\d+$/)) {
    return <span className="number-val font-bold text-lg">{line}</span>;
  }
  return <span className="output-line">{line}</span>;
}

export function Hero() {
  const { displayedLines, isTyping } = useTypewriter(
    terminalLines,
    true,
    {
      speed: 25,
      commandSpeed: 15,
      lineDelay: 500,
      startDelay: 800,
    }
  );

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Author attribution */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
      >
        <a
          href="https://www.olucasandrade.com/about/lucas-andrade"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-dark-border/60 bg-dark-surface/80 backdrop-blur-sm hover:border-electric/40 transition-all duration-300 group"
        >
          <img
            src="https://github.com/olucasandrade.png"
            alt="Lucas Andrade"
            className="w-7 h-7 rounded-full ring-1 ring-dark-border group-hover:ring-electric/50 transition-all duration-300"
          />
          <span className="text-xs font-mono text-text-dim group-hover:text-electric transition-colors duration-300">
            by <span className="text-text font-medium">Lucas Andrade</span>
          </span>
        </a>
      </motion.div>

      {/* Radial glow behind terminal */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(51,103,145,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Main Headline — always visible */}
      <div className="text-center relative z-10 mb-10 sm:mb-14">
        <h1
          className="glitch font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider text-text-bright leading-none"
          data-text="YOU JUST NEED POSTGRES."
        >
          YOU JUST NEED POSTGRES.
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-text-dim font-mono max-w-xl mx-auto">
          Stop building your own distributed systems nightmare.
        </p>
      </div>

      {/* Terminal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-2xl relative z-10"
      >
        <TerminalWindow title="psql — production">
          <div className="min-h-[180px]">
            {displayedLines.map((line, i) => (
              <div key={i} className="leading-relaxed">
                {colorLine(line)}
                {i === displayedLines.length - 1 && isTyping && (
                  <span className="cursor-blink text-electric">▋</span>
                )}
              </div>
            ))}
          </div>
        </TerminalWindow>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted font-mono">scroll down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-electric text-lg"
        >
          ▼
        </motion.div>
      </motion.div>
    </section>
  );
}
