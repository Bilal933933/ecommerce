# Skill: Backend Core Patterns

## Description
Shared infrastructure patterns for NestJS backend: global exception filter, response interceptor, validation pipe, i18n integration, custom exceptions, logging interceptor.

## Context
- All files in `backend/src/core/`
- Global providers registered in `app.module.ts`

## Core Modules

### 1. Response Interceptor (`core/interceptors/response.interceptor.ts`)
Wraps ALL successful responses into uniform format:
```typescript
// Success (non-paginated)
{ success: true, data: T, message: string }

// Success (paginated)
{ success: true, data: T[], message: string, meta: PaginationMeta }
```
- Resolves message key via `@ResponseMessage()` decorator or HTTP method fallback
- Automatically detects paginated responses (objects with `data` + `meta` fields)

### 2. @ResponseMessage Decorator (`core/decorators/response-message.decorator.ts`)
```typescript
@ResponseMessage('responses.auth.login')
// Sets metadata key used by ResponseInterceptor for the message
```

### 3. Global Exception Filter (`core/filters/global-exception.filter.ts`)
Catches ALL exceptions and formats to:
```typescript
{ success: false, code: string, message: string, details?: string[], path: string, timestamp: string }
```
- Handles: HttpException, Prisma errors, Validation errors, Custom exceptions

### 4. Custom Exceptions (`core/exceptions/`)
| Exception | Purpose |
|-----------|---------|
| `BaseException` | Abstract base |
| `AuthException` | Auth-specific errors |
| `InternalException` | 500 Internal Server Error |
| `PrismaException` | Database errors |
| `ResourceNotFoundException` | 404 Not Found |
| `ValidationException` | 400 Bad Request |

### 5. I18nValidationPipe (`core/pipes/i18n-validation.pipe.ts`)
- Auto-validates incoming DTOs using `class-validator`
- Translates error messages using `nestjs-i18n`
- Throws formatted validation errors

### 6. LoggingInterceptor (`core/logger/logging.interceptor.ts`)
- Logs every request: method, URL, status code, duration
- Uses `LoggerModule` (custom logger service)

### 7. ApiResponse Interfaces (`core/interfaces/api-response.interface.ts`)
```typescript
interface ApiSuccess<T>        { success: true; data: T; message: string }
interface ApiSuccessPaginated<T> { success: true; data: T[]; message: string; meta: PaginationMeta }
interface ApiError             { success: false; code: string; message: string; details?: string[]; path: string; timestamp: string }
type ApiResponse<T> = ApiSuccess<T> | ApiSuccessPaginated<T> | ApiError;
interface PaginationMeta       { total; page; limit; totalPages; hasNextPage; hasPreviousPage }
```

### 8. i18n Setup
- **Library:** `nestjs-i18n`
- **Languages:** AR (fallback), EN
- **Files:** JSON in `src/i18n/{ar,en}/{errors,responses,validation}.json`
- **Resolvers:** Query param (`?lang=`), Accept-Language header, Header resolver
- **Module setup:** `I18nModule.forRoot()` in `app.module.ts`

### 9. AppConfigService
- Reads from YAML config files (`configration/`) + env vars
- Provides typed getters: `port`, `jwtSecret`, `dbUrl`, `resendApiKey`, `cloudinary*`, etc.
- All required configs throw descriptive error if missing

## Global Providers Registration Order (in `app.module.ts`)
```
1. GlobalExceptionFilter      (APP_FILTER)
2. JwtAuthGuard               (APP_GUARD) — global auth
3. RolesGuard                 (APP_GUARD) — global RBAC
4. I18nValidationPipe         (APP_PIPE)  — auto DTO validation
5. ResponseInterceptor        (APP_INTERCEPTOR) — uniform success responses
6. LoggingInterceptor         (APP_INTERCEPTOR) — request logging
```

## Repository Pattern
- Each module has a `[name].repository.ts` file
- Repository owns ALL Prisma queries
- Service NEVER imports Prisma directly
- Repository methods return plain data (no Prisma model exposure)

## DTO Pattern
- All DTOs use `class-validator` decorators
- Error messages use i18n keys: `{ message: 'validation.email.invalid' }`
- DTOs are PascalCase with `Dto` suffix
- Shared DTOs in `src/dto/`, module-specific in `module/dto/`
