// import {
//   Injectable,
//   InternalServerErrorException,
//   Logger,
// } from '@nestjs/common';
// import { Resend } from 'resend';
// import { verifyEmailTemplate } from './templates/verify-email.template';
// import { resetPasswordTemplate } from './templates/reset-password.template';
// import { AppConfigService } from 'src/config/config.service';

// @Injectable()
// export class MailService {
//   private readonly resend: Resend;
//   private readonly logger = new Logger(MailService.name);

//   constructor(private readonly config: AppConfigService) {
//     this.resend = new Resend(this.config.resendApiKey);
//   }

//   async sendVerificationEmail(data: {
//     to: string;
//     name: string;
//     token: string;
//   }): Promise<void> {
//     const verifyUrl = `${this.config.appUrl}/auth/verify-email?token=${data.token}`;

//     const { error } = await this.resend.emails.send({
//       from: this.config.mailFrom,
//       to: data.to,
//       subject: 'تأكيد البريد الإلكتروني — منصة البيان',
//       html: verifyEmailTemplate({ name: data.name, verifyUrl }),
//     });

//     if (error) {
//       this.logger.error(
//         `Failed to send verification email to ${data.to}`,
//         error,
//       );
//       throw new InternalServerErrorException('errors.server_error');
//     }
//   }

//   async sendPasswordResetEmail(data: {
//     to: string;
//     name: string;
//     token: string;
//   }): Promise<void> {
//     const resetUrl = `${this.config.appUrl}/auth/reset-password?token=${data.token}`;

//     const { error } = await this.resend.emails.send({
//       from: this.config.mailFrom,
//       to: data.to,
//       subject: 'إعادة تعيين كلمة المرور — منصة البيان',
//       html: resetPasswordTemplate({ name: data.name, resetUrl }),
//     });

//     if (error) {
//       this.logger.error(
//         `Failed to send password reset email to ${data.to}`,
//         error,
//       );
//       throw new InternalServerErrorException('errors.server_error');
//     }
//   }
// }
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';
import { verifyEmailTemplate } from './templates/verify-email.template';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { contactTemplate } from './templates/contact.template';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: AppConfigService) {
    this.resend = new Resend(this.config.resendApiKey);
  }

  private get isDev(): boolean {
    return !this.config.isProduction;
  }

  private get safeRecipient(): string {
    // في التطوير: اجبر الإرسال على بريدك فقط
    return this.isDev ? 'blalalnjar294@gmail.com' : '';
  }

  async sendVerificationEmail(data: {
    to: string;
    name: string;
    token: string;
  }): Promise<void> {
    const verifyUrl = `${this.config.appUrl}/auth/verify-email?token=${data.token}`;

    const { error } = await this.resend.emails.send({
      from: this.config.mailFrom,
      to: this.isDev ? this.safeRecipient : data.to,
      subject: 'تأكيد البريد الإلكتروني — منصة البيان',
      html: verifyEmailTemplate({ name: data.name, verifyUrl }),
    });

    if (error) {
      this.logger.error(
        `Failed to send verification email to ${data.to}`,
        error,
      );
      throw new InternalServerErrorException('errors.server_error');
    }
  }

  async sendPasswordResetEmail(data: {
    to: string;
    name: string;
    token: string;
  }): Promise<void> {
    const resetUrl = `${this.config.appUrl}/auth/reset-password?token=${data.token}`;

    const { error } = await this.resend.emails.send({
      from: this.config.mailFrom,
      to: this.isDev ? this.safeRecipient : data.to,
      subject: 'إعادة تعيين كلمة المرور — منصة البيان',
      html: resetPasswordTemplate({ name: data.name, resetUrl }),
    });

    if (error) {
      this.logger.error(
        `Failed to send password reset email to ${data.to}`,
        error,
      );
      throw new InternalServerErrorException('errors.server_error');
    }
  }

  async sendContactEmail(data: {
    name: string;
    email: string;
    message: string;
  }): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.config.mailFrom,
      to: this.isDev ? this.safeRecipient : this.config.mailFrom,
      subject: `رسالة جديدة من ${data.name} — منصة البيان`,
      html: contactTemplate(data),
    });

    if (error) {
      this.logger.error(
        `Failed to send contact email from ${data.email}`,
        error,
      );
      throw new InternalServerErrorException('errors.server_error');
    }
  }
}
