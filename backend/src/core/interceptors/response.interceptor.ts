import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import {
  ApiSuccess,
  ApiSuccessPaginated,
  PaginationMeta,
} from '../interfaces/api-response.interface';

type PaginatedData<T> = {
  data: T[];
  meta: PaginationMeta;
};

const METHOD_KEY_MAP: Record<string, string> = {
  POST: 'responses.default.post',
  GET: 'responses.default.get',
  PATCH: 'responses.default.patch',
  PUT: 'responses.default.patch',
  DELETE: 'responses.default.delete',
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccess<T> | ApiSuccessPaginated<T>
> {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccess<T> | ApiSuccessPaginated<T>> {
    return next.handle().pipe(
      map((data) => {
        const request = context
          .switchToHttp()
          .getRequest<{ method: string; url: string }>();
        const lang = I18nContext.current()?.lang ?? 'ar';

        const messageKey = this.resolveMessageKey(context, request.method);
        const message = String(this.i18n.translate(messageKey, { lang }));

        const paginatedData = this.extractPaginated<T>(data);

        if (paginatedData) {
          return {
            success: true,
            data: paginatedData.data,
            message,
            meta: paginatedData.meta,
          } satisfies ApiSuccessPaginated<T>;
        }

        return {
          success: true,
          data: (data ?? null) as T,
          message,
        } satisfies ApiSuccess<T>;
      }),
    );
  }

  private resolveMessageKey(context: ExecutionContext, method: string): string {
    // أولاً: مفتاح صريح من الـ Decorator
    const decoratorKey = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (decoratorKey) return decoratorKey;

    // ثانياً: fallback حسب HTTP Method
    return METHOD_KEY_MAP[method] ?? 'responses.default.get';
  }

  private extractPaginated<U>(data: unknown): PaginatedData<U> | null {
    if (
      data !== null &&
      typeof data === 'object' &&
      'meta' in data &&
      'data' in data
    ) {
      return data as PaginatedData<U>;
    }
    return null;
  }
}
