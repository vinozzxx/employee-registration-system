/**
 * Application-wide constants.
 * Centralizing magic strings/numbers here enforces DRY and makes
 * global changes a single-file edit.
 * Principle: DRY, Single Source of Truth, KISS.
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const AUTH = {
  SALT_ROUNDS: 12,
  TOKEN_PREFIX: 'Bearer ',
  HEADER_NAME: 'authorization',
} as const;

export const API_PREFIX = '/api/v1';

export const SWAGGER_PATH = '/api-docs';

export const MESSAGES = {
  SERVER_STARTED: (port: number) => `🚀 Server running on http://localhost:${port}`,
  SWAGGER_DOCS: (port: number) => `📚 Swagger UI at http://localhost:${port}/api-docs`,
  DB_CONNECTED: '✅ Database connection established',
  DB_DISCONNECTED: '🔌 Database connection closed',
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized. Please log in.',
  FORBIDDEN: 'Forbidden. You do not have permission.',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'An unexpected error occurred',
} as const;
