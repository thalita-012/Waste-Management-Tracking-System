import { Pool } from 'pg';
import { env } from './env.js';
/**
 * PostgreSQL connection pool
 */
export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
});
/**
 * Test database connection
 */
export const testConnection = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL connected successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};
//# sourceMappingURL=db.js.map