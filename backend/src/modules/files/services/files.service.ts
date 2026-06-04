/* eslint-disable @typescript-eslint/await-thenable */
// src/modules/files/services/files.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { FileType } from '@prisma/client';
import { FilesRepository } from '../repositories/files.repository';
import { CloudinaryService } from './cloudinary.service';
import { SignedUrlDto, MAX_SIZES } from '../dto/signed-url.dto';
import { ConfirmUploadDto } from '../dto/confirm-upload.dto';
import { RelatedType } from '../types/file.types';

// أنواع MIME المسموح بها
const ALLOWED_MIME_TYPES: Record<FileType, string[]> = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  VIDEO: ['video/mp4', 'video/webm', 'video/quicktime'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly i18n: I18nService,
  ) {}

  // ─── توليد Signed URL ─────────────────────────────────────
  async generateSignedUrl(dto: SignedUrlDto) {
    this.validateFileType(dto.type, dto.mimeType, dto.size);
    return this.cloudinaryService.generateSignedUrl(dto.type);
  }

  // ─── تأكيد الرفع وحفظ الملف (مع ownerId اختياري) ─────
  async confirmUpload(dto: ConfirmUploadDto, ownerId?: string) {
    const file = await this.filesRepository.create({
      url: dto.url,
      publicId: dto.publicId,
      type: dto.type,
      size: dto.size,
      mimeType: dto.mimeType,
      uploadSessionId: dto.uploadSessionId,
      ownerId,
    });

    return {
      id: file.id,
      url: file.url,
      type: file.type,
      size: file.size,
      mimeType: file.mimeType,
    };
  }

  // ─── ربط الملفات بكيان (يُستخدم من باقي الـ Services) ────
  async attachFiles(
    fileIds: string[],
    relatedType: RelatedType,
    relatedId: string,
  ) {
    if (fileIds.length === 0) return;

    const files = await this.filesRepository.findByIds(fileIds);

    if (files.length !== fileIds.length) {
      throw new NotFoundException(await this.i18n.t('errors.file.not_found'));
    }

    await this.filesRepository.attachToEntity(fileIds, relatedType, relatedId);
  }

  // ─── جلب ملفات كيان ───────────────────────────────────────
  async getFilesByEntity(relatedType: RelatedType, relatedId: string) {
    return this.filesRepository.findFilesByEntity(relatedType, relatedId);
  }

  // ─── جلب ملفات عدة كيانات ─────────────────────────────────
  async getFilesByEntities(relatedType: RelatedType, relatedIds: string[]) {
    return this.filesRepository.findFilesByEntities(relatedType, relatedIds);
  }

  // ─── حذف ملفات كيان (يُستخدم عند حذف Grade/Lesson...) ───
  async deleteEntityFiles(relatedType: RelatedType, relatedId: string) {
    const files = await this.filesRepository.findPublicIdsByEntity(
      relatedType,
      relatedId,
    );

    if (files.length === 0) return;

    // حذف من Cloudinary أولاً
    await this.cloudinaryService.deleteFiles(files.map((f) => f.publicId));

    // حذف من DB
    await this.filesRepository.deleteByIds(files.map((f) => f.id));
  }

  // ─── حذف ملف واحد ─────────────────────────────────────────
  async deleteFile(fileId: string) {
    const file = await this.filesRepository.findById(fileId);

    if (!file) {
      throw new NotFoundException(await this.i18n.t('errors.file.not_found'));
    }

    await this.cloudinaryService.deleteFile(file.publicId);
    await this.filesRepository.deleteByIds([fileId]);
  }

  // ─── جلب ملف مع التحقق من الملكية (للأفاتار) ──────────────
  async findFileOwnedBy(fileId: string, ownerId: string) {
    return this.filesRepository.findByIdAndOwner(fileId, ownerId);
  }

  // ─── جلب ملف بالـ URL + ownerId (لحذف الأفاتار القديم) ──
  async findFileByUrlForOwner(url: string, ownerId: string) {
    return this.filesRepository.findByUrlAndOwner(url, ownerId);
  }

  // ─── تحقق من نوع وحجم الملف ───────────────────────────────
  private validateFileType(type: FileType, mimeType: string, size: number) {
    const lang = I18nContext.current()?.lang ?? 'ar';
    const allowedMimes = ALLOWED_MIME_TYPES[type];

    if (!allowedMimes.includes(mimeType)) {
      throw new BadRequestException(
        this.i18n.translate('errors.file.type_not_allowed', {
          lang,
          args: { allowedTypes: allowedMimes.join(', ') },
        }),
      );
    }

    const maxSize = MAX_SIZES[type];
    if (size > maxSize) {
      throw new BadRequestException(
        this.i18n.translate('errors.file.size_exceeded', {
          lang,
          args: { maxSize: maxSize / 1024 / 1024 },
        }),
      );
    }
  }
}
