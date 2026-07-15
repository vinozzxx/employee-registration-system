import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import { config } from './config';
import { swaggerSpec } from './config/swagger';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import router from './routes';
import { API_PREFIX, SWAGGER_PATH } from './constants';

/**
 * Express application factory.
 * Separated from server.ts so the app can be imported in tests without
 * starting the HTTP server (a key requirement for integration testing).
 * Principle: Separation of Concerns, Testability, Single Responsibility.
 */
const app = express();

// -------------------------------------------------------
// Security Middleware
// -------------------------------------------------------

/**
 * Helmet sets secure HTTP response headers (XSS protection, HSTS, etc.)
 * Must be applied before any route handlers.
 */
app.use(helmet());

/**
 * CORS — restricts which origins can call this API.
 * In production, CORS_ORIGIN should be the exact frontend domain.
 */
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// -------------------------------------------------------
// Body Parsing
// -------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -------------------------------------------------------
// Request Logging
// -------------------------------------------------------
app.use(requestLogger);

// -------------------------------------------------------
// API Documentation (Swagger UI)
// -------------------------------------------------------
app.use(
  SWAGGER_PATH,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Employee Registration API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  }),
);

// -------------------------------------------------------
// API Routes
// -------------------------------------------------------
app.use(API_PREFIX, router);

// -------------------------------------------------------
// 404 + Global Error Handler (must be last)
// -------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
