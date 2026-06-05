import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryTranslationDto } from './category-translation.dto';

export class CreateCategoryDto {
  @IsOptional()
  @IsString({
    message: 'validation.category.icon_must_be_string',
  })
  icon?: string;

  @IsOptional()
  @IsString({
    message: 'validation.category.color_must_be_string',
  })
  color?: string;

  @IsOptional()
  @IsInt({
    message: 'validation.category.order_must_be_int',
  })
  @Min(0, {
    message: 'validation.category.order_min_value',
  })
  @Max(9999, {
    message: 'validation.category.order_max_value',
  })
  order?: number;

  @IsOptional()
  @IsBoolean({
    message: 'validation.category.is_active_must_be_bool',
  })
  isActive?: boolean;

  @IsOptional()
  @IsUUID(undefined, {
    message: 'validation.category.parent_id_must_be_uuid',
  })
  parentId?: string;

  @IsOptional()
  @IsUUID(undefined, {
    message: 'validation.category.image_file_id_must_be_uuid',
  })
  imageFileId?: string;

  @IsArray({
    message: 'validation.category.translations_must_be_array',
  })
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations: CategoryTranslationDto[];
}
