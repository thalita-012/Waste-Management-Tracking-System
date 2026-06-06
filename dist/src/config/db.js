import mysql from 'mysql2/promise';
import { env } from './env.js';
if (!env.database.url) {
    throw new Error('DATABASE_URL is not defined');
}
export const pool = mysql.createPool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
    connectionLimit: 10
});
export const testConnection = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('MySQL connected successfully');
        return true;
    }
    catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};
