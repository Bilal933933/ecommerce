import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'validation.email.invalid' })
  email: string;

  @IsString({ message: 'validation.password.string' })
  password: string;
}
