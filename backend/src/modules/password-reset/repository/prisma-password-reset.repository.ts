import { Injectable } from '@nestjs/common';
import { IPasswordResetRepository } from './password-reset.repository.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PasswordReset } from '@prisma/client';

@Injectable()
export class PrismaPasswordResetRepository implements IPasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<PasswordReset> {
    return this.prisma.passwordReset.create({ data });
  }

  async findValidByToken(token: string): Promise<PasswordReset | null> {
    return this.prisma.passwordReset.findFirst({
      where: {
        token,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.passwordReset.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.prisma.passwordReset.deleteMany({ where: { userId } });
  }
}
