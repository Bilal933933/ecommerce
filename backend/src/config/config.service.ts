import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {
    console.log('MAIL_FROM:', process.env.MAIL_FROM);
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY);
    console.log('APP_URL:', process.env.APP_URL);
  }

  // ─── Server ────────────────────────────────────────────────────────────

  get port(): number {
    return this.config.get<number>('app.port', 3000);
  }

  get isProduction(): boolean {
    return this.config.get<boolean>('app.isProduction', false);
  }

  get nodeEnv(): string {
    return this.config.get<string>('app.nodeEnv', 'development');
  }

  // ─── CORS ──────────────────────────────────────────────────────────────

  get corsOriginWeb(): string {
    return this.config.get<string>(
      'app.corsOriginWeb',
      'http://localhost:5173',
    );
  }

  get corsOriginAdmin(): string {
    return this.config.get<string>(
      'app.corsOriginAdmin',
      'http://localhost:5174',
    );
  }

  get corsOrigins(): string[] {
    return [this.corsOriginWeb, this.corsOriginAdmin];
  }

  // ─── Database ──────────────────────────────────────────────────────────

  get dbUrl(): string {
    const url = this.config.get<string>('database.url');
    if (!url) throw new Error('[Config] DATABASE_URL غير محدد');
    return url;
  }

  // ─── JWT ───────────────────────────────────────────────────────────────

  get jwtSecret(): string {
    const secret = this.config.get<string>('auth.jwtSecret');
    if (!secret) throw new Error('[Config] JWT_SECRET غير محدد');
    return secret;
  }

  get jwtExpiresIn(): string {
    return this.config.get<string>('auth.jwtExpiresIn', '15m');
  }

  get jwtRefreshSecret(): string {
    const secret = this.config.get<string>('auth.jwtRefreshSecret');
    if (!secret) throw new Error('[Config] JWT_REFRESH_SECRET غير محدد');
    return secret;
  }

  get jwtRefreshExpiresIn(): string {
    return this.config.get<string>('auth.jwtRefreshExpiresIn', '7d');
  }

  get resendApiKey(): string {
    const key = this.config.get<string>('RESEND_API_KEY');

    if (!key) {
      throw new Error('[Config] RESEND_API_KEY غير محدد');
    }

    return key;
  }

  get mailFrom(): string {
    const from = this.config.get<string>('MAIL_FROM');

    if (!from) {
      throw new Error('[Config] MAIL_FROM غير محدد');
    }
    return from;
  }

  get appUrl(): string {
    const url = this.config.get<string>('APP_URL');

    if (!url) {
      throw new Error('[Config] APP_URL غير محدد');
    }

    return url;
  }

  get cloudinaryCloudName(): string {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');

    if (!cloudName) {
      throw new Error('[Config] CLOUDINARY_CLOUD_NAME غير محدد');
    }

    return cloudName;
  }

  get cloudinaryApiKey(): string {
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');

    if (!apiKey) {
      throw new Error('[Config] CLOUDINARY_API_KEY غير محدد');
    }
    return apiKey;
  }

  get cloudinaryApiSecret(): string {
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');

    if (!apiSecret) {
      throw new Error('[Config] CLOUDINARY_API_SECRET غير محدد');
    }
    return apiSecret;
  }
}
