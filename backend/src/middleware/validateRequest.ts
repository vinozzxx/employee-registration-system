import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { sendValidationError } from '../utils/apiResponse';

/**
 * Factory function that returns an Express middleware for validating request data
 * against a Zod schema.
 *
 * Usage:
 *   router.post('/signup', validateRequest(signupSchema), authController.signup);
 *
 * Principle: Single Responsibility — validation is a separate layer from business logic.
 *            DRY — one validator factory covers all routes.
 *            Separation of Concerns — Zod schemas live in /validators, not in routes.
 */
export type RequestTarget = 'body' | 'query' | 'params';

export function validateRequest(schema: ZodSchema, target: RequestTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      sendValidationError(res, formattedErrors, 'Validation failed');
      return;
    }

    // Replace the request data with the parsed (coerced + sanitized) data
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}
