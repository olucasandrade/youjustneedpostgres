import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalWindow } from "../TerminalWindow";

interface LogEntry {
  id: number;
  time: string;
  service: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "FATAL";
  message: string;
}

interface PgLogEntry {
  id: number;
  time: string;
  message: string;
  level: "ok" | "query" | "result" | "warn" | "error";
}

const SERVICES = [
  "redis",
  "elasticsearch",
  "kafka",
  "mongodb",
  "pinecone",
  "influxdb",
  "api-gateway",
  "auth-service",
  "user-service",
  "postgres",
];

const SPRAWL_TEMPLATES: Array<{
  service: string;
  level: LogEntry["level"];
  msg: string;
}> = [
  { service: "redis", level: "WARN", msg: "Connection pool exhausted, waiting for slot..." },
  { service: "redis", level: "ERROR", msg: "CROSSSLOT Keys in request don't hash to the same slot" },
  { service: "redis", level: "INFO", msg: "Key eviction: 847 keys removed (maxmemory reached)" },
  { service: "redis", level: "DEBUG", msg: "Reconnecting to replica node redis-03:6379..." },
  { service: "elasticsearch", level: "WARN", msg: "High JVM heap pressure: 89% — consider increasing -Xmx" },
  { service: "elasticsearch", level: "ERROR", msg: "CircuitBreakingException: [parent] Data too large" },
  { service: "elasticsearch", level: "INFO", msg: "Shard relocation started: index=users shard=3" },
  { service: "elasticsearch", level: "WARN", msg: "Cluster health changed to YELLOW — 2 unassigned shards" },
  { service: "elasticsearch", level: "DEBUG", msg: "Merging segments [_2a, _2b, _2c] into [_2d]..." },
  { service: "kafka", level: "WARN", msg: "Consumer lag increasing: topic=events partition=7 lag=23847" },
  { service: "kafka", level: "ERROR", msg: "Rebalance triggered: member consumer-3 failed heartbeat" },
  { service: "kafka", level: "INFO", msg: "Offset commit: topic=orders partition=2 offset=184729" },
  { service: "kafka", level: "WARN", msg: "Broker-4 is now the controller. Leadership handoff in progress." },
  { service: "mongodb", level: "ERROR", msg: 'Shard key violation: cannot update field "_id" on sharded collection' },
  { service: "mongodb", level: "WARN", msg: "Slow query: collection=users filter={email:1} 2847ms" },
  { service: "mongodb", level: "INFO", msg: "Chunk migration started: from shard01 to shard02" },
  { service: "mongodb", level: "WARN", msg: "WiredTiger cache is 95% full. Eviction may be aggressive." },
  { service: "pinecone", level: "WARN", msg: "Rate limit approaching: 847/1000 reads/sec used" },
  { service: "pinecone", level: "ERROR", msg: "429 Too Many Requests — throttled for 3200ms" },
  { service: "pinecone", level: "INFO", msg: "Upsert batch: 500 vectors in 1847ms (index=products)" },
  { service: "influxdb", level: "WARN", msg: "Series cardinality exceeded: 1,284,738 series in db=metrics" },
  { service: "influxdb", level: "ERROR", msg: 'Flux query timeout after 30s: from(bucket:"system")' },
  { service: "influxdb", level: "INFO", msg: "Compaction complete: level=2 duration=12.4s" },
  { service: "postgres", level: "INFO", msg: "Checkpoint complete: wrote 2847 buffers (17.3%)" },
  { service: "api-gateway", level: "ERROR", msg: "Upstream timeout: POST /api/search — elasticsearch not responding" },
  { service: "api-gateway", level: "WARN", msg: "Circuit breaker OPEN for service=pinecone (5 failures in 10s)" },
  { service: "api-gateway", level: "INFO", msg: "Rate limit applied: client=app-mobile 429 returned" },
  { service: "auth-service", level: "ERROR", msg: "Redis session lookup failed: ECONNREFUSED redis-02:6379" },
  { service: "auth-service", level: "WARN", msg: "Falling back to database for session validation" },
  { service: "user-service", level: "ERROR", msg: "MongoDB read preference error: no reachable secondary" },
  { service: "user-service", level: "WARN", msg: "Cache miss storm: 847 concurrent requests to /api/users/profile" },
];

