import { ValidationPipe, ValidationError } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';
import {
  ValidationException,
  ValidationError as IValidationError,
} from '../exceptions';

export class I18nValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  }

  createExceptionFactory() {
    return async (errors: ValidationError[]) => {
      const lang = I18nContext.current()?.lang ?? 'ar';
      const formatted = await this.formatErrors(errors, lang);
      return new ValidationException(formatted);
    };
  }

  private async formatErrors(
    errors: ValidationError[],
    lang: string,
  ): Promise<IValidationError[]> {
    const result: IValidationError[] = [];

    for (const error of errors) {
      // معالجة الأخطاء المتداخلة (nested)
      if (error.children && error.children.length > 0) {
        const nested = await this.formatErrors(error.children, lang);
        result.push(
          ...nested.map((n) => ({
            field: `${error.property}.${n.field}`,
            messages: n.messages,
          })),
        );
        continue;
      }

      const constraints = error.constraints ?? {};
      const messages = await Promise.all(
        Object.keys(constraints).map(async (constraintKey) => {
          const translationKey = constraints[constraintKey];

          // استخراج args للـ interpolation مثل {min}, {max}
          const args = (error.contexts?.[constraintKey] ?? {}) as Record<
            string,
            unknown
          >;

          const translated = await this.i18n.translate(translationKey, {
            lang,
            defaultValue: translationKey,
            args,
          });
          return String(translated);
        }),
      );

      result.push({
        field: error.property,
        messages,
      });
    }

    return result;
  }
}
