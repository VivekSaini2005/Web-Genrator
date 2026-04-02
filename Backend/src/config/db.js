import pg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const { Pool } = pg;

/**
 * PostgreSQL connection pool.
 * Using a pool (not single client) for production-grade connection reuse.
 * Pool automatically manages multiple concurrent DB connections.
 */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Web-Generator",
  password: process.env.DB_PASSWORD,
  port: 5432,

  // Pool configuration for production readiness
  max: 10,              // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,  // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Throw if connection not acquired in 2s
});

/**
 * Verify database connectivity on startup.
 * Runs a lightweight test query and logs the server time.
 * Call this once from index.js during app bootstrap.
 */
export const testDBConnection = async () => {
  let client;
  try {
    client = await pool.connect(); // Acquire a client from the pool
    const result = await client.query("SELECT NOW() AS server_time");
    console.log(
      `✅ PostgreSQL connected — Server time: ${result.rows[0].server_time}`
    );
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    // Do not crash the server — log the error and continue
  } finally {
    if (client) client.release(); // Always release the client back to the pool
  }
};

// Export the pool for use across all models/services
export default pool;
