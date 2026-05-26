import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
});

export async function testConnection() {
  try {
    const result = await pool.query<{ current_time: Date }>('SELECT NOW() as current_time');
    console.log('Connected to PostgreSQL');
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

export { pool };
