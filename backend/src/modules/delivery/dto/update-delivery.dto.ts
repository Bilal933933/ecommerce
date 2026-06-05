import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString({ message: 'validation.delivery.driver_id_must_be_string' })
  driverId?: string;

  @IsOptional()
  @IsString({ message: 'validation.delivery.courier_name_must_be_string' })
  courierName?: string;

  @IsOptional()
  @IsString({ message: 'validation.delivery.tracking_number_must_be_string' })
  trackingNumber?: string;

  @IsOptional()
  @IsString({ message: 'validation.delivery.tracking_url_must_be_string' })
  trackingUrl?: string;

  @IsOptional()
  @IsDateString({}, { message: 'validation.delivery.estimated_at_invalid' })
  estimatedAt?: string;

  @IsOptional()
  @IsString({ message: 'validation.delivery.notes_must_be_string' })
  notes?: string;
}
