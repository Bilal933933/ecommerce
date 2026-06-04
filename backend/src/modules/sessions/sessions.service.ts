import { Injectable, Inject } from '@nestjs/common';
import { SESSIONS_REPOSITORY } from './sessions.constants';
import * as sessionsRepositoryInterface from './sessions.repository.interface';
import { Session } from '@prisma/client';
import { HashService } from 'src/modules/auth/services/hash.service';
import { createHash } from 'crypto';

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

@Injectable()
export class SessionsService {
  constructor(
    @Inject(SESSIONS_REPOSITORY)
    private readonly sessionsRepository: sessionsRepositoryInterface.ISessionsRepository,
    private readonly hashService: HashService,
  ) {}

  async createSession(data: {
    userId: string;
    refreshToken: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<Session> {
    const hashedToken = await this.hashService.hash(data.refreshToken);
    const lookupHash = sha256(data.refreshToken);

    return this.sessionsRepository.create({
      ...data,
      refreshToken: hashedToken,
      lookupHash,
    });
  }

  // O(1) lookup via SHA256 hash — no brute-force over all sessions
  async findValidSessionByToken(refreshToken: string): Promise<Session | null> {
    const lookupHash = sha256(refreshToken);
    return this.sessionsRepository.findByLookupHash(lookupHash);
  }

  // Atomic rotation: revoke old + create new in a single transaction
  async rotateSession(params: {
    oldSessionId: string;
    rawRefreshToken: string;
    userId: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<Session> {
    const hashedToken = await this.hashService.hash(params.rawRefreshToken);
    const lookupHash = sha256(params.rawRefreshToken);

    return this.sessionsRepository.rotateSession({
      oldSessionId: params.oldSessionId,
      newSessionData: {
        userId: params.userId,
        refreshToken: hashedToken,
        lookupHash,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
        expiresAt: params.expiresAt,
      },
    });
  }

  async revoke(sessionId: string): Promise<void> {
    await this.sessionsRepository.update(sessionId, { isRevoked: true });
  }

  async revokeAllForUser(userId: string): Promise<number> {
    return this.sessionsRepository.revokeAllForUser(userId);
  }
}
