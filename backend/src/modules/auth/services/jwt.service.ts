/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types/jwt-payload.type';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class JwtService {
  constructor(private readonly config: AppConfigService) {}

  sign(payload: JwtPayload, expiresIn: string): string {
    return (jwt as any).sign(payload, this.config.jwtSecret, { expiresIn });
  }

  verify(token: string): JwtPayload {
    try {
      const decoded = (jwt as any).verify(token, this.config.jwtSecret);
      return decoded as JwtPayload;
    } catch {
      throw new UnauthorizedException('errors.auth.token_invalid');
    }
  }

  signRefresh(payload: JwtPayload): string {
    return (jwt as any).sign(payload, this.config.jwtRefreshSecret, {
      expiresIn: this.config.jwtRefreshExpiresIn,
    });
  }

  verifyRefresh(token: string): JwtPayload {
    try {
      const decoded = (jwt as any).verify(token, this.config.jwtRefreshSecret);
      return decoded as JwtPayload;
    } catch {
      throw new UnauthorizedException('errors.auth.token_expired');
    }
  }
}
