import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { signupSchema, loginSchema } from '../validators/auth.validator';

/**
 * Authentication routes — all public (no authenticate middleware).
 * Middleware execution order per request:
 *   1. authLimiter           — Rate limiting → 429 if exceeded
 *   2. validateRequest(schema) — Zod validation → 422 if invalid
 *   3. authController.action   — Calls service, returns response
 *
 * Principle: Open routes are public by default. Protected routes
 * explicitly add the `authenticate` middleware (see registration routes in Phase 4).
 */
const authRouter = Router();

/**
 * Security: Rate Limiting
 * Prevents brute force password attacks and email enumeration by limiting
 * the number of requests per IP address to the authentication endpoints.
 * 15 minutes window, max 10 attempts per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Create a new user account
 *     description: |
 *       Registers a new HR/admin user. Returns the created user profile
 *       and a signed JWT access token. The token must be sent as
 *       `Authorization: Bearer <token>` on all protected endpoints.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *           example:
 *             name: "Alice Johnson"
 *             email: "alice@example.com"
 *             password: "SecurePass123"
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthData'
 *             example:
 *               success: true
 *               message: "Account created successfully"
 *               data:
 *                 user:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Alice Johnson"
 *                   email: "alice@example.com"
 *                   createdAt: "2026-07-15T09:00:00.000Z"
 *                   updatedAt: "2026-07-15T09:00:00.000Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               statusCode: 201
 *               timestamp: "2026-07-15T09:00:00.000Z"
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "An account with this email already exists"
 *               statusCode: 409
 *               timestamp: "2026-07-15T09:00:00.000Z"
 *       422:
 *         description: Validation error — invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Validation failed"
 *               error:
 *                 email: ["Invalid email address"]
 *                 password: ["Password must be at least 8 characters"]
 *               statusCode: 422
 *               timestamp: "2026-07-15T09:00:00.000Z"
 */
authRouter.post('/signup', authLimiter, validateRequest(signupSchema), (req, res, next) => {
  void authController.signup(req, res, next);
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in with email and password
 *     description: |
 *       Authenticates an existing user. Returns the user profile and a
 *       signed JWT access token. Store the token securely and include it
 *       in the `Authorization` header for all protected requests.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "alice@example.com"
 *             password: "SecurePass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthData'
 *             example:
 *               success: true
 *               message: "Login successful"
 *               data:
 *                 user:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Alice Johnson"
 *                   email: "alice@example.com"
 *                   createdAt: "2026-07-15T09:00:00.000Z"
 *                   updatedAt: "2026-07-15T09:00:00.000Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               statusCode: 200
 *               timestamp: "2026-07-15T09:00:00.000Z"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Invalid email or password"
 *               statusCode: 401
 *               timestamp: "2026-07-15T09:00:00.000Z"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post('/login', authLimiter, validateRequest(loginSchema), (req, res, next) => {
  void authController.login(req, res, next);
});

export default authRouter;
