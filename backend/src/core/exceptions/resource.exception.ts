import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(code: string = 'errors.not_found', details?: string[]) {
    super(code, HttpStatus.NOT_FOUND, details);
  }
}

export class ConflictException extends BaseException {
  constructor(code: string = 'errors.conflict', details?: string[]) {
    super(code, HttpStatus.CONFLICT, details);
  }
}
