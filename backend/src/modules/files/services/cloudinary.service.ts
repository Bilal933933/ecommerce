/* eslint-disable @typescript-eslint/no-unused-vars */

// src/modules/files/services/cloudinary.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { FileType } from '@prisma/client';
import { SignedUrlResponse } from '../types/file.types';
import { AppConfigService } from 'src/config/config.service';
import { I18nService, I18nContext } from 'nestjs-i18n';

// مدة صلاحية Signed URL بالثواني
const SIGNED_URL_EXPIRY = 600; // 10 دقائق

// مجلدات Cloudinary حسب نوع الملف
const FOLDERS: Record<FileType, string> = {
  IMAGE: 'bayan/images',
  VIDEO: 'bayan/videos',
  AUDIO: 'bayan/audio',
  DOCUMENT: 'bayan/documents',
};

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly config: AppConfigService,
    private readonly i18n: I18nService,
  ) {
    cloudinary.config({
      cloud_name: this.config.cloudinaryCloudName,
      api_key: this.config.cloudinaryApiKey,
      api_secret: this.config.cloudinaryApiSecret,
    });
  }

  async generateSignedUrl(type: FileType): Promise<SignedUrlResponse> {
    try {
      const uploadSessionId = uuidv4();
      const publicId = `${FOLDERS[type]}/${uuidv4()}`;
      const timestamp = Math.round(Date.now() / 1000);

      const signature = cloudinary.utils.api_sign_request(
        { timestamp, public_id: publicId },
        this.config.cloudinaryApiSecret,
      );

      const cloudName = this.config.cloudinaryCloudName;
      const apiKey = this.config.cloudinaryApiKey;

      const signedUrl =
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload` +
        `?api_key=${apiKey}&timestamp=${timestamp}&signature=${signature}&public_id=${publicId}`;

      return { signedUrl, uploadSessionId, publicId };
    } catch {
      const lang = I18nContext.current()?.lang ?? 'ar';
      throw new InternalServerErrorException(
        await this.i18n.translate('errors.file.upload_url_failed', { lang }),
      );
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch {
      // نسجل الخطأ لكن لا نوقف العملية
      console.error(`فشل حذف الملف من Cloudinary: ${publicId}`);
    }
  }

  async deleteFiles(publicIds: string[]): Promise<void> {
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch {
      console.error(`فشل حذف الملفات من Cloudinary: ${publicIds.join(', ')}`);
    }
  }
}
