# Password Reset Module

**Description:** إعادة تعيين كلمة المرور: إرسال رابط إعادة التعيين، التحقق من التوكن، تعيين كلمة مرور جديدة.

## Key Components

| Element | Description |
|---------|-------------|
| `PasswordResetController` | Routes لإعادة تعيين كلمة المرور |
| `PasswordResetService` | Business logic للإرسال وإعادة التعيين |
| `PrismaPasswordResetRepository` | تطبيق Prisma |
| `PasswordResetRepositoryInterface` | واجهة الـ Repository |
| `ForgotPasswordDto` | DTO لطلب إعادة التعيين (email) |
| `ResetPasswordDto` | DTO لتعيين كلمة جديدة (token + password) |

## Flow
```
forgot-password → create token in password_resets table → send email with link
reset-password → validate token → hash new password → update user → delete token
```

## Dependencies & Context
- `PrismaModule`
- `MailModule` (إرسال البريد)
- `UsersModule` (تحديث كلمة المرور)
- Skills: `auth-skill.md`, `backend-core-skill.md`
