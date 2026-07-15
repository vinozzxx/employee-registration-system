/**
 * Data Transfer Objects (DTOs) for the Employee resource.
 * These interfaces decouple the API layer from the Prisma ORM layer.
 * They act as the single source of truth for the shape of the data moving
 * between the frontend and the backend.
 */

export interface CreateEmployeeRequest {
  firstName: string;
  lastName?: string | null;
  email: string;
  contact: string;
  gender: string;
  department: string;
  designation: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  contact?: string;
  gender?: string;
  department?: string;
  designation?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface EmployeeResponse {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  contact: string;
  gender: string;
  department: string;
  designation: string;
  dateOfBirth: Date;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdByUserId: string;
  updatedByUserId: string | null;
  deletedAt: Date | null;
  deletedByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
