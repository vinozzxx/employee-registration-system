/// <reference types="vite/client" />

/**
 * Type declarations for Vite environment variables.
 * All VITE_ prefixed variables must be declared here to get TypeScript support.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
