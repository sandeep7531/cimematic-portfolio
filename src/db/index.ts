import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

/**
 * Lazily initialize the Postgres pool on first use.
 *
 * The module previously threw at import time when DATABASE_URL was missing,
 * which broke `next build` ("Failed to collect page data for /api/health")
 * even though the database is not used by any page. With lazy init the build
 * succeeds without a .env; requests that actually need the DB will fail at
 * runtime and be handled by their own error handling (e.g. /api/health
 * returns 500).
 */
function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  return pool;
}

let _db: ReturnType<typeof drizzle> | null = null;

/** Lazily create the Drizzle instance on first use (also caches it). */
export function getDb() {
  if (!_db) {
    _db = drizzle(getPool());
  }
  return _db;
}

