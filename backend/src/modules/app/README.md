# App Module (Root)

**Description:** الموديول الجذر للتطبيق. يسجل جميع الموديولات والـ Global Providers.

## Key Components

| Element | Description |
|---------|-------------|
| `AppModule` | تسجيل 16 موديول + 6 Global Providers |
| `AppController` | Health check endpoint (`GET /`) |
| `AppService` | خدمة جذر بسيطة |

## Global Providers (registered in AppModule)
1. `GlobalExceptionFilter` — توحيد شكل الأخطاء
2. `JwtAuthGuard` — حماية جميع المسارات افتراضياً
3. `RolesGuard` — فحص صلاحية ADMIN
4. `I18nValidationPipe` — تحقق تلقائي من DTOs
5. `ResponseInterceptor` — توحيد شكل ردود النجاح
6. `LoggingInterceptor` — تسجيل الطلبات

## Dependencies & Context
- جميع موديولات الـ Backend الـ 16
- `I18nModule` (nestjs-i18n) مع YAML fallback
- Skills: `backend-core-skill.md`
