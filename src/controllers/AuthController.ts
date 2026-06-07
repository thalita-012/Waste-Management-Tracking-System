import { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';
import { CreateUserInput, UpdateUserInput } from '../models/User.js';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware.js';

export class AuthController {
  // Explicitly type the methods as properties with arrow functions
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { full_name, email, password, phone_number, address, profile_picture, latitude, longitude } = req.body;

      if (!full_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const input: CreateUserInput = {
        full_name,
        email,
        password,
        phone_number,
        address,
        profile_picture,
        latitude,
        longitude
      };

      const result = await authService.register(input);
      const statusCode = result.success ? 201 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.login(email, password);
      const statusCode = result.success ? 200 : 401;
      return res.status(statusCode).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const result = await authService.requestPasswordReset(email);
      const statusCode = result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Reset token and new password are required'
        });
      }

      const result = await authService.resetPassword(token, password);
      const statusCode = result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const { full_name, phone_number, address, profile_picture, latitude, longitude } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const input: UpdateUserInput = {
        full_name,
        phone_number,
        address,
        profile_picture,
        latitude,
        longitude
      };

      const result = await authService.updateProfile(userId, input);
      const statusCode = result.success ? 200 : 400;
      return res.status(statusCode).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthenticatedRequest).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const result = await authService.getUserProfile(userId);
      const statusCode = result.success ? 200 : 404;
      return res.status(statusCode).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

// Export a single instance
export const authController = new AuthController();