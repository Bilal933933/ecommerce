import { IsUUID, IsOptional, IsString } from 'class-validator';

export class UpdateProofDto {
  @IsUUID('4', { message: 'validation.delivery.file_id_must_be_uuid' })
  fileId: string;

  @IsOptional()
  @IsString({ message: 'validation.delivery.recipient_name_must_be_string' })
  recipientName?: string;
}
