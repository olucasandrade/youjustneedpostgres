import { useState } from "react";
import { motion } from "framer-motion";

interface Row {
  need: string;
  tool: string;
  postgres: string;
  same: boolean;
  algo: string;
}

const rows: Row[] = [
  {
    need: "Full-text search",
    tool: "Elasticsearch",
    postgres: "tsvector + pg_search / BM25",
    same: true,
    algo: "BM25",
  },
  {
    need: "Vector / AI search",
    tool: "Pinecone, Weaviate",
    postgres: "pgvector + pgvectorscale",
    same: true,
    algo: "HNSW / DiskANN",
  },
  {
    need: "Caching",
    tool: "Redis",
    postgres: "UNLOGGED TABLE + pooling",
    same: true,
    algo: "In-memory",
  },
  {
    need: "Documents / JSON",
    tool: "MongoDB",
    postgres: "JSONB with GIN indexes",
    same: true,
    algo: "Same indexing",
  },
  {
    need: "Message queue",
    tool: "Kafka, RabbitMQ",
    postgres: "LISTEN/NOTIFY + pg_partman",
    same: true,
    algo: "For most use cases",
  },
  {
    need: "Time-series",
    tool: "InfluxDB",
    postgres: "TimescaleDB extension",
    same: true,
    algo: "Time partitioning",
  },
  {
    need: "Geospatial",
    tool: "Specialized GIS",
    postgres: "PostGIS",
    same: true,
    algo: "Industry standard since 2001",
  },
  {
    need: "Scheduled jobs",
    tool: "Airflow, Celery",
    postgres: "pg_cron",
    same: true,
    algo: "Cron",
  },
  {
    need: "Key-value store",
    tool: "DynamoDB",
    postgres: "Simple table + index",
    same: true,
    algo: "B-tree",
  },
];

export function ComparisonTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto rounded-xl border border-dark-border">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="bg-dark-card border-b border-dark-border">
            <th className="text-left py-3 px-3 sm:px-4 text-text-dim font-normal uppercase tracking-wider text-[10px] sm:text-xs">
              What you need
            </th>
            <th className="text-left py-3 px-3 sm:px-4 text-text-dim font-normal uppercase tracking-wider text-[10px] sm:text-xs">
              "Specialized" tool
            </th>
            <th className="text-left py-3 px-3 sm:px-4 text-text-dim font-normal uppercase tracking-wider text-[10px] sm:text-xs">
              Postgres can do it
            </th>
            <th className="text-center py-3 px-3 sm:px-4 text-text-dim font-normal uppercase tracking-wider text-[10px] sm:text-xs">
              Same algo?
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row.need}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="border-b border-dark-border/50 transition-colors duration-200"
              style={{
                backgroundColor:
                  hoveredRow === i
                    ? "rgba(0, 168, 255, 0.06)"
                    : "transparent",
              }}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="py-2.5 px-3 sm:px-4 text-text-bright font-medium">
                {row.need}
              </td>
              <td className="py-2.5 px-3 sm:px-4 text-text-dim line-through decoration-danger/40">
                {row.tool}
              </td>
              <td className="py-2.5 px-3 sm:px-4 text-electric">
                {row.postgres}
              </td>
              <td className="py-2.5 px-3 sm:px-4 text-center">
                {row.same ? (
                  <span className="text-green-400" title={row.algo}>
                   {row.algo}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
