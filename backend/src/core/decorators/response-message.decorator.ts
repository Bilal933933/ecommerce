import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'response_message_key';

/**
 * يُستخدم لتحديد مفتاح رسالة النجاح في الـ Controller
 * @example
 * @ResponseMessage('responses.auth.login')
 * @Post('login')
 * login() { }
 */
export const ResponseMessage = (key: string): MethodDecorator =>
  SetMetadata(RESPONSE_MESSAGE_KEY, key);
