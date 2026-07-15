import pino from 'pino';
import { config } from '../config';

/**
 * Pino logger instance — configured once and exported as a singleton.
 * In development: pretty-printed output with timestamps and colors.
 * In production: structured JSON output for log aggregation (e.g., Datadog, Loki).
 * Principle: Separation of Concerns — logging is a cross-cutting concern handled in one place.
 */
export const logger = pino({
  level: config.logLevel,
  ...(config.isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '{msg}',
          },
        },
      }
    : {
        // Production: structured JSON with all fields
        formatters: {
          level: (label: string): { level: string } => ({ level: label }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      }),
});

export type Logger = typeof logger;
