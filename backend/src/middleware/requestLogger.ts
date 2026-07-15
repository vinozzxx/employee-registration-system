import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * HTTP request logging middleware using Pino.
 * Logs every incoming request with method, URL, status, and response time.
 * Principle: Separation of Concerns — logging is not mixed into business logic.
 *            Observability — structured logs are machine-parseable in production.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logPayload = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 500) {
      logger.error(logPayload, 'Request completed with server error');
    } else if (res.statusCode >= 400) {
      logger.warn(logPayload, 'Request completed with client error');
    } else {
      logger.info(logPayload, 'Request completed');
    }
  });

  next();
}
