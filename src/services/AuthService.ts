import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/UserRepository.js';
import type { CreateUserInput, UpdateUserInput, User, AuthResponse } from '../models/User.js';
import { validatePasswordStrength } from '../utils/passwordPolicy.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export class AuthService {
  async register(input: CreateUserInput): Promise<AuthResponse> {
    try {
      const passwordStrength = validatePasswordStrength(input.password);
      if (!passwordStrength.isStrong) {
        return {
          success: false,
          message: passwordStrength.message,
          error: 'Weak password'
        };
      }

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(input.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
          error: 'Email is already registered'
        };
      }

      // Hash password
      const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS);

      // Create user
      const user = await userRepository.create({
        ...input,
        password_hash
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password_hash: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Account created successfully',
        token,
        user: userWithoutPassword as Omit<User, 'password_hash'>
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'We could not find an account for this email. Create an account to get started.',
          error: 'User not found'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'The password does not match this account. Please try again.',
          error: 'Incorrect password'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password_hash: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Login successful',
        token,
        user: userWithoutPassword as Omit<User, 'password_hash'>
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'If a matching account exists, a reset token has been sent.',
        };
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

      await userRepository.updatePasswordResetToken(user.id, resetToken, expiresAt);

      return {
        success: true,
        message: 'Password reset token created successfully',
        token: resetToken,
        user: { email: user.email } as any
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Unable to create password reset token',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const passwordStrength = validatePasswordStrength(password);
      if (!passwordStrength.isStrong) {
        return {
          success: false,
          message: passwordStrength.message,
          error: 'Weak password'
        };
      }

      const user = await userRepository.findByResetToken(token);
      if (!user) {
        return {
          success: false,
          message: 'Invalid or expired reset token',
          error: 'Token invalid'
        };
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      const updatedUser = await userRepository.resetPassword(user.id, password_hash);
      const { password_hash: _, ...userWithoutPassword } = updatedUser as User;

      return {
        success: true,
        message: 'Password has been reset successfully',
        user: userWithoutPassword as Omit<User, 'password_hash'>
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Password reset failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateProfile(userId: number, input: UpdateUserInput): Promise<AuthResponse> {
    try {
      const user = await userRepository.update(userId, input);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: 'Unable to update profile'
        };
      }

      const { password_hash: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Profile updated successfully',
        user: userWithoutPassword as Omit<User, 'password_hash'>
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Profile update failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getUserProfile(userId: number): Promise<AuthResponse> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          error: 'Unable to fetch profile'
        };
      }

      const { password_hash: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Profile fetched successfully',
        user: userWithoutPassword as Omit<User, 'password_hash'>
      };
    } catch (error) {
      console.error('Fetch profile error:', error);
      return {
        success: false,
        message: 'Failed to fetch profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  verifyToken(token: string): { id: number; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
