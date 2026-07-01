import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// export const db = drizzle(process.env.DATABASE_URL!);

import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let pool: Pool;
let db: NodePgDatabase;

export async function initDb(): Promise<NodePgDatabase> {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();

    pool.on('error', (err) => {
      console.error('❌ Unexpected database error (connection lost?):', err.message);
    });

    db = drizzle(pool);
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    throw new Error(`Database connection failed: ${(error as Error).message}`);
  }
}

export function getDb(): NodePgDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export async function closeDb(): Promise<void> {
  try {
    await pool.end();
    console.log('🔌 Database connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
}