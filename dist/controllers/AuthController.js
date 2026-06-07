"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_js_1 = require("../services/AuthService.js");
class AuthController {
    async register(req, res) {
        try {
            const { full_name, email, password, phone_number, address, profile_picture, latitude, longitude } = req.body;
            // Validate required fields
            if (!full_name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }
            const input = {
                full_name,
                email,
                password,
                phone_number,
                address,
                profile_picture,
                latitude,
                longitude
            };
            const result = await AuthService_js_1.authService.register(input);
            const statusCode = result.success ? 201 : 400;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }
            const result = await AuthService_js_1.authService.login(email, password);
            const statusCode = result.success ? 200 : 401;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }
            const result = await AuthService_js_1.authService.requestPasswordReset(email);
            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Reset token and new password are required'
                });
            }
            const result = await AuthService_js_1.authService.resetPassword(token, password);
            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.userId;
            const { full_name, phone_number, address, profile_picture, latitude, longitude } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }
            const input = {
                full_name,
                phone_number,
                address,
                profile_picture,
                latitude,
                longitude
            };
            const result = await AuthService_js_1.authService.updateProfile(userId, input);
            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async getProfile(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }
            const result = await AuthService_js_1.authService.getUserProfile(userId);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=AuthController.js.map