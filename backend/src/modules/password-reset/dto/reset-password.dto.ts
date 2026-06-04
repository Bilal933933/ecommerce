import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'validation.token.string' })
  @IsNotEmpty({ message: 'validation.token.required' })
  token!: string;

  @IsString({ message: 'validation.new_password.string' })
  @IsNotEmpty({ message: 'validation.new_password.required' })
  @MinLength(8, { message: 'validation.new_password.min_length' })
  newPassword!: string;
}
