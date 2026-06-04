# Backend Core Layer

**Description:** الطبقة المشتركة للبنية التحتية: معالجة الأخطاء، توحيد الردود، التحقق من الصحة، i18n، والتسجيل.

## Subdirectories

| Directory | Description |
|-----------|-------------|
| `constants/` | `exam.constants.ts` (PASSING_SCORE = 50) |
| `decorators/` | `@ResponseMessage()` decorator |
| `exceptions/` | 6 custom exceptions (base, auth, internal, prisma, resource, validation) |
| `filters/` | `GlobalExceptionFilter` — يصطاد كل الأخطاء ويوحد شكلها |
| `interceptors/` | `ResponseInterceptor` — يلف ردود النجاح بـ `{ success, data, message }` |
| `interfaces/` | ApiResponse<T>, ApiSuccess, ApiError, PaginationMeta |
| `logger/` | `LoggerModule` + `LoggingInterceptor` لتسجيل الطلبات |
| `pipes/` | `I18nValidationPipe` — تحقق تلقائي من DTOs مع ترجمة الأخطاء |
| `resolvers/` | `AcceptLanguageResolver` |
| `utils/` | دوال مساعدة |

## Global Response Format
```typescript
// نجاح
{ success: true, data: T, message: "مترجم من i18n" }

// نجاح مع pagination
{ success: true, data: T[], message: "...", meta: { total, page, limit, totalPages, hasNextPage, hasPreviousPage } }

// خطأ
{ success: false, code: "ERROR_CODE", message: "مترجم", details?: string[], path: "/api/...", timestamp: "2026-..." }
```

## Dependencies & Context
- `nestjs-i18n` (ترجمة الرسائل)
- `@nestjs/core` (Reflector للـ decorators)
- `rxjs` (Observable للـ interceptors)
- كل الموديولات في `modules/` تعتمد على هذه الطبقة
- Skills: `backend-core-skill.md`
