// src/modules/users/controllers/users-files.controller.ts
//
// نقاط نهاية رفع الملفات للمستخدم العادي (avatar):
//   POST   /users/me/files/signed-url  → يولّد Signed URL لـ Cloudinary
//   POST   /users/me/files/confirm     → يثبّت الرفع مع ownerId = currentUserId
//   POST   /users/me/avatar            → يحدّث avatarUrl من fileId
//   DELETE /users/me/avatar            → يحذف الأفاتار الحالي
//
// يمر عبر نفس FilesService المستخدم من Admin، لكن بـ ownerId يضمن الملكية.

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { FilesService } from 'src/modules/files/services/files.service';
import { UsersService } from '../users.service';
import { SignedUrlDto } from 'src/modules/files/dto/signed-url.dto';
import { ConfirmUploadDto } from 'src/modules/files/dto/confirm-upload.dto';
import { SetAvatarDto } from '../dto/set-avatar.dto';

@Controller('users/me')
export class UsersFilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  // ─── 1) طلب Signed URL ─────────────────────────────────────
  @Post('files/signed-url')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.files.signed_url')
  async getSignedUrl(@Body() dto: SignedUrlDto) {
    return this.filesService.generateSignedUrl(dto);
  }

  // ─── 2) تأكيد الرفع (مع ربط المالك تلقائياً) ─────────────
  @Post('files/confirm')
  @ResponseMessage('responses.files.confirmed')
  async confirmUpload(
    @CurrentUser('sub') userId: string,
    @Body() dto: ConfirmUploadDto,
  ) {
    return this.filesService.confirmUpload(dto, userId);
  }

  // ─── 3) تعيين الأفاتار من fileId ─────────────────────────
  @Post('avatar')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.users.avatar_updated')
  async setAvatar(
    @CurrentUser('sub') userId: string,
    @Body() dto: SetAvatarDto,
  ) {
    return this.usersService.setUserAvatar(userId, dto.fileId);
  }

  // ─── 4) حذف الأفاتار الحالي ──────────────────────────────
  @Delete('avatar')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.users.avatar_removed')
  async removeAvatar(@CurrentUser('sub') userId: string) {
    await this.usersService.removeUserAvatar(userId);
    return null;
  }
}
