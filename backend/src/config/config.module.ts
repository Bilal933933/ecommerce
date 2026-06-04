import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './env/env.validation';
import { AppConfigService } from './config.service';

import appConfig from './configration/app.config';
import authConfig from './configration/auth.config';
import databaseConfig from './configration/database.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      load: [appConfig, authConfig, databaseConfig],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
