import { HTTP_STATUS } from '../constants';

/**
 * Base application error class.
 * All custom errors extend this class to ensure consistent error handling
 * in the global error handler middleware.
 * Principle: Single Responsibility, Open/Closed (extend don't modify).
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request — invalid input from the client.
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

/**
 * 401 Unauthorized — missing or invalid authentication.
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

/**
 * 403 Forbidden — authenticated but lacks permission.
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

/**
 * 404 Not Found — requested resource does not exist.
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

/**
 * 409 Conflict — e.g., duplicate email on signup.
 */
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

/**
 * 422 Unprocessable Entity — semantically invalid request.
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }
}

/**
 * 500 Internal Server Error — unexpected server-side failure.
 * isOperational = false signals the error handler to restart the process.
 */
export class InternalError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
  }
}
