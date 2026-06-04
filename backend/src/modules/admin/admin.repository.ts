import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async countActiveUsers(): Promise<number> {
    return this.prisma.user.count({ where: { isActive: true } });
  }

  async countNewUsersThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.prisma.user.count({
      where: { createdAt: { gte: startOfMonth } },
    });
  }
}
