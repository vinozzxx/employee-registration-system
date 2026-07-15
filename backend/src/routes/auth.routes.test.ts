/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import { authService } from '../services/auth.service';

vi.mock('../services/auth.service');

describe('Auth Routes (Integration)', () => {
  describe('POST /api/auth/login', () => {
    it('should return 422 if body is invalid', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email' }); // missing password

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toHaveProperty('email');
      expect(res.body.error).toHaveProperty('password');
    });

    it('should return 200 and token on success', async () => {
      const mockResult = {
        user: { id: '1', name: 'Test', email: 't@t.com', createdAt: new Date() },
        token: 'mock_jwt_token',
      };
      vi.mocked(authService.login).mockResolvedValue(mockResult as any);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock_jwt_token');
    });
  });
});
