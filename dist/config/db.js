"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.pool = void 0;
const pg_1 = require("pg");
const env_js_1 = require("./env.js");
exports.pool = new pg_1.Pool({
    host: env_js_1.env.database.host,
    port: env_js_1.env.database.port,
    user: env_js_1.env.database.user,
    password: env_js_1.env.database.password,
    database: env_js_1.env.database.name,
});
const testConnection = async () => {
    try {
        await exports.pool.query('SELECT NOW()');
        console.log('PostgreSQL connected successfully');
        return true;
    }
    catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};
exports.testConnection = testConnection;
//# sourceMappingURL=db.js.map