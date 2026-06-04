/* eslint-disable @typescript-eslint/require-await */
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Ip,
  Headers,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './services/auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from './dto/login-auth.dto';
import * as authenticatedrequestType from './types/authenticatedrequest.type';
import { Public } from './decorators/public.decorator';
import { VerifyEmailDto } from '../email-verification/dto/verify-email.dto';
import { PasswordResetService } from '../password-reset/password-reset.service';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { ResetPasswordDto } from '../password-reset/dto/reset-password.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { ForgotPasswordDto } from '../password-reset/dto/forgot-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { AppConfigService } from 'src/config/config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly config: AppConfigService,
  ) {}

  // ───── Register ─────
  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    return this.authService.register(dto, ip, ua);
  }

  // ───── Login ─────
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.auth.login')
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    return this.authService.login(dto.email, dto.password, ip, ua);
  }

  // ───── Refresh ─────
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.auth.refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    return this.authService.refreshToken(dto.refreshToken, ip, ua);
  }

  // ───── Logout ─────
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.auth.logout')
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  // ───── Logout All Devices ─────
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('responses.auth.logout')
  async logoutAll(@Req() req: authenticatedrequestType.AuthenticatedRequest) {
    return this.authService.logoutFromAllDevices(req.user.sub);
  }

  // ───── Change Password ─────
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('responses.auth.change_password')
  async changePassword(
    @Req() req: authenticatedrequestType.AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.sub, dto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.auth.verify_email')
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<void> {
    return this.emailVerificationService.verifyEmail(dto.token);
  }

  @Public()
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.auth.verify_email')
  async verifyEmailGet(@Query('token') token: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('validation.token.required');
    }
    return this.emailVerificationService.verifyEmail(token);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.auth.reset_password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    return this.passwordResetService.resetPassword(dto.token, dto.newPassword);
  }

  @Public()
  @Get('reset-password')
  async resetPasswordRedirect(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!token) {
      throw new BadRequestException('validation.token.required');
    }
    const frontendUrl = this.config.appUrl;
    res.redirect(
      HttpStatus.FOUND,
      `${frontendUrl}/auth/reset-password?token=${token}`,
    );
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.auth.resend_verification')
  async resendVerification(
    @CurrentUser() user: Pick<JwtPayload, 'sub' | 'email' | 'role'>,
  ): Promise<void> {
    return this.emailVerificationService.sendVerificationEmail(user.sub);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.auth.forgot_password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this.passwordResetService.forgotPassword(dto.email);
  }
}
