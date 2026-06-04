# Auth Module

**Description:** المصادقة الكاملة: تسجيل، دخول، JWT، الجلسات، التحقق من البريد، إعادة تعيين كلمة المرور، الصلاحيات.

## Key Components

| Element | Description |
|---------|-------------|
| `AuthController` | Routes: `/auth/*` (11 endpoints) |
| `AuthService` | Business logic للـ auth flows |
| `TokenService` | توليد وتجديد وإلغاء التوكنات |
| `JwtService` | توقيع وتحقق JWT |
| `HashService` | تشفير bcrypt ومقارنة |
| `JwtAuthGuard` | Guard عام (افتراضي على كل المسارات) |
| `RolesGuard` | فحص @Roles() decorator |
| `JwtStrategy` | Passport strategy لاستخراج JWT |
| `@Public()` | تجاوز JwtAuthGuard للمسارات العامة |
| `@CurrentUser()` | استخراج user من الطلب |
| `@Roles()` | تحديد صلاحية ADMIN |

## Dependencies & Context
- `SessionsModule` (إدارة refresh tokens)
- `UsersModule` (البحث عن المستخدمين)
- `EmailVerificationModule` (التحقق من البريد)
- `PasswordResetModule` (إعادة تعيين كلمة المرور)
- `AppConfigModule` (JWT secrets, expiry)
- Skills: `auth-skill.md`, `backend-core-skill.md`
