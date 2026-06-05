import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsOptional()
  @IsString({ message: 'validation.product.variant.sku_must_be_string' })
  sku?: string;

  @IsNumber({}, { message: 'validation.product.variant.price_must_be_number' })
  @Type(() => Number)
  @Min(0, { message: 'validation.product.variant.price_min' })
  price: number;

  @IsOptional()
  @IsNumber(
    {},
    { message: 'validation.product.variant.compare_price_must_be_number' },
  )
  @Type(() => Number)
  @Min(0, { message: 'validation.product.variant.compare_price_min' })
  comparePrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'validation.product.variant.stock_must_be_number' })
  @Type(() => Number)
  @Min(0, { message: 'validation.product.variant.stock_min' })
  stock?: number;

  @IsOptional()
  @IsBoolean({ message: 'validation.product.variant.is_default_must_be_bool' })
  isDefault?: boolean;

  @IsOptional()
  @IsArray({
    message: 'validation.product.variant.attribute_value_ids_must_be_array',
  })
  @IsUUID(undefined, {
    each: true,
    message: 'validation.product.variant.attribute_value_id_must_be_uuid',
  })
  attributeValueIds?: string[];
}
