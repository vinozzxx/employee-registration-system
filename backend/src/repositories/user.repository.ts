import type { User } from '@prisma/client';
import { prisma } from '../prisma/client';
import type { SignupInput } from '../validators/auth.validator';

/**
 * UserRepository — all database access for the User model.
 * Contains ZERO business logic. Pure data access only.
 * All Prisma calls are isolated here so Services never touch the DB directly.
 * Principle: Repository Pattern, SRP, Separation of Concerns.
 */
export const userRepository = {
  /**
   * Finds a user by their unique email address.
   * Used by login (find user) and signup (check duplicate).
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  /**
   * Finds a user by their UUID primary key.
   * Used by the JWT middleware to validate token subjects.
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  /**
   * Inserts a new user row.
   * Receives a pre-hashed password — never receives plaintext.
   */
  async create(data: SignupInput & { passwordHash: string }): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
      },
    });
  },
};
