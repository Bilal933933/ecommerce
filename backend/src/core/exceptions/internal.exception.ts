import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class InternalException extends BaseException {
  constructor(code: string = 'errors.server_error', details?: string[]) {
    super(code, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}
