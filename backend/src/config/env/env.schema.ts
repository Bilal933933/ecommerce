import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class EnvSchema {
  // ─── Server ────────────────────────────────────────────────────────────

  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsNumber({}, { message: 'validation.number' })
  @IsInt({ message: 'validation.integer' })
  @Min(1000, { message: 'validation.min_length' })
  @Max(65535, { message: 'validation.max_length' })
  PORT: number;

  @IsString({ message: 'validation.string' })
  @IsIn(['development', 'production', 'test'], { message: 'validation.enum' })
  @IsOptional()
  NODE_ENV?: 'development' | 'production' | 'test';

  // ─── Database ──────────────────────────────────────────────────────────

  @IsString({ message: 'validation.string' })
  DATABASE_URL: string;

  // ─── JWT ───────────────────────────────────────────────────────────────

  @IsString({ message: 'validation.string' })
  JWT_SECRET: string;

  @IsString({ message: 'validation.string' })
  @IsOptional()
  JWT_EXPIRES_IN?: string;

  @IsString({ message: 'validation.string' })
  JWT_REFRESH_SECRET: string;

  @IsString({ message: 'validation.string' })
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN?: string;

  // ─── CORS ──────────────────────────────────────────────────────────────

  @IsString({ message: 'validation.string' })
  @IsOptional()
  CORS_ORIGIN_WEB?: string;

  @IsString({ message: 'validation.string' })
  @IsOptional()
  CORS_ORIGIN_ADMIN?: string;
}
