/**
 * Shared TypeScript types for the frontend.
 * Domain types are derived from the API contract defined in PROJECT_BLUEPRINT.md.
 * Principle: DRY, Single Source of Truth — one type definition, used everywhere.
 *
 * NOTE: These types mirror the backend API response shapes.
 *       They are defined here separately from the backend so the frontend
 *       can evolve independently (frontend/backend separation of concerns).
 */

// -------------------------------------------------------
// API Response Envelope
// -------------------------------------------------------

/** Mirrors the backend ApiResponse<T> envelope from utils/apiResponse.ts */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
  statusCode: number;
  timestamp: string;
}

// -------------------------------------------------------
// Auth Types (Phase 3)
// -------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthTokens {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthData {
  user: User;
  token: string;
}

// -------------------------------------------------------
// Employee Types (Refactored from Registration)
// -------------------------------------------------------

export interface Employee {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  contact: string;
  gender: string;
  department: string;
  designation: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdByUserId: string;
  updatedByUserId: string | null;
  deletedAt: string | null;
  deletedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName?: string;
  email: string;
  contact: string;
  gender: string;
  department: string;
  designation: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  contact?: string;
  gender?: string;
  department?: string;
  designation?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

// -------------------------------------------------------
// UI Types
// -------------------------------------------------------

export interface SelectOption {
  label: string;
  value: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PaginatedEmployees = PaginatedResult<Employee>;
