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
import { DeliveryStatus, DeliveryType } from '@prisma/client';

export class FilterAdminDeliveriesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.delivery.page_must_be_int' })
  @Min(1, { message: 'validation.delivery.page_min' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'validation.delivery.limit_must_be_int' })
  @Min(1, { message: 'validation.delivery.limit_min' })
  @Max(100, { message: 'validation.delivery.limit_max' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(DeliveryStatus, { message: 'validation.delivery.status_invalid' })
  status?: DeliveryStatus;

  @IsOptional()
  @IsEnum(DeliveryType, { message: 'validation.delivery.type_invalid' })
  type?: DeliveryType;

  @IsOptional()
  @IsString({ message: 'validation.delivery.driver_id_must_be_string' })
  driverId?: string;

  @IsOptional()
  @IsString({ message: 'validation.delivery.order_id_required' })
  orderId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'validation.delivery.date_from_invalid' })
  dateFrom?: string;

  @IsOptional()
  @IsDateString({}, { message: 'validation.delivery.date_to_invalid' })
  dateTo?: string;
}
