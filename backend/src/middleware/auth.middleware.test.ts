/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, prefer-const */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from './auth.middleware';
import { UnauthorizedError } from '../errors/AppError';
import { config } from '../config';

vi.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {
      headers: {},
    };
    mockRes = {};
  });

  it('should throw UnauthorizedError if Authorization header is missing', () => {
    authenticate(mockReq as Request, mockRes as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    const error = vi.mocked(nextFunction).mock.calls[0][0] as unknown as UnauthorizedError;
    expect(error.message).toContain('missing or malformed');
  });

  it('should throw UnauthorizedError if token does not start with Bearer', () => {
    mockReq.headers = { authorization: 'Basic token123' };
    authenticate(mockReq as Request, mockRes as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('should attach payload to req.user on valid token', () => {
    mockReq.headers = { authorization: 'Bearer valid.token.here' };
    const mockPayload = { userId: '123', email: 'test@test.com' };
    vi.mocked(jwt.verify).mockReturnValue(mockPayload as any);

    authenticate(mockReq as Request, mockRes as Response, nextFunction);

    expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', config.jwt.secret);
    expect((mockReq as any).user).toEqual(mockPayload);
    expect(nextFunction).toHaveBeenCalledWith(); // Called without error
  });

  it('should pass expired error properly', () => {
    mockReq.headers = { authorization: 'Bearer expired.token.here' };
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new jwt.TokenExpiredError('jwt expired', new Date());
    });

    authenticate(mockReq as Request, mockRes as Response, nextFunction);
    const error = vi.mocked(nextFunction).mock.calls[0][0] as unknown as UnauthorizedError;
    expect(error.message).toContain('expired');
  });
});
