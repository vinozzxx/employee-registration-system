import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler to properly catch rejected promises
 * and pass them to the Express next() function.
 * This ensures that errors are routed to the global error handler
 * without causing Unhandled Promise Rejections.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