// Postgres has errors too — but they're all in ONE place
const PG_TEMPLATES: Array<{ msg: string; level: PgLogEntry["level"] }> = [
  { msg: "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id;", level: "query" },
  { msg: "-> order_id = 12847 (0.8ms)", level: "result" },
  { msg: "ERROR: deadlock detected — Process 12847 waits for ShareLock on transaction 9284", level: "error" },
  { msg: "DETAIL: Process 12847 waits for ShareLock; blocked by process 12901", level: "warn" },
  { msg: "HINT: See server log for query details. Retrying...", level: "warn" },
  { msg: "SELECT * FROM products WHERE embedding <-> $1::vector < 0.3 LIMIT 10;", level: "query" },
  { msg: "-> 10 rows returned (2.1ms, HNSW index scan)", level: "result" },
  { msg: 'WARNING: table "sessions" has 14 dead tuples — consider VACUUM', level: "warn" },
  { msg: "NOTIFY new_order, '{\"id\": 12847}';", level: "query" },
  { msg: "-> NOTIFY sent (0.1ms)", level: "result" },
  { msg: "SELECT time_bucket('5 min', time), avg(cpu) FROM metrics GROUP BY 1;", level: "query" },
  { msg: "-> 288 rows returned (4.3ms, hypertable scan)", level: "result" },
  { msg: "ERROR: canceling statement due to statement timeout (30s)", level: "error" },
  { msg: "SELECT title, ts_rank(search_vec, q) FROM posts, plainto_tsquery($1) q WHERE search_vec @@ q;", level: "query" },
  { msg: "-> 23 rows ranked by BM25 (1.7ms)", level: "result" },
  { msg: "INSERT INTO cache (key, val, ttl) VALUES ($1, $2, now()+'1h') ON CONFLICT (key) DO UPDATE SET val=$2;", level: "query" },
  { msg: "-> UPSERT 1 (0.3ms)", level: "result" },
  { msg: "WARNING: connection pool at 92% capacity (46/50 connections)", level: "warn" },
  { msg: "SELECT ST_Distance(location, ST_MakePoint($1,$2)::geography) FROM restaurants WHERE ST_DWithin(location, ST_MakePoint($1,$2)::geography, 2000);", level: "query" },
  { msg: "-> 7 restaurants within 2km (3.2ms, GIST index)", level: "result" },
  { msg: "Checkpoint complete: wrote 124 buffers (0.8%)", level: "ok" },
  { msg: 'LOG: automatic VACUUM of table "public.events" — 847 tuples removed', level: "ok" },
];

// Logarithmic user steps
const USER_STEPS = [
  1, 2, 5, 10, 25, 50, 100, 250, 500,
  1_000, 2_500, 5_000, 10_000, 25_000, 50_000,
  100_000, 250_000, 500_000, 1_000_000,
];

const POSTGRES_LIMIT_INDEX = USER_STEPS.indexOf(500_000); // 500K = you probably need more

function formatUsers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return String(n);
}

let globalId = 0;
function nextId() {
  return ++globalId;
}

function makeTimestamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;
}

function levelColor(level: LogEntry["level"]) {
  switch (level) {
    case "ERROR":
    case "FATAL":
      return "text-danger";
    case "WARN":
      return "text-amber";
    case "INFO":
      return "text-text-dim";
    case "DEBUG":
      return "text-muted";
  }
}

function pgColor(level: PgLogEntry["level"]) {
  switch (level) {
    case "query":
      return "text-electric";
    case "result":
      return "text-green-400";
    case "ok":
      return "text-text-dim";
    case "warn":
      return "text-amber";
    case "error":
      return "text-danger";
  }
}

