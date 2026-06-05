import { IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class FilterMyOrdersDto {
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
}
