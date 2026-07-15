import { z } from 'zod';
import {
  NAME_REGEX,
  NAME_MESSAGE,
  LAST_NAME_REGEX,
  LAST_NAME_MESSAGE,
  PHONE_REGEX,
  PHONE_MESSAGE,
  POSTAL_REGEX,
  POSTAL_MESSAGE,
  ALPHABETIC_REGEX,
  ALPHABETIC_MESSAGE,
  isXssSafe,
  isValidAddress,
  normalizeSpaces,
} from '../utils/validation';

export const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .regex(NAME_REGEX, NAME_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected'),
  lastName: z
    .string()
    .trim()
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(LAST_NAME_REGEX, LAST_NAME_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected')
    .optional()
    .or(z.literal('')),
  email: z.string().trim().email('Invalid email address').max(100).toLowerCase(),
  contact: z.string().trim().regex(PHONE_REGEX, PHONE_MESSAGE),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other' }),
  department: z
    .string()
    .trim()
    .min(1, 'Department is required')
    .max(100)
    .refine(isXssSafe, 'Invalid input detected'),
  designation: z
    .string()
    .trim()
    .min(1, 'Designation is required')
    .max(100)
    .refine(isXssSafe, 'Invalid input detected'),
  dateOfBirth: z
    .string()
    .datetime({ message: 'Invalid Date of Birth' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD')),
  address: z
    .string()
    .trim()
    .min(1, 'Address is required')
    .max(250, 'Address cannot exceed 250 characters')
    .refine(isValidAddress, 'Please enter a valid address.')
    .refine(isXssSafe, 'Invalid input detected')
    .transform(normalizeSpaces),
  city: z
    .string()
    .trim()
    .min(1, 'City is required')
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected'),
  state: z
    .string()
    .trim()
    .min(1, 'State is required')
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected'),
  country: z
    .string()
    .trim()
    .min(1, 'Country is required')
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected'),
  postalCode: z.string().trim().regex(POSTAL_REGEX, POSTAL_MESSAGE),
});

export const updateEmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .regex(NAME_REGEX, NAME_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected')
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(LAST_NAME_REGEX, LAST_NAME_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected')
    .optional()
    .or(z.literal('')),
  email: z.string().trim().email().max(100).toLowerCase().optional(),
  contact: z.string().trim().regex(PHONE_REGEX, PHONE_MESSAGE).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  department: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine(isXssSafe, 'Invalid input detected')
    .optional(),
  designation: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine(isXssSafe, 'Invalid input detected')
    .optional(),
  dateOfBirth: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
  address: z
    .string()
    .trim()
    .min(1)
    .max(250)
    .refine(isValidAddress, 'Please enter a valid address.')
    .refine(isXssSafe, 'Invalid input detected')
    .transform(normalizeSpaces)
    .optional(),
  city: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected')
    .optional(),
  state: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected')
    .optional(),
  country: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(ALPHABETIC_REGEX, ALPHABETIC_MESSAGE)
    .refine(isXssSafe, 'Invalid input detected')
    .optional(),
  postalCode: z.string().trim().regex(POSTAL_REGEX, POSTAL_MESSAGE).optional(),
});

export const listEmployeesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => [10, 25, 50, 100].includes(val), 'Limit must be 10, 25, 50, or 100'),
  search: z.string().optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'firstName', 'lastName', 'department', 'email'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const employeeParamsSchema = z.object({
  id: z.string().uuid('Invalid employee ID'),
});
