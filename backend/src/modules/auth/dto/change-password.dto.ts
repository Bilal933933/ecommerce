import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'validation.old_password.string' })
  @IsNotEmpty({ message: 'validation.old_password.required' })
  oldPassword: string;

  @IsString({ message: 'validation.new_password.string' })
  @IsNotEmpty({ message: 'validation.new_password.required' })
  @MinLength(8, { message: 'validation.new_password.min_length' })
  newPassword: string;
}
