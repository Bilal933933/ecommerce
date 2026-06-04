import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { PrismaEmailVerificationRepository } from './repository/prisma-email-verification.repository';
import { MailService } from 'src/modules/mail/mail.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly emailVerificationRepository: PrismaEmailVerificationRepository,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  // ───── إرسال رابط التحقق ─────
  async sendVerificationEmail(userId: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('errors.not_found');

    // إذا كان البريد الإلكتروني مُتحقق منه بالفعل، لا نحتاج إلى إعادة الإرسال
    if (user.isEmailVerified) {
      return;
    }

    // حذف التوكنات القديمة للمستخدم
    await this.emailVerificationRepository.deleteAllForUser(userId);

    // إنشاء توكن جديد
    const token = randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), 24);

    await this.emailVerificationRepository.create({ userId, token, expiresAt });

    await this.mailService.sendVerificationEmail({
      to: user.email,
      name: user.name ?? user.email,
      token,
    });
  }

  // ───── التحقق من التوكن ─────
  async verifyEmail(token: string): Promise<void> {
    const record =
      await this.emailVerificationRepository.findValidByToken(token);

    if (!record) {
      throw new BadRequestException('errors.auth.token_invalid');
    }

    await this.emailVerificationRepository.markAsUsed(record.id);
    await this.usersService.updateUser(record.userId, {
      isEmailVerified: true,
    });
  }
}
