import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import type { SignupInput, LoginInput } from '../validators/auth.validator';
import { sendSuccess, sendCreated } from '../utils/apiResponse';

/**
 * AuthController — thin HTTP layer only.
 * Receives pre-validated request data, delegates ALL logic to AuthService,
 * sends the response. No business logic lives here.
 * Principle: SRP, Thin Controller pattern.
 */
export const authController = {
  /**
   * POST /api/auth/signup
   * Handled by: validateRequest(signupSchema) → authController.signup
   */
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as SignupInput;
      const result = await authService.signup(input);
      sendCreated(res, result, 'Account created successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   * Handled by: validateRequest(loginSchema) → authController.login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as LoginInput;
      const result = await authService.login(input);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  },
};
