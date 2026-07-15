import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { config } from '../config';
import { HTTP_STATUS, MESSAGES } from '../constants';

/**
 * Global error handling middleware.
 * Must be the LAST middleware registered in app.ts (Express convention).
 *
 * Handles:
 * - AppError subclasses (operational errors) → structured response
 * - Prisma errors → translated to readable messages (Phase 2+)
 * - Unknown errors → generic 500 with stack in development only
 *
 * Principle: Single Responsibility, Separation of Concerns, Fail-safe defaults.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Operational errors (our own AppError subclasses)
  if (err instanceof AppError) {
    logger.warn(
      { statusCode: err.statusCode, message: err.message, path: req.path },
      'Operational error',
    );

    sendError(res, err.message, err.statusCode, config.isDevelopment ? err.stack : undefined);
    return;
  }

  // Unexpected / programming errors
  logger.error({ err, path: req.path, method: req.method }, 'Unexpected error');

  sendError(
    res,
    MESSAGES.INTERNAL_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    config.isDevelopment ? err.stack : undefined,
  );
}

/**
 * Catches requests that don't match any registered route.
 * Register this BEFORE the errorHandler.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const err = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND,
  );
  next(err);
}
