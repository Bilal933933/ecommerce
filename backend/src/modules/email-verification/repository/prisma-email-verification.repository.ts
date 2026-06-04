import { Injectable } from '@nestjs/common';
import { IEmailVerificationRepository } from './email-verification.repository.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { EmailVerification } from '@prisma/client';

@Injectable()
export class PrismaEmailVerificationRepository implements IEmailVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<EmailVerification> {
    return this.prisma.emailVerification.create({ data });
  }

  async findValidByToken(token: string): Promise<EmailVerification | null> {
    return this.prisma.emailVerification.findFirst({
      where: {
        token,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.emailVerification.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.prisma.emailVerification.deleteMany({ where: { userId } });
  }
}
