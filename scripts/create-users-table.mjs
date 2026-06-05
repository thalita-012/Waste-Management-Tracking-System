import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const sql = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  phone_number TEXT,
  address TEXT,
  profile_picture TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  password_reset_token TEXT,
  password_reset_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

async function run() {
  try {
    await pool.query(sql);
    console.log('Created `users` table (if it did not exist).');
    process.exit(0);
  } catch (err) {
    console.error('Error creating users table:', err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
