import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

// أكواد أخطاء Prisma الشائعة
export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT: 'P2002',
  NOT_FOUND: 'P2025',
  FOREIGN_KEY: 'P2003',
  NULL_CONSTRAINT: 'P2011',
} as const;

export class PrismaException extends BaseException {
  constructor(code: string = 'errors.database_error', details?: string[]) {
    super(code, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}

export class PrismaUniqueException extends BaseException {
  constructor(field?: string) {
    super(
      'errors.conflict',
      HttpStatus.CONFLICT,
      field ? [`errors.field_taken:${field}`] : undefined,
    );
  }
}

export class PrismaNotFoundException extends BaseException {
  constructor() {
    super('errors.not_found', HttpStatus.NOT_FOUND);
  }
}
