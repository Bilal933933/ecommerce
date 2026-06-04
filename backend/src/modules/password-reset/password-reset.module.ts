import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaPasswordResetRepository } from './repository/prisma-password-reset.repository';
import { PasswordResetService } from './password-reset.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from '../auth/services/hash.service';

import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [UsersModule, forwardRef(() => AuthModule)],
  providers: [
    PrismaService,
    PrismaPasswordResetRepository,
    PasswordResetService,
    HashService,
  ],
  exports: [PasswordResetService, HashService],
})
export class PasswordResetModule {}
