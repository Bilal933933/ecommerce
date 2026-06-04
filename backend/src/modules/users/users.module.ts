import { Module } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { USERS_REPOSITORY } from './users.constants';
import { UsersService } from './users.service';
import { PrismaUsersRepository } from './repository/users.repository';
import { UsersController } from './users.controller';
import { UsersFilesController } from './controllers/users-files.controller';
import { AppConfigModule } from 'src/config/config.module';
import { SessionsModule } from 'src/modules/sessions/sessions.module';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { JwtService } from 'src/modules/auth/services/jwt.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FilesModule } from 'src/modules/files/files.module';

@Module({
  imports: [AppConfigModule, SessionsModule, PrismaModule, FilesModule],
  providers: [
    PrismaService,
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaUsersRepository,
    },
    UsersService,
    JwtService,
    JwtAuthGuard,
  ],
  controllers: [UsersController, UsersFilesController],
  exports: [UsersService],
})
export class UsersModule {}
