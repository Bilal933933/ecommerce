import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'validation.refresh_token.string' })
  @IsNotEmpty({ message: 'validation.refresh_token.required' })
  refreshToken: string;
}
