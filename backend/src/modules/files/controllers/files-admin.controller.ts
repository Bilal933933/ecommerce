// src/modules/files/controllers/files-admin.controller.ts

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FilesService } from '../services/files.service';
import { SignedUrlDto } from '../dto/signed-url.dto';
import { ConfirmUploadDto } from '../dto/confirm-upload.dto';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';

@Controller('admin/files')
export class FilesAdminController {
  constructor(
    private readonly filesService: FilesService,
    private readonly i18n: I18nService,
  ) {}

  // ─── طلب Signed URL ───────────────────────────────────────
  @Post('signed-url')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.files.signed_url')
  async getSignedUrl(@Body() dto: SignedUrlDto) {
    return await this.filesService.generateSignedUrl(dto);
  }

  // ─── تأكيد الرفع ──────────────────────────────────────────
  @Post('confirm')
  @ResponseMessage('responses.files.confirmed')
  async confirmUpload(@Body() dto: ConfirmUploadDto) {
    return await this.filesService.confirmUpload(dto);
  }

  // ─── حذف ملف ──────────────────────────────────────────────
  @Delete(':id')
  @ResponseMessage('responses.files.deleted')
  async deleteFile(@Param('id') id: string) {
    await this.filesService.deleteFile(id);
    return null;
  }
}
