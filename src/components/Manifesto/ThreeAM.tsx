import { motion } from "framer-motion";
import { TerminalWindow } from "../TerminalWindow";

export function ThreeAM() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Red glow background */}
      <div
        className="absolute inset-0 -m-8 rounded-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,68,68,0.06) 0%, transparent 70%)",
        }}
      />

      <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-danger tracking-wide mb-4 relative">
        THE 3 AM PROBLEM.
      </h2>
      <p className="text-2xl sm:text-3xl font-display text-text-bright mb-10 relative">
        Something breaks at 3 AM.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* 7 databases side */}
        <div>
          <div className="text-xs uppercase tracking-widest text-danger mb-3 font-bold">
            With 7 databases:
          </div>
          <TerminalWindow title="incident — 03:07 AM" className="glow-red">
            <div className="text-xs sm:text-[13px] space-y-1">
              <div className="text-danger">⚠ ALERT: Latency spike detected</div>
              <div className="text-text-dim">$ checking redis... OK</div>
              <div className="text-text-dim">$ checking elasticsearch...</div>
              <div className="text-danger">
                ✗ ES cluster yellow — 2 shards unassigned
              </div>
              <div className="text-text-dim">$ checking kafka consumers...</div>
              <div className="text-amber">⚠ Consumer lag: 47,392 messages</div>
              <div className="text-text-dim">$ checking pinecone...</div>
              <div className="text-text-dim">$ checking influxdb...</div>
              <div className="text-text-dim">$ checking mongodb replset...</div>
              <div className="text-danger">✗ MongoDB secondary: stale</div>
              <div className="text-muted mt-2">
                -- 40 minutes in. Still no test environment.
              </div>
              <div className="text-muted">-- 3 engineers paged.</div>
              <div className="text-muted">-- CEO is awake now too.</div>
              <div className="text-danger mt-2">
                -- You still don't know what the f*ck caused it.
              </div>
            </div>
          </TerminalWindow>
        </div>

        {/* Just Postgres side */}
        <div>
          <div className="text-xs uppercase tracking-widest text-electric mb-3 font-bold">
            With just Postgres:
          </div>
          <TerminalWindow
            title="incident — 03:07 AM"
            className="glow-blue"
          >
            <div className="text-xs sm:text-[13px] space-y-1">
              <div className="text-amber">⚠ ALERT: Latency spike detected</div>
              <div className="text-text-dim">
                $ SELECT * FROM pg_stat_activity
              </div>
              <div className="text-text-dim">
                &nbsp; WHERE state = 'active';
              </div>
              <div className="text-electric mt-1">
                → Found: long-running query on orders table
              </div>
              <div className="text-text-dim mt-1">
                $ SELECT pg_cancel_backend(12847);
              </div>
              <div className="text-green-400 mt-1">✓ Query cancelled.</div>
              <div className="text-green-400">✓ Latency nominal.</div>
              <div className="text-muted mt-3">-- One connection string.</div>
              <div className="text-muted">-- One place to look.</div>
              <div className="text-muted">-- One pg_dump.</div>
              <div className="text-green-400 mt-2 font-bold">
                -- Back to sleep by 3:15.
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </motion.div>
  );
}
