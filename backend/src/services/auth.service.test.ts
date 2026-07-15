/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './auth.service';
import { userRepository } from '../repositories/user.repository';
import { ConflictError, UnauthorizedError } from '../errors/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';

vi.mock('../repositories/user.repository');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signup', () => {
    const validSignupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw ConflictError if email already exists', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue({ id: '1' } as any);

      await expect(authService.signup(validSignupData)).rejects.toThrow(ConflictError);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validSignupData.email);
    });

    it('should hash password and create user', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password' as never);

      const mockUser = {
        id: '123',
        name: validSignupData.name,
        email: validSignupData.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: 'hashed_password',
      };

      vi.mocked(userRepository.create).mockResolvedValue(mockUser);
      vi.mocked(jwt.sign).mockReturnValue('mock_token' as never);

      const result = await authService.signup(validSignupData);

      expect(bcrypt.hash).toHaveBeenCalledWith(validSignupData.password, 12);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: validSignupData.name,
        email: validSignupData.email,
        password: validSignupData.password,
        passwordHash: 'hashed_password',
      });
      expect(result.token).toBe('mock_token');
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw UnauthorizedError if user not found', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedError);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
    });

    it('should throw UnauthorizedError if password does not match', async () => {
      const mockUser = { id: '1', passwordHash: 'hashed_password' };
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedError);
    });

    it('should return user and token on successful login', async () => {
      const mockUser = {
        id: '123',
        name: 'Test',
        email: loginData.email,
        passwordHash: 'hashed_password',
      };
      vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue('mock_token' as never);

      const result = await authService.login(loginData);

      expect(result.token).toBe('mock_token');
      expect(result.user.id).toBe('123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: '123', email: loginData.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn },
      );
    });
  });
});
