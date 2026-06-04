import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { PrismaPasswordResetRepository } from './repository/prisma-password-reset.repository';
import { MailService } from 'src/modules/mail/mail.service';
import { UsersService } from 'src/modules/users/users.service';
import { HashService } from 'src/modules/auth/services/hash.service';
import { TokenService } from 'src/modules/auth/services/token.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly passwordResetRepository: PrismaPasswordResetRepository,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  // ───── طلب إعادة التعيين ─────
  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    // لا نكشف إذا كان الإيميل موجوداً أم لا (أمان)
    if (!user || !user.isActive) return;

    // حذف الطلبات القديمة
    await this.passwordResetRepository.deleteAllForUser(user.id);

    const token = randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), 1);

    await this.passwordResetRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });

    await this.mailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name ?? user.email,
      token,
    });
  }

  // ───── تعيين كلمة المرور الجديدة ─────
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await this.passwordResetRepository.findValidByToken(token);

    if (!record) {
      throw new BadRequestException('errors.auth.token_invalid');
    }

    const user = await this.usersService.findById(record.userId);
    if (!user) throw new NotFoundException('errors.not_found');

    const hashed = await this.hashService.hash(newPassword);

    await this.usersService.updateUser(record.userId, { password: hashed });
    await this.passwordResetRepository.markAsUsed(record.id);

    // إلغاء كل الجلسات بعد تغيير الباسورد
    await this.tokenService.revokeAllUserSessions(record.userId);
  }
}
