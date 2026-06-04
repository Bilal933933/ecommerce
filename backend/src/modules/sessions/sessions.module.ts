import { Module } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SESSIONS_REPOSITORY } from './sessions.constants';
import { SessionsService } from './sessions.service';
import { PrismaSessionsRepository } from './prisma-sessions.repository';
import { HashService } from 'src/modules/auth/services/hash.service';
@Module({
  providers: [
    PrismaService,
    HashService,
    {
      provide: SESSIONS_REPOSITORY,
      useClass: PrismaSessionsRepository,
    },
    SessionsService,
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
