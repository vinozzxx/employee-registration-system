import type { Options as SwaggerOptions } from 'swagger-jsdoc';
import swaggerJsdoc from 'swagger-jsdoc';

/**
 * OpenAPI / Swagger configuration.
 * The API specification serves as a contract between frontend and backend.
 * Principle: Documentation as Code — the spec is auto-generated from JSDoc annotations.
 * Future phases will add endpoint annotations directly above route handlers.
 */
const swaggerDefinition: SwaggerOptions['definition'] = {
  openapi: '3.0.3',
  info: {
    title: 'Employee Registration Management System API',
    version: '1.0.0',
    description: 'REST API for managing employee registrations with JWT authentication.',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
    {
      url: 'https://api.example.com/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token in the format: Bearer <token>',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
          data: { type: 'object', nullable: true },
          statusCode: { type: 'integer', example: 200 },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'An error occurred' },
          error: { type: 'string', nullable: true },
          statusCode: { type: 'integer', example: 400 },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SignupRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Alice Johnson', minLength: 2, maxLength: 100 },
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          password: {
            type: 'string',
            format: 'password',
            example: 'SecurePass123',
            minLength: 8,
            maxLength: 72,
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          password: { type: 'string', format: 'password', example: 'SecurePass123' },
        },
      },
      AuthData: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      Registration: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          department: { type: 'string' },
          createdBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateRegistrationRequest: {
        type: 'object',
        required: ['fullName', 'email', 'department'],
        properties: {
          fullName: { type: 'string', example: 'Bob Smith', minLength: 2, maxLength: 100 },
          email: { type: 'string', format: 'email', example: 'bob@example.com' },
          department: { type: 'string', example: 'Engineering', minLength: 2, maxLength: 100 },
        },
      },
      PaginatedRegistrations: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/Registration' },
          },
          total: { type: 'integer', example: 42 },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          totalPages: { type: 'integer', example: 5 },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const options: SwaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
