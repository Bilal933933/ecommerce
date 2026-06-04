import { HttpException, HttpStatus } from '@nestjs/common';

export interface ExceptionDetails {
  details?: string[];
  [key: string]: unknown;
}

export class BaseException extends HttpException {
  public readonly code: string;
  public readonly details?: string[];

  constructor(code: string, status: HttpStatus, details?: string[]) {
    super(
      {
        success: false,
        code,
        details,
      },
      status,
    );

    this.code = code;
    this.details = details;
  }
}
