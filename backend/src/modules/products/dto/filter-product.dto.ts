import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType, ProductStatus } from '@prisma/client';

export class FilterProductDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.product.filter.page_must_be_int' })
  @Min(1, { message: 'validation.product.filter.page_min' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.product.filter.limit_must_be_int' })
  @Min(1, { message: 'validation.product.filter.limit_min' })
  @Max(100, { message: 'validation.product.filter.limit_max' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'validation.product.filter.search_must_be_string' })
  search?: string;

  @IsOptional()
  @IsEnum(ProductType, { message: 'validation.product.filter.invalid_type' })
  type?: ProductType;

  @IsOptional()
  @IsEnum(ProductStatus, {
    message: 'validation.product.filter.invalid_status',
  })
  status?: ProductStatus;

  @IsOptional()
  @IsUUID(undefined, {
    message: 'validation.product.filter.category_id_must_be_uuid',
  })
  categoryId?: string;
}
