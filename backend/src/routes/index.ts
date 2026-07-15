import { Router } from 'express';
import authRoutes from './auth.routes';
import employeeRoutes from './employee.routes';

/**
 * Central route registry.
 * All API route modules are mounted here under their versioned prefix.
 * Adding a new feature module = one import + one router.use() line.
 * Principle: Open/Closed — new routes extend this file, not modify existing routes.
 *            Single Responsibility — this file only maps prefixes to routers.
 *
 * Phase 3 will add: authRouter
 * Phase 4 will add: registrationRouter
 */
const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     description: Returns server status. Use for uptime monitoring.
 *     security: []
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] ?? 'unknown',
  });
});

// Mount auth routes
// Base path: /api/auth
router.use('/auth', authRoutes);

// Mount employee routes
// Base path: /api/employees
router.use('/employees', employeeRoutes);

export default router;
