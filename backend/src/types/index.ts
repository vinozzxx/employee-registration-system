/**
 * Shared TypeScript types and interfaces for the backend.
 * Centralizing types here prevents duplication across layers.
 * Principle: DRY, Single Source of Truth.
 *
 * NOTE: Domain model types (User, Registration) will be added in Phase 2
 * once Prisma models are defined. Prisma auto-generates model types from the schema.
 */

import type { Request } from 'express';

/**
 * Extends Express Request to include the authenticated user's payload
 * after JWT verification middleware runs.
 * Populated in Phase 3 (Authentication).
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Shape of the decoded JWT payload.
 * Defined here so both the JWT middleware and controllers share the same type.
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Generic paginated response wrapper.
 * Used by list endpoints to return paginated data with metadata.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Query parameters for list endpoints.
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
