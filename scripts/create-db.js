import 'dotenv/config';
import mysql from 'mysql2/promise';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'wmts';

async function createDb() {
  try {
    const conn = await mysql.createConnection({ host, port, user, password });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Database '${dbName}' ensured.`);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed to create database:', err);
    process.exit(1);
  }
}

createDb();
