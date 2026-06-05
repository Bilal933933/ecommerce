import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { Locale } from '@prisma/client';

export class CategoryTranslationDto {
  @IsEnum(Locale, {
    message: 'validation.category.translation.invalid_locale',
  })
  locale: Locale;

  @IsString({
    message: 'validation.category.translation.name_must_be_string',
  })
  @MaxLength(100, {
    message: 'validation.category.translation.name_too_long',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: 'validation.category.translation.description_must_be_string',
  })
  @MaxLength(500, {
    message: 'validation.category.translation.description_too_long',
  })
  description?: string;
}
