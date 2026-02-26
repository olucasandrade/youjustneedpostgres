import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCountUp } from "../../hooks/useCountUp";

interface DbNode {
  name: string;
  role: string;
  snark: string;
  cost: number;
  color: string;
  x: number;
  y: number;
}

const databases: DbNode[] = [
  {
    name: "Redis",
    role: "Caching",
    snark: "$800/month for a cache. Impressive.",
    cost: 800,
    color: "#dc382c",
    x: 15,
    y: 25,
  },
  {
    name: "Elasticsearch",
    role: "Search",
    snark:
      "Congrats, you're now an Elasticsearch admin. Hope you enjoy JVM heap tuning.",
    cost: 1200,
    color: "#fed10a",
    x: 75,
    y: 15,
  },
  {
    name: "Pinecone",
    role: "Vectors / AI",
    snark: "$0.095 per 1M reads. Sure, it adds up.",
    cost: 700,
    color: "#7c3aed",
    x: 10,
    y: 55,
  },
  {
    name: "MongoDB",
    role: "Documents",
    snark: "Document store! Until your data needs relationships. Then what?",
    cost: 900,
    color: "#00ed64",
    x: 85,
    y: 50,
  },
  {
    name: "Kafka",
    role: "Message Queue",
    snark: "You built a distributed commit log! Now who maintains it?",
    cost: 1500,
    color: "#231f20",
    x: 20,
    y: 85,
  },
  {
    name: "InfluxDB",
    role: "Time-Series",
    snark: "Specialized time-series! Also, learn Flux. Good luck.",
    cost: 500,
    color: "#22adf6",
    x: 80,
    y: 85,
  },
];

const pgNode: DbNode = {
  name: "PostgreSQL",
  role: "The one you already trust",
  snark: "You already have this. It does all of the above.",
  cost: 200,
  color: "#336791",
  x: 50,
  y: 50,
};

const totalOtherCost = databases.reduce((s, d) => s + d.cost, 0);

export function CrimeScene() {
  const { ref, isInView } = useScrollReveal({ margin: "-50px" });
  const [hoveredDb, setHoveredDb] = useState<string | null>(null);

  const sprawlCost = useCountUp(totalOtherCost, isInView, 2500, "$", "/mo");
  const pgCost = useCountUp(pgNode.cost, isInView, 2500, "$", "/mo");

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4 sm:px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-text-bright text-center tracking-wide mb-4">
          THE CRIME SCENE
        </h2>
        <p className="text-center text-text-dim mb-12 sm:mb-16 max-w-xl mx-auto text-sm sm:text-base">
          Your "microservices architecture," visualized. Each one of these is a
          thing that can break at 3 AM.
        </p>

        {/* Database Nodes */}
        <div
          className="relative w-full max-w-4xl mx-auto"
          style={{ minHeight: 480 }}
        >
          {/* Connection lines to Postgres */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ minHeight: 480 }}
          >
            {databases.map((db) => (
              <motion.line
                key={db.name}
                x1={`${db.x}%`}
                y1={`${db.y + 1}%`}
                x2={`${pgNode.x}%`}
                y2={`${pgNode.y}%`}
                stroke={hoveredDb === db.name ? db.color : "#1e2230"}
                strokeWidth="1"
                strokeDasharray="6 6"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            ))}
          </svg>

          {/* Other DBs */}
          {databases.map((db, i) => (
            <motion.div
              key={db.name}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 * i, duration: 0.5, type: "spring" }}
              className="absolute"
              style={{
                left: `${db.x}%`,
                top: `${db.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredDb(db.name)}
              onMouseLeave={() => setHoveredDb(null)}
            >
              <div
                className="relative px-3 py-2 sm:px-4 sm:py-3 rounded-lg border cursor-default transition-all duration-300 bg-dark-card"
                style={{
                  borderColor:
                    hoveredDb === db.name
                      ? db.color
                      : "var(--color-dark-border)",
                  boxShadow:
                    hoveredDb === db.name
                      ? `0 0 20px ${db.color}33, 0 0 40px ${db.color}11`
                      : "none",
                }}
              >
                <div className="text-xs sm:text-sm font-bold text-text-bright whitespace-nowrap">
                  {db.name}
                </div>
                <div className="text-[10px] sm:text-xs text-text-dim whitespace-nowrap">
                  {db.role}
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredDb === db.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-lg border border-dark-border bg-dark-surface text-xs text-text-dim max-w-[220px] text-center whitespace-normal"
                      style={{
                        boxShadow: `0 4px 20px rgba(0,0,0,0.6)`,
                      }}
                    >
                      <em>"{db.snark}"</em>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}

          {/* PostgreSQL center node */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
            className="absolute"
            style={{
              left: `${pgNode.x - 10}%`,
              top: `${pgNode.y - 5}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredDb("PostgreSQL")}
            onMouseLeave={() => setHoveredDb(null)}
          >
            <div
              className="relative px-4 py-3 sm:px-6 sm:py-4 rounded-xl border-2 bg-dark-card transition-all duration-300"
              style={{
                borderColor: pgNode.color,
                boxShadow:
                  hoveredDb === "PostgreSQL"
                    ? `0 0 30px ${pgNode.color}44, 0 0 60px ${pgNode.color}22`
                    : `0 0 15px ${pgNode.color}22`,
              }}
            >
              <div className="text-sm sm:text-base font-bold text-text-bright flex items-center gap-2">
                <span className="text-lg">🐘</span> PostgreSQL
              </div>
              <div className="text-[10px] sm:text-xs text-pg-blue">
                {pgNode.role}
              </div>
              <AnimatePresence>
                {hoveredDb === "PostgreSQL" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-lg border border-pg-blue/30 bg-dark-surface text-xs text-pg-blue max-w-[220px] text-center whitespace-normal"
                  >
                    <em>"{pgNode.snark}"</em>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Cost comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
        >
          <div className="text-center">
            <div className="text-xs text-text-dim uppercase tracking-widest mb-2">
              Your sprawl
            </div>
            <div className="font-display text-4xl sm:text-5xl text-danger">
              {sprawlCost.display}
            </div>
          </div>
          <div className="text-2xl sm:text-3xl text-muted font-display">vs</div>
          <div className="text-center">
            <div className="text-xs text-text-dim uppercase tracking-widest mb-2">
              Just Postgres
            </div>
            <div className="font-display text-4xl sm:text-5xl text-electric">
              {pgCost.display}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
