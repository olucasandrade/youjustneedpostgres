import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { extensions, type Extension } from "../../data/extensions";

function ExtensionCard({ ext, index }: { ext: Extension; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      <div
        className="h-full p-4 sm:p-5 rounded-xl border transition-all duration-300 bg-dark-card"
        style={{
          borderColor: hovered ? ext.color : "var(--color-dark-border)",
          boxShadow: hovered
            ? `0 0 20px ${ext.color}22, 0 0 40px ${ext.color}11`
            : "none",
        }}
      >
        {/* Category badge */}
        <div
          className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded mb-3"
          style={{
            color: ext.color,
            backgroundColor: `${ext.color}15`,
          }}
        >
          {ext.category}
        </div>

        <h3
          className="font-bold text-sm sm:text-base mb-1.5"
          style={{ color: ext.color }}
        >
          {ext.name}
        </h3>
        <p className="text-xs sm:text-sm text-text-dim leading-relaxed">
          {ext.description}
        </p>

        {/* Install command on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <pre className="text-[10px] sm:text-xs p-2.5 rounded-lg bg-dark/80 border border-dark-border text-electric font-mono whitespace-pre-wrap">
                {ext.install}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function ExtensionsShelf() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-text-bright tracking-wide mb-4">
            THE EXTENSIONS SHELF.
          </h2>
          <p className="text-text-dim text-sm sm:text-base max-w-xl mx-auto">
            Postgres has been doing this since before your startup existed. It
            will be doing it long after your Redis instance crashes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {extensions.map((ext, i) => (
            <ExtensionCard key={ext.name} ext={ext} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
