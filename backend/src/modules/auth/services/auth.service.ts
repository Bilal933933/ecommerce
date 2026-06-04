/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import {
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { HashService } from './hash.service';
import { JwtPayload } from '../types/jwt-payload.type';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from '@prisma/client';
import { UsersService } from 'src/modules/users/users.service';
import { RegisterDto } from '../dto/register-auth.dto';
import { EmailVerificationService } from 'src/modules/email-verification/email-verification.service';

export type UserWithoutPassword = Omit<User, 'password'>;

export interface AuthResult {
  user: UserWithoutPassword;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  // ───── Register ─────
  async register(
    dto: RegisterDto,
    ip?: string,
    ua?: string,
  ): Promise<AuthResult> {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('errors.auth.email_taken');
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    // إرسال رابط التحقق من البريد الإلكتروني
    await this.emailVerificationService.sendVerificationEmail(user.id);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const { refreshToken } = await this.tokenService.generateRefreshToken(
      user.id,
      ip,
      ua,
    );

    const { password: _pwd, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  // ───── Login ─────
  async login(
    email: string,
    password: string,
    ip?: string,
    ua?: string,
  ): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('errors.auth.invalid_credentials');
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('errors.auth.invalid_credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('errors.auth.account_disabled');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const { refreshToken } = await this.tokenService.generateRefreshToken(
      user.id,
      ip,
      ua,
    );

    const { password: _pwd, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  // ───── Refresh Token ─────
  async refreshToken(
    refreshToken: string,
    ip?: string,
    ua?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.tokenService.refreshAccessToken(refreshToken, ip, ua);
  }

  // ───── Logout ─────
  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeSession(refreshToken);
  }

  // ───── Logout من كل الأجهزة ─────
  async logoutFromAllDevices(
    userId: string,
  ): Promise<{ revokedCount: number }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('errors.not_found');
    }

    const revokedCount = await this.tokenService.revokeAllUserSessions(userId);
    return { revokedCount };
  }

  // ───── تغيير كلمة المرور ─────
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('errors.not_found');
    }

    const isMatch = await this.hashService.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('errors.auth.invalid_credentials');
    }

    if (dto.oldPassword === dto.newPassword) {
      throw new ConflictException('errors.auth.same_password');
    }

    const hashed = await this.hashService.hash(dto.newPassword);
    await this.usersService.updateUser(userId, { password: hashed });
    await this.tokenService.revokeAllUserSessions(userId);
  }
}
