import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType, ProductStatus } from '@prisma/client';
import { ProductTranslationDto } from './product-translation.dto';
import { CreateVariantDto } from './create-variant.dto';

export class CreateAttributeValueTranslationDto {
  @IsString({
    message:
      'validation.product.attribute.value_translation.name_must_be_string',
  })
  name: string;

  @IsEnum(['ar', 'en'], {
    message: 'validation.product.attribute.value_translation.invalid_locale',
  })
  locale: 'ar' | 'en';
}

export class CreateAttributeValueDto {
  @IsArray({ message: 'validation.product.attribute.values_must_be_array' })
  @ValidateNested({ each: true })
  @Type(() => CreateAttributeValueTranslationDto)
  translations: CreateAttributeValueTranslationDto[];

  @IsOptional()
  @Type(() => Number)
  order?: number;
}

export class CreateAttributeTranslationDto {
  @IsString({
    message: 'validation.product.attribute.translation.name_must_be_string',
  })
  name: string;

  @IsEnum(['ar', 'en'], {
    message: 'validation.product.attribute.translation.invalid_locale',
  })
  locale: 'ar' | 'en';
}

export class CreateAttributeDto {
  @IsArray({
    message: 'validation.product.attribute.translations_must_be_array',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateAttributeTranslationDto)
  translations: CreateAttributeTranslationDto[];

  @IsArray({ message: 'validation.product.attribute.values_must_be_array' })
  @ValidateNested({ each: true })
  @Type(() => CreateAttributeValueDto)
  values: CreateAttributeValueDto[];

  @IsOptional()
  @Type(() => Number)
  order?: number;
}

export class CreateProductDto {
  @IsEnum(ProductType, { message: 'validation.product.type_must_be_enum' })
  type: ProductType;

  @IsOptional()
  @IsEnum(ProductStatus, { message: 'validation.product.status_must_be_enum' })
  status?: ProductStatus;

  @IsOptional()
  @IsUUID(undefined, { message: 'validation.product.category_id_must_be_uuid' })
  categoryId?: string;

  @IsOptional()
  @IsString({ message: 'validation.product.video_url_must_be_string' })
  videoUrl?: string;

  @IsArray({ message: 'validation.product.translations_must_be_array' })
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto[];

  @IsOptional()
  @IsArray({ message: 'validation.product.attributes_must_be_array' })
  @ValidateNested({ each: true })
  @Type(() => CreateAttributeDto)
  attributes?: CreateAttributeDto[];

  @IsOptional()
  @IsArray({ message: 'validation.product.variants_must_be_array' })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];

  @IsOptional()
  @IsArray({ message: 'validation.product.images_must_be_array' })
  @IsUUID(undefined, {
    each: true,
    message: 'validation.product.image_id_must_be_uuid',
  })
  imageFileIds?: string[];
}
