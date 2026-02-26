import { motion } from "framer-motion";
import { ComparisonTable } from "./ComparisonTable";
import { ThreeAM } from "./ThreeAM";
import { AIAgents } from "./AIAgents";

export function Manifesto() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto space-y-24 sm:space-y-32">
        {/* 3a — The Trap */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-text-bright tracking-wide mb-8 leading-tight">
            "USE THE RIGHT TOOL FOR THE RIGHT JOB"
            <span className="block text-amber mt-2 text-2xl sm:text-4xl md:text-5xl">
              IS A TRAP.
            </span>
          </h2>
          <div className="space-y-6 text-sm sm:text-base text-text-dim leading-relaxed">
            <p>
              You've heard the advice. You followed it. Congratulations... you
              now have <strong className="text-text-bright">7 databases</strong>{" "}
              to maintain, <strong className="text-text-bright">7 backup strategies</strong>,{" "}
              <strong className="text-text-bright">7 monitoring dashboards</strong>,{" "}
              <strong className="text-text-bright">7 security audits</strong>, and{" "}
              <strong className="text-text-bright">7 things that can break at 3 AM</strong>.
            </p>
            <p>
              Every specialized database vendor has a marketing team telling you
              their tool is <em>the right tool</em>. Funny, that.
            </p>
            <p className="text-amber border-l-2 border-amber/40 pl-4">
              "Use the right tool for the right job" — the rallying cry of every
              database vendor's marketing department.
            </p>
          </div>
        </motion.div>

        {/* 3b — Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-text-bright tracking-wide mb-4">
            POSTGRES DOES WHAT THEY DO.
          </h2>
          <p className="text-text-dim mb-10 text-sm sm:text-base">
            With the same algorithms. Not "close enough." The{" "}
            <em>same fuck*ng algorithms</em>.
          </p>
          <ComparisonTable />
          <a href="https://www.tigerdata.com/blog/pgvector-is-now-as-fast-as-pinecone-at-75-less-cost" className="underline underline-offset-5" target="_blank">
            <p className="mt-6 text-xs sm:text-sm text-text-dim text-center">
              <span className="text-electric">pgvectorscale</span> outperforms
              Pinecone by <strong className="text-amber-bright">28x</strong> at{" "}
              <strong className="text-amber-bright">75% less cost</strong>.
            </p>
          </a>
        </motion.div>

        {/* 3d — 3 AM */}
        <ThreeAM />

        {/* 3e — AI Agents */}
        <AIAgents />
      </div>
    </section>
  );
}
