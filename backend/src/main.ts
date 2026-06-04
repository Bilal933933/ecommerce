/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { I18nValidationPipe } from './core/pipes/i18n-validation.pipe';
import { AppConfigService } from './config/config.service';
import { AppModule } from './modules/app/app.module';
// import { GlobalExceptionFilter } from './core/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);
  const i18n = app.get(I18nService);

  app.useGlobalPipes(new I18nValidationPipe(i18n));
  // app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: [configService.corsOriginWeb, configService.corsOriginAdmin],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  console.log(configService.corsOriginWeb);
  console.log(configService.corsOriginAdmin);

  await app.listen(configService.port);
}
bootstrap();
