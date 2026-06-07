"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_js_1 = require("../repositories/UserRepository.js");
const passwordPolicy_js_1 = require("../utils/passwordPolicy.js");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;
class AuthService {
    async register(input) {
        try {
            const passwordStrength = (0, passwordPolicy_js_1.validatePasswordStrength)(input.password);
            if (!passwordStrength.isStrong) {
                return {
                    success: false,
                    message: passwordStrength.message,
                    error: 'Weak password'
                };
            }
            // Check if user already exists
            const existingUser = await UserRepository_js_1.userRepository.findByEmail(input.email);
            if (existingUser) {
                return {
                    success: false,
                    message: 'User already exists',
                    error: 'Email is already registered'
                };
            }
            // Hash password
            const password_hash = await bcrypt_1.default.hash(input.password, SALT_ROUNDS);
            // Create user
            const user = await UserRepository_js_1.userRepository.create({
                ...input,
                password_hash
            });
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            const { password_hash: _, ...userWithoutPassword } = user;
            return {
                success: true,
                message: 'Account created successfully',
                token,
                user: userWithoutPassword
            };
        }
        catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Registration failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async login(email, password) {
        try {
            // Find user by email
            const user = await UserRepository_js_1.userRepository.findByEmail(email);
            if (!user) {
                return {
                    success: false,
                    message: 'We could not find an account for this email. Create an account to get started.',
                    error: 'User not found'
                };
            }
            // Verify password
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'The password does not match this account. Please try again.',
                    error: 'Incorrect password'
                };
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            const { password_hash: _, ...userWithoutPassword } = user;
            return {
                success: true,
                message: 'Login successful',
                token,
                user: userWithoutPassword
            };
        }
        catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Login failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async requestPasswordReset(email) {
        try {
            const user = await UserRepository_js_1.userRepository.findByEmail(email);
            if (!user) {
                return {
                    success: false,
                    message: 'If a matching account exists, a reset token has been sent.',
                };
            }
            const resetToken = node_crypto_1.default.randomBytes(20).toString('hex');
            const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
            await UserRepository_js_1.userRepository.updatePasswordResetToken(user.id, resetToken, expiresAt);
            return {
                success: true,
                message: 'Password reset token created successfully',
                token: resetToken,
                user: { email: user.email }
            };
        }
        catch (error) {
            console.error('Password reset request error:', error);
            return {
                success: false,
                message: 'Unable to create password reset token',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async resetPassword(token, password) {
        try {
            const passwordStrength = (0, passwordPolicy_js_1.validatePasswordStrength)(password);
            if (!passwordStrength.isStrong) {
                return {
                    success: false,
                    message: passwordStrength.message,
                    error: 'Weak password'
                };
            }
            const user = await UserRepository_js_1.userRepository.findByResetToken(token);
            if (!user) {
                return {
                    success: false,
                    message: 'Invalid or expired reset token',
                    error: 'Token invalid'
                };
            }
            const password_hash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
            const updatedUser = await UserRepository_js_1.userRepository.resetPassword(user.id, password_hash);
            const { password_hash: _, ...userWithoutPassword } = updatedUser;
            return {
                success: true,
                message: 'Password has been reset successfully',
                user: userWithoutPassword
            };
        }
        catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                message: 'Password reset failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async updateProfile(userId, input) {
        try {
            const user = await UserRepository_js_1.userRepository.update(userId, input);
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
                user: userWithoutPassword
            };
        }
        catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                message: 'Profile update failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    async getUserProfile(userId) {
        try {
            const user = await UserRepository_js_1.userRepository.findById(userId);
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
                user: userWithoutPassword
            };
        }
        catch (error) {
            console.error('Fetch profile error:', error);
            return {
                success: false,
                message: 'Failed to fetch profile',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return decoded;
        }
        catch (error) {
            console.error('Token verification error:', error);
            return null;
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=AuthService.js.map