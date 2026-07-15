import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { MESSAGES } from './constants';

/**
 * Server entry point.
 * Only responsibility: start the HTTP server on the configured port.
 * All Express app setup lives in app.ts (Separation of Concerns).
 *
 * Handles unhandled promise rejections and uncaught exceptions at the
 * process level to prevent silent crashes in production.
 */

const server = app.listen(config.port, () => {
  logger.info(MESSAGES.SERVER_STARTED(config.port));
  logger.info(MESSAGES.SWAGGER_DOCS(config.port));
  logger.info(`Environment: ${config.nodeEnv}`);
});

/**
 * Graceful shutdown handler.
 * Stops accepting new connections, closes idle keep-alive connections,
 * waits for active requests to complete, then exits cleanly.
 */
function gracefulShutdown(signal: string): void {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // If server is not listening (e.g. failed to start due to EADDRINUSE)
  // we can exit immediately without trying to close it.
  if (!server.listening) {
    logger.info('Server is not listening. Exiting immediately.');
    process.exit(signal === 'uncaughtException' || signal === 'unhandledRejection' ? 1 : 0);
  }

  // Close idle connections to prevent keep-alive connections from keeping the server open
  if ('closeIdleConnections' in server) {
    // @ts-ignore - Available in Node 18+
    server.closeIdleConnections();
  }

  server.close((err) => {
    if (err) {
      logger.error({ err }, 'Error during server shutdown');
      process.exit(1);
    }
    logger.info('Server closed cleanly. Exiting process.');
    // When nodemon restarts, it uses SIGUSR2. We must exit to allow the restart.
    process.exit(0);
  });

  // Force-exit after 10 seconds if shutdown hangs (e.g. active long-polling requests)
  setTimeout(() => {
    logger.error('Graceful shutdown timed out after 10s. Forcing exit.');
    // Force close any remaining active connections before exiting
    if ('closeAllConnections' in server) {
      // @ts-ignore
      server.closeAllConnections();
    }
    process.exit(1);
  }, 10_000).unref(); // unref prevents the timeout itself from keeping the process alive
}

// OS signals (Ctrl+C, Docker stop, Kubernetes pod termination)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Nodemon specific restart signal
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err: Error) => {
  logger.error({ err }, 'Uncaught Exception');
  gracefulShutdown('uncaughtException');
});
