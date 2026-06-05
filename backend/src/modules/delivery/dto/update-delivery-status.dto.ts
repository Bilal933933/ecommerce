import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DeliveryStatus } from '@prisma/client';

export class UpdateDeliveryStatusDto {
  @IsEnum(DeliveryStatus, { message: 'validation.delivery.status_invalid' })
  status: DeliveryStatus;

  @IsOptional()
  @IsString({ message: 'validation.delivery.note_must_be_string' })
  note?: string;
}
