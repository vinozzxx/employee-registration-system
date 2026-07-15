/**
 * Frontend application configuration.
 * Reads Vite environment variables and exposes them as a typed config object.
 * No component should read import.meta.env directly.
 * Principle: Single Source of Truth, DRY.
 */
export const config = {
  apiUrl: import.meta.env['VITE_API_URL'] as string,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export type FrontendConfig = typeof config;
