export interface Scenario {
  id: string;
  label: string;
  icon: string;
  replaces: string;
  sql: string;
  comment: string;
}

export const scenarios: Scenario[] = [
  {
    id: "search",
    label: "I need full-text search",
    icon: "",
    replaces: "Elasticsearch",
    sql: `-- You don't need Elasticsearch.
CREATE INDEX ON posts
  USING GIN(to_tsvector('english', content));

SELECT title,
       ts_rank(
         to_tsvector('english', content),
         query
       ) AS rank
FROM posts,
     plainto_tsquery('english', 'database sprawl') query
WHERE to_tsvector('english', content) @@ query
ORDER BY rank DESC;

-- BM25 ranking. Same algorithm Elasticsearch uses.
-- No JVM. No heap tuning. No cluster to manage.`,
    comment:
      "Same BM25 ranking algorithm. Zero additional infrastructure.",
  },
  {
    id: "vectors",
    label: "I need to store AI embeddings",
    icon: "",
    replaces: "Pinecone / Weaviate",
    sql: `-- You don't need Pinecone.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE embeddings (
  id    BIGSERIAL PRIMARY KEY,
  text  TEXT NOT NULL,
  vec   VECTOR(1536)  -- OpenAI dimensions
);

CREATE INDEX ON embeddings
  USING hnsw (vec vector_cosine_ops);

-- Find the 10 most similar documents
SELECT text, vec <=> $1::vector AS distance
FROM embeddings
ORDER BY vec <=> $1::vector
LIMIT 10;

-- HNSW index. Same algorithm. 28x faster than Pinecone.
-- 75% less cost. (Source: Timescale benchmarks)`,
    comment:
      "pgvector + pgvectorscale: HNSW indexing, 28x faster, 75% cheaper.",
  },
  {
    id: "queue",
    label: "I need a message queue",
    icon: "",
    replaces: "Kafka / RabbitMQ",
    sql: `-- You don't need Kafka.
-- (For most use cases. Be honest with yourself.)

-- Producer: notify listeners
SELECT pg_notify(
  'new_orders',
  json_build_object(
    'order_id', 12345,
    'customer', 'angry_developer'
  )::text
);

-- Consumer: listen for events
LISTEN new_orders;
-- Your app receives: {"order_id":12345,...}

-- Need durable queues? Use a table:
CREATE TABLE job_queue (
  id         BIGSERIAL PRIMARY KEY,
  payload    JSONB NOT NULL,
  status     TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  locked_at  TIMESTAMPTZ
);

-- Grab next job (skip locked = no conflicts)
UPDATE job_queue SET status = 'processing',
  locked_at = now()
WHERE id = (
  SELECT id FROM job_queue
  WHERE status = 'pending'
  ORDER BY created_at
  FOR UPDATE SKIP LOCKED
  LIMIT 1
) RETURNING *;`,
    comment:
      "LISTEN/NOTIFY for pub/sub. SKIP LOCKED for job queues. No broker needed.",
  },
  {
    id: "timeseries",
    label: "I need time-series data",
    icon: "",
    replaces: "InfluxDB / TimescaleDB*",
    sql: `-- You don't need InfluxDB.
-- (*TimescaleDB IS Postgres — it's an extension.)

CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE metrics (
  time        TIMESTAMPTZ NOT NULL,
  device_id   INT,
  temperature DOUBLE PRECISION,
  cpu_usage   DOUBLE PRECISION
);

SELECT create_hypertable('metrics', 'time');

-- Automatic partitioning, compression, retention.
-- Query it like any other table:
SELECT time_bucket('5 minutes', time) AS bucket,
       device_id,
       AVG(temperature) AS avg_temp,
       MAX(cpu_usage)   AS peak_cpu
FROM metrics
WHERE time > now() - INTERVAL '24 hours'
GROUP BY bucket, device_id
ORDER BY bucket DESC;

-- Continuous aggregates for dashboards:
CREATE MATERIALIZED VIEW hourly_metrics
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) AS bucket,
       device_id,
       AVG(temperature), MAX(cpu_usage)
FROM metrics
GROUP BY bucket, device_id;`,
    comment:
      "TimescaleDB: time partitioning, compression, continuous aggregates. It's still just Postgres.",
  },
  {
    id: "cache",
    label: "I need caching",
    icon: "",
    replaces: "Redis",
    sql: `-- You (probably) don't need Redis.

-- UNLOGGED tables = no WAL overhead = fast as hell
CREATE UNLOGGED TABLE cache (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL
);

-- Set a cache entry (upsert)
INSERT INTO cache (key, value, expires_at)
VALUES (
  'user:42:profile',
  '{"name":"Dev","rage_level":"maximum"}'::jsonb,
  now() + INTERVAL '1 hour'
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    expires_at = EXCLUDED.expires_at;

-- Get (with expiry check)
SELECT value FROM cache
WHERE key = 'user:42:profile'
  AND expires_at > now();

-- Cleanup expired entries (run via pg_cron)
DELETE FROM cache WHERE expires_at < now();

-- Pair with PgBouncer for connection pooling.
-- Sub-millisecond reads on indexed lookups.`,
    comment:
      "UNLOGGED tables skip WAL for speed. Add PgBouncer for pooling. Done.",
  },
  {
    id: "cron",
    label: "I need to schedule jobs",
    icon: "",
    replaces: "Airflow / Celery",
    sql: `-- You don't need Airflow for this.

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Clean up expired sessions every hour
SELECT cron.schedule(
  'cleanup-sessions',
  '0 * * * *',
  $$DELETE FROM sessions
    WHERE expires_at < now()$$
);

-- Generate daily reports at midnight
SELECT cron.schedule(
  'daily-report',
  '0 0 * * *',
  $$INSERT INTO reports (date, total_orders, revenue)
    SELECT CURRENT_DATE,
           COUNT(*),
           SUM(amount)
    FROM orders
    WHERE created_at >= CURRENT_DATE$$
);

-- List all scheduled jobs
SELECT * FROM cron.job;

-- No separate scheduler. No worker processes.
-- No Redis backend. Just SQL on a schedule.`,
    comment:
      "pg_cron: cron expressions, right inside Postgres. No workers needed.",
  },
  {
    id: "geo",
    label: "I need geospatial queries",
    icon: "",
    replaces: "Specialized GIS",
    sql: `-- PostGIS: the industry standard since 2001.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE restaurants (
  id       SERIAL PRIMARY KEY,
  name     TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326)
);

CREATE INDEX ON restaurants USING GIST(location);

-- Find restaurants within 2km of me
SELECT name,
       ST_Distance(
         location,
         ST_MakePoint(-73.985, 40.748)::geography
       ) AS distance_meters
FROM restaurants
WHERE ST_DWithin(
  location,
  ST_MakePoint(-73.985, 40.748)::geography,
  2000  -- 2km radius
)
ORDER BY distance_meters;

-- Spatial joins, polygon intersections,
-- route calculations, 3D geometry...
-- All in Postgres. Since 2001.`,
    comment:
      "PostGIS powers most of the world's GIS infrastructure. It's a Postgres extension.",
  },
];
