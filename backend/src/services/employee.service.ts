import { NotFoundError, ForbiddenError, ConflictError } from '../errors/AppError';
import { employeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeRequest, UpdateEmployeeRequest } from '../dtos/employee.dto';

export class EmployeeService {
  async createEmployee(userId: string, data: CreateEmployeeRequest) {
    const limit = parseInt(process.env.MAX_EMPLOYEE_PER_USER || '500', 10);
    const count = await employeeRepository.count({ createdByUserId: userId, deletedAt: null });

    if (count >= limit) {
      throw new ConflictError('Employee registration limit reached.');
    }

    const existingEmployee = await employeeRepository.findFirst({
      createdByUserId: userId,
      deletedAt: null,
      OR: [{ email: data.email }, { contact: data.contact }],
    });

    if (existingEmployee) {
      throw new ConflictError('Employee already exists.');
    }

    return employeeRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contact: data.contact,
      gender: data.gender,
      department: data.department,
      designation: data.designation,
      dateOfBirth: new Date(data.dateOfBirth),
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      createdByUserId: userId,
    });
  }

  async updateEmployee(id: string, userId: string, data: UpdateEmployeeRequest) {
    const employee = await employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    if (employee.createdByUserId !== userId) {
      throw new ForbiddenError('You are not authorized to modify this employee.');
    }

    const updateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contact: data.contact,
      gender: data.gender,
      department: data.department,
      designation: data.designation,
      ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      updatedByUserId: userId,
    };

    return employeeRepository.update(id, updateData);
  }

  async getEmployeeById(id: string) {
    const employee = await employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // All authenticated users can view ANY employee. No ownership check here.
    return employee;
  }

  async deleteEmployee(id: string, userId: string) {
    const employee = await employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    if (employee.createdByUserId !== userId) {
      throw new ForbiddenError('You are not authorized to modify this employee.');
    }

    await employeeRepository.delete(employee.id, userId);
  }

  async getAllEmployees(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ) {
    const result = await employeeRepository.findMany(page, limit, search, sortBy, sortOrder);

    return {
      items: result.items,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}

export const employeeService = new EmployeeService();
