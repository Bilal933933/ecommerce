// src/modules/files/dto/signed-url.dto.ts

import { IsEnum, IsInt, IsString, Max, Min } from 'class-validator';
import { FileType } from '@prisma/client';

// الحد الأقصى لحجم الملف بالبايت
const MAX_SIZES: Record<FileType, number> = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 500 * 1024 * 1024, // 500MB
  AUDIO: 50 * 1024 * 1024, // 50MB
  DOCUMENT: 20 * 1024 * 1024, // 20MB
};

export class SignedUrlDto {
  @IsEnum(FileType)
  type: FileType;

  @IsString()
  mimeType: string;

  @IsInt()
  @Min(1)
  size: number;
}

export { MAX_SIZES };
