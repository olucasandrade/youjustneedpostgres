export interface Extension {
  name: string;
  description: string;
  install: string;
  color: string;
  category: string;
}

export const extensions: Extension[] = [
  {
    name: "pgvector",
    description: "Vector similarity search for AI embeddings. HNSW and IVFFlat indexing.",
    install: "CREATE EXTENSION vector;",
    color: "#a855f7",
    category: "AI / ML",
  },
  {
    name: "pgvectorscale",
    description: "High-performance streaming DiskANN for billion-scale vector search.",
    install: "CREATE EXTENSION vectorscale;",
    color: "#8b5cf6",
    category: "AI / ML",
  },
  {
    name: "TimescaleDB",
    description: "Time-series superpowers: hypertables, compression, continuous aggregates.",
    install: "CREATE EXTENSION timescaledb;",
    color: "#fdb515",
    category: "Time-Series",
  },
  {
    name: "PostGIS",
    description: "Industry-standard geospatial. Points, polygons, routes, 3D geometry.",
    install: "CREATE EXTENSION postgis;",
    color: "#4ade80",
    category: "Geospatial",
  },
  {
    name: "pg_cron",
    description: "Cron-based job scheduling, right inside your database. No workers.",
    install: "CREATE EXTENSION pg_cron;",
    color: "#38bdf8",
    category: "Operations",
  },
  {
    name: "pg_partman",
    description: "Automatic table partitioning. Time-based, serial-based, or custom.",
    install: "CREATE EXTENSION pg_partman;",
    color: "#2dd4bf",
    category: "Operations",
  },
  {
    name: "pg_search",
    description: "BM25 full-text search with scoring, highlighting, and fuzzy matching.",
    install: "-- Built-in: tsvector + tsquery\n-- Or: CREATE EXTENSION pg_search;",
    color: "#fb923c",
    category: "Search",
  },
  {
    name: "pgaudit",
    description: "Detailed session and object audit logging for compliance and security.",
    install: "CREATE EXTENSION pgaudit;",
    color: "#f87171",
    category: "Security",
  },
  {
    name: "Citus",
    description: "Horizontal sharding and distributed queries. For when you truly need scale.",
    install: "CREATE EXTENSION citus;",
    color: "#60a5fa",
    category: "Scale",
  },
];
