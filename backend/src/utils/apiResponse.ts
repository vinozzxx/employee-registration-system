import type { Response } from 'express';
import { HTTP_STATUS } from '../constants';

/**
 * Standardized API response envelope.
 * Every endpoint in the system returns this shape — guaranteed by TypeScript generics.
 * Principle: DRY, Consistency — frontend can always rely on the same response structure.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
  errors?: { field: string; message: string }[];
  statusCode: number;
  timestamp: string;
}

/**
 * Sends a successful JSON response with a consistent envelope.
 *
 * @param res     - Express Response object
 * @param data    - Payload to send
 * @param message - Human-readable success message
 * @param statusCode - HTTP status code (default: 200)
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = HTTP_STATUS.OK,
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

/**
 * Sends an error JSON response with a consistent envelope.
 *
 * @param res     - Express Response object
 * @param message - Human-readable error message
 * @param statusCode - HTTP status code (default: 500)
 * @param error   - Optional detailed error info (omitted in production)
 */
export function sendError(
  res: Response,
  message = 'Internal server error',
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  error?: string | Record<string, unknown>,
): void {
  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(error !== undefined && { error }),
  };
  res.status(statusCode).json(response);
}

/**
 * Sends a validation error response with structured error array.
 */
export function sendValidationError(
  res: Response,
  errors: { field: string; message: string }[],
  message = 'Validation failed',
): void {
  const response: ApiResponse<null> = {
    success: false,
    message,
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errors,
    timestamp: new Date().toISOString(),
  };
  res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
}

/**
 * Sends a 201 Created response — convenience wrapper for POST endpoints.
 */
export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): void {
  sendSuccess(res, data, message, HTTP_STATUS.CREATED);
}

/**
 * Sends a 204 No Content response — convenience wrapper for DELETE endpoints.
 */
export function sendNoContent(res: Response): void {
  res.status(HTTP_STATUS.NO_CONTENT).send();
}
