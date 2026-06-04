import { PasswordReset } from '@prisma/client';

export interface IPasswordResetRepository {
  create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<PasswordReset>;

  findValidByToken(token: string): Promise<PasswordReset | null>;

  markAsUsed(id: string): Promise<void>;

  deleteAllForUser(userId: string): Promise<void>;
}
