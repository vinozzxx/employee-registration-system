import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { userRepository } from '../repositories/user.repository';
import type { SignupInput, LoginInput } from '../validators/auth.validator';
import { config } from '../config';
import { ConflictError, UnauthorizedError } from '../errors/AppError';
import { AUTH } from '../constants';
import { logger } from '../utils/logger';

/**
 * Shape returned by both signup and login.
 * The user object deliberately excludes passwordHash.
 */
export interface AuthResult {
  user: SafeUser;
  token: string;
}

/** User object safe to send to the client — no passwordHash. */
export type SafeUser = Omit<User, 'passwordHash'>;

/**
 * AuthService — all authentication business logic.
 * This is the ONLY layer that hashes passwords, generates tokens,
 * and makes trust decisions.
 * Principle: SRP, Service Layer Pattern, Separation of Concerns.
 */
export const authService = {
  /**
   * Registers a new user account.
   *
   * Flow:
   *  1. Check for duplicate email → 409 Conflict if found
   *  2. Hash plaintext password with bcrypt
   *  3. Persist new user via repository
   *  4. Generate signed JWT
   *  5. Return safe user object + token
   */
  async signup(input: SignupInput): Promise<AuthResult> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, AUTH.SALT_ROUNDS);
    const user = await userRepository.create({ ...input, passwordHash });

    const token = generateToken(user);
    logger.info({ userId: user.id, email: user.email }, 'User registered');

    return { user: sanitizeUser(user), token };
  },

  /**
   * Authenticates an existing user.
   *
   * Flow:
   *  1. Look up user by email → same error whether email or password is wrong
   *     (prevents email enumeration attacks)
   *  2. Compare plaintext password against stored bcrypt hash
   *  3. Generate signed JWT
   *  4. Return safe user object + token
   */
  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmail(input.email);

    // Deliberate: same error message whether email doesn't exist or password is wrong.
    // This prevents attackers from enumerating valid email addresses.
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken(user);
    logger.info({ userId: user.id, email: user.email }, 'User logged in');

    return { user: sanitizeUser(user), token };
  },
};

/**
 * Signs a JWT containing the minimum required claims.
 * Kept private — only AuthService decides when to issue tokens.
 */
function generateToken(user: User): string {
  return jwt.sign({ userId: user.id, email: user.email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
}

/**
 * Strips passwordHash from the User record before it leaves the service layer.
 * The password hash must never appear in any API response.
 * Explicit property mapping is used instead of destructuring to satisfy
 * the no-unused-vars ESLint rule cleanly.
 */
function sanitizeUser(user: User): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
