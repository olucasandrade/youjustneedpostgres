import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { scenarios, type Scenario } from "../../data/scenarios";
import { TerminalWindow } from "../TerminalWindow";

export function ReplaceYourStack() {
  const [active, setActive] = useState<Scenario | null>(null);

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-text-bright tracking-wide mb-4">
            REPLACE YOUR STACK.
          </h2>
          <p className="text-text-dim text-sm sm:text-base max-w-xl mx-auto">
            Pick your pain point. Postgres has the answer.
          </p>
        </motion.div>

        {/* Scenario buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10"
        >
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(active?.id === s.id ? null : s)}
              className={`
                px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border text-xs sm:text-sm font-mono
                transition-all duration-300 cursor-pointer
                ${
                  active?.id === s.id
                    ? "border-electric bg-electric/10 text-electric glow-blue"
                    : "border-dark-border bg-dark-card text-text-dim hover:border-electric/40 hover:text-text-bright"
                }
              `}
            >
              <span className="mr-1.5">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Active scenario */}
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-muted">
                  Replaces:
                </span>
                <span className="text-sm text-danger line-through">
                  {active.replaces}
                </span>
              </div>
              <TerminalWindow
                title={`psql — ${active.label.toLowerCase()}`}
                className="glow-blue-strong"
              >
                <Highlight
                  theme={themes.nightOwl}
                  code={active.sql}
                  language="sql"
                >
                  {({ tokens, getLineProps, getTokenProps }) => (
                    <pre className="!bg-transparent !p-0 overflow-x-auto">
                      {tokens.map((line, i) => (
                        <div
                          key={i}
                          {...getLineProps({ line })}
                          className="!bg-transparent"
                        >
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </TerminalWindow>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-xs sm:text-sm text-text-dim text-center"
              >
                {active.comment}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle state */}
        {!active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 border border-dashed border-dark-border rounded-xl"
          >
            <div className="text-3xl sm:text-4xl mb-3">🐘</div>
            <p className="text-muted text-sm">
              Click a scenario above to see Postgres in action.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
