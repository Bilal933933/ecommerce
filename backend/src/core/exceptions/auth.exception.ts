import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(code: string = 'errors.unauthorized', details?: string[]) {
    super(code, HttpStatus.UNAUTHORIZED, details);
  }
}

export class ForbiddenException extends BaseException {
  constructor(code: string = 'errors.forbidden', details?: string[]) {
    super(code, HttpStatus.FORBIDDEN, details);
  }
}
