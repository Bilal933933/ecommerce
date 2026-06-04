import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'validation.email.invalid' })
  email: string;

  @IsNotEmpty({ message: 'validation.required' })
  @MinLength(8, {
    message: 'validation.min_length',
    context: { min: 8 },
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'validation.name.string' })
  name?: string;
}
