import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { JwtService } from './services/jwt.service';
import { HashService } from './services/hash.service';
import { AuthController } from './auth.controller';
import { AppConfigModule } from 'src/config/config.module';
import { SessionsModule } from 'src/modules/sessions/sessions.module';
import { UsersModule } from 'src/modules/users/users.module';
// import { PasswordResetService } from '../password-reset/password-reset.service';
// import { EmailVerificationService } from '../email-verification/email-verification.service';
// import { PrismaEmailVerificationRepository } from '../email-verification/repository/prisma-email-verification.repository';
// import { MailService } from '../mail/mail.service';
import { PasswordResetModule } from '../password-reset/password-reset.module';
import { EmailVerificationModule } from '../email-verification/email-verification.module';

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    SessionsModule,
    UsersModule,
    AppConfigModule,
    EmailVerificationModule,
    PasswordResetModule,
  ],
  providers: [
    AuthService,
    TokenService,
    JwtService,
    HashService,
    // EmailVerificationService,
    // PasswordResetService,
    // MailService,
    // PrismaEmailVerificationRepository,
  ],
  exports: [AuthService, TokenService, JwtService, HashService],
  controllers: [AuthController],
})
export class AuthModule {}
