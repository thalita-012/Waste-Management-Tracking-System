import { pool } from '../config/db.js';
export class UserRepository {
    async findByEmail(email) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0] || null;
        }
        catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0] || null;
        }
        catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }
    async create(input) {
        try {
            const { full_name, email, password_hash, phone_number, address, profile_picture, latitude, longitude } = input;
            const [result] = await pool.query(`INSERT INTO users (full_name, email, password_hash, phone_number, address, profile_picture, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [full_name, email, password_hash, phone_number, address, profile_picture, latitude, longitude]);
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            return rows[0];
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
    async update(id, input) {
        try {
            const { full_name, phone_number, address, profile_picture, latitude, longitude } = input;
            await pool.query(`UPDATE users SET
          full_name = COALESCE(?, full_name),
          phone_number = COALESCE(?, phone_number),
          address = COALESCE(?, address),
          profile_picture = COALESCE(?, profile_picture),
          latitude = COALESCE(?, latitude),
          longitude = COALESCE(?, longitude),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`, [full_name, phone_number, address, profile_picture, latitude, longitude, id]);
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0] || null;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
    async updatePasswordResetToken(userId, token, expiresAt) {
        try {
            await pool.query(`UPDATE users SET password_reset_token = ?, password_reset_expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [token, expiresAt, userId]);
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
            return rows[0] || null;
        }
        catch (error) {
            console.error('Error updating reset token:', error);
            throw error;
        }
    }
    async findByResetToken(token) {
        try {
            const [rows] = await pool.query(`SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires_at > NOW()`, [token]);
            return rows[0] || null;
        }
        catch (error) {
            console.error('Error finding user by reset token:', error);
            throw error;
        }
    }
    async resetPassword(userId, password_hash) {
        try {
            await pool.query(`UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [userId, password_hash]);
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
            return rows[0] || null;
        }
        catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
            return result.affectedRows > 0;
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}
export const userRepository = new UserRepository();
