import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { AuthenticatedRequest, JwtPayload } from '../types';
import { UnauthorizedError } from '../errors/AppError';
import { AUTH } from '../constants';
import { logger } from '../utils/logger';

/**
 * JWT authentication middleware.
 * Validates the Bearer token in the Authorization header.
 * On success: attaches decoded payload to req.user and calls next().
 * On failure: passes an UnauthorizedError to the global error handler.
 *
 * Usage:  router.get('/protected-route', authenticate, controller.action)
 * Principle: SRP — auth concern is fully isolated here, not inside controllers.
 */
export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers[AUTH.HEADER_NAME];

    if (typeof authHeader !== 'string' || !authHeader.startsWith(AUTH.TOKEN_PREFIX)) {
      throw new UnauthorizedError(
        'Authorization header missing or malformed. Expected: Bearer <token>',
      );
    }

    const token = authHeader.slice(AUTH.TOKEN_PREFIX.length);
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

    req.user = payload;
    logger.debug({ userId: payload.userId }, 'Token verified');
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token has expired. Please log in again.'));
    } else if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token. Please log in again.'));
    } else {
      next(err);
    }
  }
}
