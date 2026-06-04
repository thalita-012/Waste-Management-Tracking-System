import { Pool } from 'pg';
import { env } from './env.js';
const pool = new Pool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
});
export async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('Connected to PostgreSQL');
        return true;
    }
    catch (error) {
        console.error('Connection failed:', error);
        return false;
    }
}
export { pool };
//# sourceMappingURL=db.js.map