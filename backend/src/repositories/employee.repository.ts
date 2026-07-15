import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';

export class EmployeeRepository {
  async create(data: Prisma.EmployeeUncheckedCreateInput) {
    return prisma.employee.create({
      data,
      select: this.getPublicSelect(),
    });
  }

  async update(id: string, data: Prisma.EmployeeUpdateInput) {
    return prisma.employee.update({
      where: { id },
      data,
      select: this.getPublicSelect(),
    });
  }

  async findById(id: string) {
    return prisma.employee.findFirst({
      where: { id, deletedAt: null },
      select: this.getPublicSelect(),
    });
  }

  async findFirst(where: Prisma.EmployeeWhereInput) {
    return prisma.employee.findFirst({
      where,
      select: this.getPublicSelect(),
    });
  }

  async delete(id: string, deletedByUserId: string) {
    return prisma.employee.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedByUserId,
      },
    });
  }

  async count(where: Prisma.EmployeeWhereInput) {
    return prisma.employee.count({ where });
  }

  async findMany(
    page: number,
    limit: number,
    search?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { contact: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.EmployeeOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: this.getPublicSelect(),
      }),
      prisma.employee.count({ where }),
    ]);

    return { items, total };
  }

  private getPublicSelect() {
    return {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      contact: true,
      gender: true,
      department: true,
      designation: true,
      dateOfBirth: true,
      address: true,
      city: true,
      state: true,
      country: true,
      postalCode: true,
      createdByUserId: true,
      updatedByUserId: true,
      deletedAt: true,
      deletedByUserId: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}

export const employeeRepository = new EmployeeRepository();
