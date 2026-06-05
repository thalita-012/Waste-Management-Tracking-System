import type { User, CreateUserInput, UpdateUserInput } from '../models/User.js';
import { pool } from '../config/db.js';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const result = await pool.query<User>('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  async create(input: CreateUserInput & { password_hash: string }): Promise<User> {
    try {
      const { full_name, email, password_hash, phone_number, address, profile_picture, latitude, longitude } = input;
      const result = await pool.query<User>(
        `INSERT INTO users (full_name, email, password_hash, phone_number, address, profile_picture, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [full_name, email, password_hash, phone_number, address, profile_picture, latitude, longitude]
      );
      return result.rows[0] as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: number, input: UpdateUserInput): Promise<User | null> {
    try {
      const { full_name, phone_number, address, profile_picture, latitude, longitude } = input;
      const result = await pool.query<User>(
        `UPDATE users SET
          full_name = COALESCE($2, full_name),
          phone_number = COALESCE($3, phone_number),
          address = COALESCE($4, address),
          profile_picture = COALESCE($5, profile_picture),
          latitude = COALESCE($6, latitude),
          longitude = COALESCE($7, longitude),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id, full_name, phone_number, address, profile_picture, latitude, longitude]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async updatePasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<User | null> {
    try {
      const result = await pool.query<User>(
        `UPDATE users SET password_reset_token = $2, password_reset_expires_at = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [userId, token, expiresAt]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating reset token:', error);
      throw error;
    }
  }

  async findByResetToken(token: string): Promise<User | null> {
    try {
      const result = await pool.query<User>(
        `SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires_at > NOW()`,
        [token]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by reset token:', error);
      throw error;
    }
  }

  async resetPassword(userId: number, password_hash: string): Promise<User | null> {
    try {
      const result = await pool.query<User>(
        `UPDATE users SET password_hash = $2, password_reset_token = NULL, password_reset_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [userId, password_hash]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const userRepository = new UserRepository();
