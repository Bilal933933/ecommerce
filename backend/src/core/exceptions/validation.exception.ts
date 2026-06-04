import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export interface ValidationError {
  field: string;
  messages: string[];
}

export class ValidationException extends BaseException {
  public readonly errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('VALIDATION_ERROR', HttpStatus.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }
}
