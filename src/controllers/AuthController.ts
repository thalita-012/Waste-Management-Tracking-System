import type { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';
import type { CreateUserInput, UpdateUserInput } from '../models/User.js';
import type { AuthenticatedRequest } from '../middlewares/AuthMiddleware.js';

export class AuthController {
  // ... register, login, forgotPassword, resetPassword methods stay the same ...

  async updateProfile(req: Request, res: Response) {
    try {
      // Cast to AuthenticatedRequest to get userId
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
  }

  async getProfile(req: Request, res: Response) {
    try {
      // Cast to AuthenticatedRequest to get userId
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
  }
}

export const authController = new AuthController();