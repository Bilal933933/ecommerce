import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ISessionsRepository } from './sessions.repository.interface';
import { Session } from '@prisma/client';

@Injectable()
export class PrismaSessionsRepository implements ISessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    refreshToken: string;
    lookupHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  async findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { id } });
  }

  async findByLookupHash(lookupHash: string): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: {
        lookupHash,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async findActiveByUserId(userId: string, limit?: number): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ?? 10,
    });
  }

  // ── Token Rotation (Atomic) ────────────────────────────────────────────
  // Order: revoke OLD first, then create NEW.
  // - If revoke fails → no change (safe)
  // - If create fails after revoke → user must re-login (acceptable)
  // - If both succeed atomically → user gets new token

  async rotateSession(params: {
    oldSessionId: string;
    newSessionData: {
      userId: string;
      refreshToken: string;
      lookupHash: string;
      userAgent?: string;
      ipAddress?: string;
      expiresAt: Date;
    };
  }): Promise<Session> {
    return this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: params.oldSessionId },
        data: { isRevoked: true },
      });

      return tx.session.create({ data: params.newSessionData });
    });
  }

  async revokeAllForUser(userId: string): Promise<number> {
    const result = await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
    return result.count;
  }

  async update(id: string, data: { isRevoked: boolean }): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data,
    });
  }
}
