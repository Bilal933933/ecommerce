// src/modules/files/dto/confirm-upload.dto.ts

import { IsEnum, IsInt, IsString, IsUrl, Min } from 'class-validator';
import { FileType } from '@prisma/client';

export class ConfirmUploadDto {
  @IsUrl()
  url: string;

  @IsString()
  publicId: string;

  @IsString()
  uploadSessionId: string;

  @IsEnum(FileType)
  type: FileType;

  @IsInt()
  @Min(1)
  size: number;

  @IsString()
  mimeType: string;
}
