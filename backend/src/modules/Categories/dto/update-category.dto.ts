import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsArray, IsOptional, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryTranslationDto } from './category-translation.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsArray({
    message: 'validation.category.translations_must_be_array',
  })
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations?: CategoryTranslationDto[];

  @IsOptional()
  @IsUUID(undefined, {
    message: 'validation.category.image_file_id_must_be_uuid',
  })
  imageFileId?: string;
}
