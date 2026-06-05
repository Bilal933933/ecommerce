import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { Locale } from '@prisma/client';

export class ProductTranslationDto {
  @IsEnum(Locale, { message: 'validation.product.translation.invalid_locale' })
  locale: Locale;

  @IsString({ message: 'validation.product.translation.name_must_be_string' })
  @MaxLength(200, { message: 'validation.product.translation.name_too_long' })
  name: string;

  @IsOptional()
  @IsString({
    message: 'validation.product.translation.description_must_be_string',
  })
  @MaxLength(5000, {
    message: 'validation.product.translation.description_too_long',
  })
  description?: string;
}
