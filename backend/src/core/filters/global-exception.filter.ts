/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nService, I18nContext } from 'nestjs-i18n';

import {
  BaseException,
  ValidationException,
  PrismaException,
  PrismaUniqueException,
  PrismaNotFoundException,
  PRISMA_ERROR_CODES,
  InternalException,
} from '../exceptions';
import { ApiError } from '../interfaces/api-response.interface';

interface PrismaError {
  code: string;
  meta?: { target?: string[] };
}

type NormalizedError = {
  code: string;
  message: string;
  status: number;
  details?: string[];
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{
      url: string;
      headers: Record<string, string>;
      query: Record<string, string>;
    }>();

    const lang = this.resolveLang(request);

    const normalized = await this.normalize(exception, lang);

    const body: ApiError = {
      success: false,
      code: normalized.code,
      message: normalized.message,
      details: normalized.details,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (normalized.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    httpAdapter.reply(ctx.getResponse(), body, normalized.status);
  }

  private async normalize(
    exception: unknown,
    lang: string,
  ): Promise<NormalizedError> {
    // ١. ValidationException
    if (exception instanceof ValidationException) {
      const message = await this.translate('errors.validation_error', lang);
      return {
        code: exception.code,
        message,
        status: exception.getStatus(),
        details: exception.errors.map(
          (e) => `${e.field}: ${e.messages.join(', ')}`,
        ),
      };
    }

    // ٢. BaseException (كل الأخطاء المخصصة)
    if (exception instanceof BaseException) {
      const message = await this.translate(exception.code, lang);
      return {
        code: exception.code,
        message,
        status: exception.getStatus(),
        details: exception.details,
      };
    }

    // ٣. HttpException المدمجة في NestJS
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const customCode =
        typeof response === 'string'
          ? response
          : typeof response === 'object' && response !== null
            ? (response as Record<string, unknown>).message
            : undefined;
      const code =
        typeof customCode === 'string' && customCode.startsWith('errors.')
          ? customCode
          : this.httpStatusToCode(status);
      const message = await this.translate(code, lang);
      return { code, message, status };
    }

    // ٤. Prisma Errors
    if (this.isPrismaError(exception)) {
      return this.handlePrismaError(exception, lang);
    }

    // ٥. أخطاء غير متوقعة
    const fallback = new InternalException();
    const message = await this.translate(fallback.code, lang);
    return {
      code: fallback.code,
      message,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  private async handlePrismaError(
    exception: PrismaError,
    lang: string,
  ): Promise<NormalizedError> {
    switch (exception.code) {
      case PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT: {
        const field = exception.meta?.target?.[0];
        const err = new PrismaUniqueException(field);
        const message = await this.translate(err.code, lang);
        return { code: err.code, message, status: err.getStatus() };
      }
      case PRISMA_ERROR_CODES.NOT_FOUND: {
        const err = new PrismaNotFoundException();
        const message = await this.translate(err.code, lang);
        return { code: err.code, message, status: err.getStatus() };
      }
      default: {
        const err = new PrismaException();
        const message = await this.translate(err.code, lang);
        return { code: err.code, message, status: err.getStatus() };
      }
    }
  }

  private resolveLang(request: {
    headers: Record<string, string>;
    query: Record<string, string>;
  }): string {
    const ctxLang = I18nContext.current()?.lang;
    if (ctxLang) return ctxLang;

    const queryLang = request.query?.['lang'];
    if (queryLang) return queryLang;

    const acceptLang = request.headers?.['accept-language'];
    if (acceptLang) return acceptLang.split(',')[0].split('-')[0].trim();

    return 'ar';
  }

  private httpStatusToCode(status: number): string {
    const map: Record<number, string> = {
      [HttpStatus.NOT_FOUND]: 'errors.not_found',
      [HttpStatus.UNAUTHORIZED]: 'errors.unauthorized',
      [HttpStatus.FORBIDDEN]: 'errors.forbidden',
      [HttpStatus.CONFLICT]: 'errors.conflict',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'errors.server_error',
      [HttpStatus.BAD_REQUEST]: 'errors.validation_error',
    };
    return map[status] ?? 'errors.server_error';
  }

  private isPrismaError(exception: unknown): exception is PrismaError {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as PrismaError).code === 'string' &&
      (exception as PrismaError).code.startsWith('P')
    );
  }

  private async translate(key: string, lang: string): Promise<string> {
    try {
      const result = await this.i18n.translate(key, {
        lang,
        defaultValue: key,
      });
      return String(result);
    } catch {
      return key;
    }
  }
}
