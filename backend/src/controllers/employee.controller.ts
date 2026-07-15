import { Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/AppError';
import { employeeService } from '../services/employee.service';
import { AuthenticatedRequest } from '../types';
import { CreateEmployeeRequest, UpdateEmployeeRequest } from '../dtos/employee.dto';

export class EmployeeController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const dto: CreateEmployeeRequest = req.body;
      const employee = await employeeService.createEmployee(req.user.userId, dto);

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const { id } = req.params;
      const dto: UpdateEmployeeRequest = req.body;
      const employee = await employeeService.updateEmployee(id, req.user.userId, dto);

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const { id } = req.params;
      await employeeService.deleteEmployee(id, req.user.userId);

      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const search = req.query['search'] as string | undefined;
      const sortBy = req.query['sortBy'] as string | undefined;
      const sortOrder = req.query['sortOrder'] as 'asc' | 'desc' | undefined;

      const data = await employeeService.getAllEmployees(page, limit, search, sortBy, sortOrder);

      res.status(200).json({
        success: true,
        message: 'Employees retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const employeeController = new EmployeeController();
