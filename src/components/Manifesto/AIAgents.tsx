import { motion } from "framer-motion";

export function AIAgents() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-xs uppercase tracking-widest text-electric mb-4 font-bold">
        Bonus: The AI future
      </div>
      <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-text-bright tracking-wide mb-8">
        THE AI AGENT PROBLEM.
      </h2>
      <div className="space-y-6 text-sm sm:text-base text-text-dim leading-relaxed">
        <p>
          Your AI agents need to spin up test environments to try things. With 7
          databases, that means coordinating{" "}
          <strong className="text-text-bright">7 snapshots</strong> at the same
          point in time,{" "}
          <strong className="text-text-bright">7 connection strings</strong>,{" "}
          <strong className="text-text-bright">7 services</strong> running
          simultaneously.
        </p>
        <p>
          With Postgres:{" "}
          <strong className="text-electric">one command</strong>. Fork it, test
          it, done.
        </p>
        <div className="border border-dark-border rounded-lg p-4 sm:p-6 bg-dark-card/50">
          <code className="text-electric text-xs sm:text-sm">
            <span className="text-muted"># Fork the entire database for AI agent testing</span>
            <br />
            <span className="text-amber">CREATE DATABASE</span> agent_sandbox{" "}
            <span className="text-amber">WITH TEMPLATE</span> production;
            <br />
            <span className="text-muted"># Agent does its thing...</span>
            <br />
            <span className="text-amber">DROP DATABASE</span> agent_sandbox;
            <br />
            <span className="text-muted"># Done. No orphaned Redis keys. No stale Kafka topics.</span>
          </code>
        </div>
        <p className="text-amber border-l-2 border-amber/40 pl-4">
          The elephant never forgets. And it never needs a sync job.
        </p>
      </div>
    </motion.div>
  );
}
