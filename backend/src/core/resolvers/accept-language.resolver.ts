/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext } from '@nestjs/common';

export interface I18nResolver {
  resolve(context: ExecutionContext): string | Promise<string>;
}

export class AcceptLanguageResolver implements I18nResolver {
  resolve(context: ExecutionContext): string | Promise<string> {
    const request = context.switchToHttp().getRequest();
    const lang = request.headers?.['accept-language'];

    if (lang && typeof lang === 'string') {
      // Handle formats like "ar-SA,en;q=0.9,en-US;q=0.8"
      const primaryLang = lang.split(',')[0].split('-')[0];
      return primaryLang;
    }

    return 'en'; // Fallback to English
  }
}
