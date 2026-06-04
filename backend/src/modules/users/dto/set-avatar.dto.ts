import { IsString, IsUUID } from 'class-validator';

export class SetAvatarDto {
  @IsString({ message: 'errors.validation.string' })
  @IsUUID('4', { message: 'errors.validation.string' })
  fileId: string;
}
