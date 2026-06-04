import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3000,
  corsOriginWeb: process.env.CORS_ORIGIN_WEB ?? 'http://localhost:5173',
  corsOriginAdmin: process.env.CORS_ORIGIN_ADMIN ?? 'http://localhost:5174',
}));
