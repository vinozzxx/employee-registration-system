/**
 * Frontend-wide constants.
 * Route paths, storage keys, UI strings — all in one place.
 * Principle: DRY, Single Source of Truth — changing a route path is a one-line edit.
 */

/** Route paths — use these in <Link to={ROUTES.LOGIN}> instead of string literals. */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  REGISTRATIONS: '/dashboard/registrations',
} as const;

/** localStorage keys */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'erms_auth_token',
  USER: 'erms_user',
} as const;

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50],
} as const;

/** API endpoint paths */
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
  },
  REGISTRATIONS: {
    LIST: '/registrations',
    CREATE: '/registrations',
    DELETE: (id: string) => `/registrations/${id}`,
  },
  HEALTH: '/health',
} as const;

/** UI messages */
export const MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  REGISTRATION_CREATED: 'Employee registered successfully.',
  REGISTRATION_DELETED: 'Registration deleted successfully.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
} as const;
