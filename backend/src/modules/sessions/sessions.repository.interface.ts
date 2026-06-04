import { Session } from '@prisma/client';

export interface ISessionsRepository {
  create(data: {
    userId: string;
    refreshToken: string;
    lookupHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<Session>;

  findById(id: string): Promise<Session | null>;

  findByLookupHash(lookupHash: string): Promise<Session | null>;

  findActiveByUserId(userId: string, limit?: number): Promise<Session[]>;

  rotateSession(params: {
    oldSessionId: string;
    newSessionData: {
      userId: string;
      refreshToken: string;
      lookupHash: string;
      userAgent?: string;
      ipAddress?: string;
      expiresAt: Date;
    };
  }): Promise<Session>;

  revokeAllForUser(userId: string): Promise<number>;

  update(id: string, data: { isRevoked: boolean }): Promise<Session>;
}
