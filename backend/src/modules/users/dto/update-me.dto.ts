import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '@prisma/client';

// ✅ DTO مستقل للمستخدم لتعديل بروفايله
// (لا يستخدم DTO الـ Admin حتى لا يُسمح بتعديل role/isActive)
export class UpdateMeDto {
  @IsOptional()
  @IsString({ message: 'errors.validation.string' })
  @MinLength(2, { message: 'errors.validation.min_length' })
  @MaxLength(100, { message: 'errors.validation.max_length' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'errors.validation.email.invalid' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'errors.validation.string' })
  @MaxLength(100, { message: 'errors.validation.max_length' })
  deviceName?: string | null;

  @IsOptional()
  @IsString({ message: 'errors.validation.string' })
  // يقبل صيغة E.164: +9665XXXXXXXX أو أرقام محلية مع شرطات ومسافات
  @Matches(/^[+]?[\d\s\-()]{7,20}$/, {
    message: 'errors.validation.phone.invalid',
  })
  phone?: string | null;

  @IsOptional()
  @IsString({ message: 'errors.validation.string' })
  @MaxLength(500, { message: 'errors.validation.bio.too_long' })
  bio?: string | null;

  @IsOptional()
  @IsEnum(Gender, { message: 'errors.validation.enum' })
  gender?: Gender | null;

  @IsOptional()
  @IsDateString({}, { message: 'errors.validation.date.invalid' })
  birthDate?: string | null;
}
