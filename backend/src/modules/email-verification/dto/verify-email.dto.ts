import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @IsString({ message: 'validation.token.string' })
  @IsNotEmpty({ message: 'validation.token.required' })
  token!: string;
}
