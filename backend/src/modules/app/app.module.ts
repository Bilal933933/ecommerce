import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  AcceptLanguageResolver,
  I18nModule,
  I18nService,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';

import { GlobalExceptionFilter } from '../../core/filters/global-exception.filter';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { I18nValidationPipe } from '../../core/pipes/i18n-validation.pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from '../../core/logger/logging.interceptor';
import { AppLoggerModule } from '../../core/logger/logger.module';
import { AppConfigModule } from '../../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MailModule } from '../mail/mail.module';
import { FilesModule } from '../files/files.module';
import { AdminModule } from '../admin/admin.module';
import { ContactModule } from '../contact/contact.module';
import { CategoriesModule } from '../Categories/categories.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    AppConfigModule,
    AppLoggerModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    FilesModule,
    AdminModule,
    ContactModule,
    CategoriesModule,
    ProductsModule,
    I18nModule.forRoot({
      fallbackLanguage: 'ar',
      loaderOptions: {
        path: path.join(process.cwd(), 'src/i18n'),
        watch: process.env.NODE_ENV !== 'production',
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        HeaderResolver,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // ١. الفلتر العام — يعترض كل الأخطاء
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // ← أولاً
    { provide: APP_GUARD, useClass: RolesGuard }, // ← ثانياً
    // ٢. الـ Pipe — useFactory لضمان حقن I18nService بشكل صحيح
    {
      provide: APP_PIPE,
      useFactory: (i18n: I18nService) => new I18nValidationPipe(i18n),
      inject: [I18nService],
    },
    // ٣. الـ Interceptor — يوحد شكل ردود النجاح
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
