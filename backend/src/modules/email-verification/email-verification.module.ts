import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { PrismaEmailVerificationRepository } from './repository/prisma-email-verification.repository';
import { EmailVerificationService } from './email-verification.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [UsersModule],
  providers: [
    PrismaService,
    PrismaEmailVerificationRepository,
    EmailVerificationService,
  ],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
