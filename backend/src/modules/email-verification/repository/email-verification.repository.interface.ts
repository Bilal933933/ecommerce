import { EmailVerification } from '@prisma/client';

export interface IEmailVerificationRepository {
  create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<EmailVerification>;

  findValidByToken(token: string): Promise<EmailVerification | null>;

  markAsUsed(id: string): Promise<void>;

  deleteAllForUser(userId: string): Promise<void>;
}
