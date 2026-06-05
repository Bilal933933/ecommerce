import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'validation.orders.status_invalid' })
  status: OrderStatus;

  @IsOptional()
  @IsString({ message: 'validation.orders.note_must_be_string' })
  note?: string;
}
