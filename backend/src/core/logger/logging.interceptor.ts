import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface ExpressRequest {
  method: string;
  url: string;
}

interface ExpressResponse {
  statusCode: number;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectPinoLogger(LoggingInterceptor.name)
    private readonly logger: PinoLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          // تسجيل الطلبات الناجحة فقط — pino-http يسجل الـ request تلقائياً
          // نسجل هنا فقط معلومات إضافية عند الحاجة
          const response = context
            .switchToHttp()
            .getResponse<ExpressResponse>();
          const duration = Date.now() - startTime;

          this.logger.debug(
            { method, url, statusCode: response.statusCode, duration },
            'Request completed',
          );
        },
        error: (err: Error) => {
          // لا نسجل الخطأ هنا — GlobalExceptionFilter مسؤول عن ذلك
          // نسجل فقط الـ duration للمراقبة
          const duration = Date.now() - startTime;

          this.logger.debug(
            { method, url, error: err.message, duration },
            'Request failed',
          );
        },
      }),
    );
  }
}
