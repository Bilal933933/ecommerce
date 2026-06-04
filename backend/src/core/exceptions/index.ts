export { BaseException } from './base.exception';
export type { ExceptionDetails } from './base.exception';

export { ValidationException } from './validation.exception';
export type { ValidationError } from './validation.exception';

export { UnauthorizedException, ForbiddenException } from './auth.exception';

export { NotFoundException, ConflictException } from './resource.exception';

export {
  PrismaException,
  PrismaUniqueException,
  PrismaNotFoundException,
  PRISMA_ERROR_CODES,
} from './prisma.exception';

export { InternalException } from './internal.exception';
