import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class FilterAdminOrdersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.orders.page_must_be_int' })
  @Min(1, { message: 'validation.orders.page_min' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.orders.limit_must_be_int' })
  @Min(1, { message: 'validation.orders.limit_min' })
  @Max(100, { message: 'validation.orders.limit_max' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'validation.orders.status_invalid' })
  status?: OrderStatus;

  @IsOptional()
  @IsString({ message: 'validation.orders.search_must_be_string' })
  orderNumber?: string;

  @IsOptional()
  @IsString({ message: 'validation.orders.user_id_must_be_string' })
  userId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'validation.orders.date_from_invalid' })
  dateFrom?: string;

  @IsOptional()
  @IsDateString({}, { message: 'validation.orders.date_to_invalid' })
  dateTo?: string;
}
