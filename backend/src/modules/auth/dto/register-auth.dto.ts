import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'validation.email.invalid' })
  email: string;

  @IsString({ message: 'validation.password.string' })
  @MinLength(8, { message: 'validation.password.min_length' })
  password: string;

  @IsOptional()
  @IsString({ message: 'validation.name.string' })
  name?: string;
}