export function Simulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [sprawlLogs, setSprawlLogs] = useState<LogEntry[]>([]);
  const [pgLogs, setPgLogs] = useState<PgLogEntry[]>([]);
  const [sprawlErrorCount, setSprawlErrorCount] = useState(0);
  const [pgErrorCount, setPgErrorCount] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const sprawlRef = useRef<HTMLDivElement>(null);
  const pgRef = useRef<HTMLDivElement>(null);
  const pgIndexRef = useRef(0);

  const concurrentUsers = USER_STEPS[sliderIndex];
  const hitLimit = sliderIndex >= POSTGRES_LIMIT_INDEX;

  const addSprawlLog = useCallback(() => {
    const logCount = Math.max(1, Math.ceil(Math.log2(concurrentUsers + 1) * 1.5));
    const newLogs: LogEntry[] = [];
    for (let i = 0; i < logCount; i++) {
      const template = SPRAWL_TEMPLATES[Math.floor(Math.random() * SPRAWL_TEMPLATES.length)];
      newLogs.push({
        id: nextId(),
        time: makeTimestamp(),
        service: template.service,
        level: template.level,
        message: template.msg,
      });
    }
    setSprawlLogs((prev) => [...newLogs, ...prev].slice(0, 80));
    setSprawlErrorCount((prev) => prev + newLogs.filter((l) => l.level === "ERROR" || l.level === "FATAL").length);
  }, [concurrentUsers]);

  const addPgLog = useCallback(() => {
    const template = PG_TEMPLATES[pgIndexRef.current % PG_TEMPLATES.length];
    pgIndexRef.current++;
    const newLog: PgLogEntry = {
      id: nextId(),
      time: makeTimestamp(),
      message: template.msg,
      level: template.level,
    };
    setPgLogs((prev) => [newLog, ...prev].slice(0, 40));
    if (template.level === "error") setPgErrorCount((prev) => prev + 1);
  }, []);

  const startSimulation = useCallback(() => {
    if (hitLimit) return;
    setIsRunning(true);
    setSprawlLogs([]);
    setPgLogs([]);
    setSprawlErrorCount(0);
    setPgErrorCount(0);
    pgIndexRef.current = 0;
  }, [hitLimit]);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // Auto-stop when slider crosses the Postgres limit while running
  useEffect(() => {
    if (isRunning && hitLimit) {
      stopSimulation();
    }
  }, [hitLimit, isRunning, stopSimulation]);

  useEffect(() => {
    if (!isRunning) return;
    const speed = Math.max(60, 300 / Math.log2(concurrentUsers + 2));
    intervalRef.current = setInterval(() => {
      addSprawlLog();
      addPgLog();
    }, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, concurrentUsers, addSprawlLog, addPgLog]);

  // Auto-scroll
  useEffect(() => {
    if (sprawlRef.current) sprawlRef.current.scrollTop = 0;
  }, [sprawlLogs]);
  useEffect(() => {
    if (pgRef.current) pgRef.current.scrollTop = 0;
  }, [pgLogs]);

  // Count unique services with errors in the sprawl logs
  const servicesWithErrors = new Set(
    sprawlLogs.filter((l) => l.level === "ERROR" || l.level === "WARN").map((l) => l.service)
  ).size;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderIndex(Number(e.target.value));
  };

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-text-bright tracking-wide mb-4">
            THE SPRAWL SIMULATOR.
          </h2>
          <p className="text-text-dim text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Same workload. Same errors. The difference? On the left, you're
            grepping through {SERVICES.length} services trying to find the problem. On the right,
            you already know where to look. Scale it up to millions...
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={isRunning ? stopSimulation : startSimulation}
            disabled={hitLimit}
            className={`px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-wide cursor-pointer transition-all duration-300 ${
              hitLimit
                ? "bg-amber/20 border border-amber text-amber cursor-not-allowed opacity-60"
                : isRunning
                  ? "bg-danger/20 border border-danger text-danger hover:bg-danger/30"
                  : "bg-electric/20 border border-electric text-electric hover:bg-electric/30 glow-blue"
            }`}
          >
            {hitLimit ? "⚠ Limit Reached" : isRunning ? "■ Stop" : "▶ Start Simulation"}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted uppercase tracking-widest">Users:</span>
            <input
              type="range"
              min={0}
              max={USER_STEPS.length - 1}
              value={sliderIndex}
              onChange={handleSliderChange}
              className="w-40 sm:w-52 accent-electric"
            />
            <span className={`text-sm font-bold min-w-[4ch] tabular-nums ${
              sliderIndex >= POSTGRES_LIMIT_INDEX ? "text-amber" : "text-electric"
            }`}>
              {formatUsers(concurrentUsers)}
            </span>
          </div>
        </motion.div>

        {/* Hit limit banner */}
        <AnimatePresence>
          {hitLimit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-8 max-w-3xl mx-auto overflow-hidden"
            >
              <div className="border border-amber/40 bg-amber/5 rounded-lg p-5 sm:p-6 text-center">
                <p className="text-amber font-display text-xl sm:text-2xl tracking-wide mb-3">
                  OK, YOU GOT US.
                </p>
                <p className="text-text-dim text-sm sm:text-base leading-relaxed mb-3">
                  At <span className="text-amber font-bold">{formatUsers(concurrentUsers)}+ concurrent users</span>,
                  you're in the top 0.01% of applications on the planet.
                  At this scale, you probably do need Kafka for event streaming,
                  a dedicated search cluster, and maybe even a specialized vector DB.
                </p>
                <p className="text-text text-sm sm:text-base font-medium">
                  But you're reading a rant website. You're not there yet.{" "}
                  <span className="text-electric">Just use Postgres.</span>
                </p>
                <button
                  onClick={() => {
                    setSliderIndex(3); // reset to 10 users
                  }}
                  className="mt-4 px-4 py-2 rounded-lg border border-electric/40 text-electric text-xs font-mono hover:bg-electric/10 transition-colors cursor-pointer"
                >
                  ← Back to reality
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats bar */}
        <AnimatePresence>
          {(sprawlLogs.length > 0 || pgLogs.length > 0) && !hitLimit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-6 text-center"
            >
              <div>
                <div className="text-xs text-muted uppercase tracking-widest">Concurrent users</div>
                <div className="font-display text-2xl text-text-bright">{formatUsers(concurrentUsers)}</div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase tracking-widest">Services to debug</div>
                <div className="font-display text-2xl text-danger">{servicesWithErrors || SERVICES.length}</div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase tracking-widest">Sprawl errors</div>
                <div className="font-display text-2xl text-danger">{sprawlErrorCount}</div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase tracking-widest">PG errors</div>
                <div className="font-display text-2xl text-amber">{pgErrorCount}</div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase tracking-widest">PG services to debug</div>
                <div className="font-display text-2xl text-electric">1</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side-by-side terminals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sprawl side */}
          <div>
            <div className="text-xs uppercase tracking-widest text-danger mb-2 font-bold">
              {SERVICES.length} services — where's the bug?
            </div>
            <TerminalWindow title="tail -f /var/log/*.log" className={sprawlErrorCount > 5 ? "glow-red" : ""}>
              <div
                ref={sprawlRef}
                className="h-[350px] sm:h-[400px] overflow-y-auto text-[10px] sm:text-[11px] space-y-0.5 font-mono"
              >
                {sprawlLogs.length === 0 ? (
                  <div className="text-muted text-center py-16">
                    Press "Start Simulation" to begin...
                  </div>
                ) : (
                  sprawlLogs.map((log) => (
                    <div key={log.id} className="flex gap-2 leading-tight whitespace-nowrap">
                      <span className="text-muted shrink-0">{log.time}</span>
                      <span className={`shrink-0 w-[42px] font-bold ${levelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="text-pg-blue shrink-0">[{log.service}]</span>
                      <span className="text-text-dim truncate">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </TerminalWindow>
          </div>

          {/* Postgres side */}
          <div>
            <div className="text-xs uppercase tracking-widest text-electric mb-2 font-bold">
              Just Postgres — same workload, one place to look:
            </div>
            <TerminalWindow title="psql — all workloads" className={pgErrorCount > 0 ? "glow-blue" : ""}>
              <div
                ref={pgRef}
                className="h-[350px] sm:h-[400px] overflow-y-auto text-[10px] sm:text-[11px] space-y-0.5 font-mono"
              >
                {pgLogs.length === 0 ? (
                  <div className="text-muted text-center py-16">
                    Waiting...
                  </div>
                ) : (
                  pgLogs.map((log) => (
                    <div key={log.id} className="leading-tight">
                      <span className="text-muted mr-2">{log.time}</span>
                      <span className={pgColor(log.level)}>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </TerminalWindow>
          </div>
        </div>

        {/* Punchline */}
        <AnimatePresence>
          {sprawlErrorCount >= 5 && !hitLimit && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6 text-sm text-amber max-w-xl mx-auto"
            >
              Both sides have errors. Both sides have bugs. The difference?{" "}
              <span className="text-danger font-bold">{servicesWithErrors} services</span> to grep through
              vs. <span className="text-electric font-bold">1 database</span> to check.{" "}
              {concurrentUsers >= 10_000
                ? "Still one connection string."
                : "Try cranking up the users."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
