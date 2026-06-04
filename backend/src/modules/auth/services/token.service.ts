import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { addDays } from 'date-fns';
import { JwtService } from './jwt.service';
import { JwtPayload } from '../types/jwt-payload.type';
import { SessionsService } from 'src/modules/sessions/sessions.service';
import { UsersService } from 'src/modules/users/users.service';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly config: AppConfigService,
  ) {}

  // ───── Access Token ─────
  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, this.config.jwtExpiresIn);
  }

  // ───── Refresh Token + إنشاء Session ─────
  async generateRefreshToken(
    userId: string,
    ip?: string,
    ua?: string,
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('errors.auth.invalid_credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshToken = this.jwtService.sign(
      payload,
      this.config.jwtRefreshExpiresIn,
    );
    const expiresAt = addDays(new Date(), 30);

    await this.sessionsService.createSession({
      userId: user.id,
      refreshToken,
      ipAddress: ip,
      userAgent: ua,
      expiresAt,
    });

    return { refreshToken, expiresAt };
  }

  // ───── Refresh Flow (Token Rotation — Atomic) ─────
  async refreshAccessToken(
    refreshToken: string,
    ip?: string,
    ua?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const oldSession =
      await this.sessionsService.findValidSessionByToken(refreshToken);

    if (!oldSession) {
      throw new UnauthorizedException('errors.auth.token_invalid');
    }

    const user = await this.usersService.findById(oldSession.userId);

    if (!user || !user.isActive) {
      await this.sessionsService.revoke(oldSession.id);
      throw new UnauthorizedException('errors.auth.account_disabled');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = this.generateAccessToken(payload);
    const newRefreshToken = this.jwtService.sign(
      payload,
      this.config.jwtRefreshExpiresIn,
    );
    const expiresAt = addDays(new Date(), 30);

    // 4. Atomic rotation: revoke old + create new (single transaction)
    //    - Pass current ip/ua so the new session is correctly attributed
    //    - Fallback to old session's ua/ip if not provided (rare)
    await this.sessionsService.rotateSession({
      oldSessionId: oldSession.id,
      rawRefreshToken: newRefreshToken,
      userId: user.id,
      userAgent: ua ?? oldSession.userAgent ?? undefined,
      ipAddress: ip ?? oldSession.ipAddress ?? undefined,
      expiresAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ───── Revoke Session ─────
  async revokeSession(refreshToken: string): Promise<void> {
    const session =
      await this.sessionsService.findValidSessionByToken(refreshToken);
    if (!session) {
      throw new UnauthorizedException('errors.auth.token_invalid');
    }
    await this.sessionsService.revoke(session.id);
  }

  // ───── Revoke All Sessions ─────
  async revokeAllUserSessions(userId: string): Promise<number> {
    return this.sessionsService.revokeAllForUser(userId);
  }
}
