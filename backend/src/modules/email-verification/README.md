# Email Verification Module

**Description:** التحقق من البريد الإلكتروني: إرسال رابط التحقق عند التسجيل، تأكيد البريد، إعادة الإرسال.

## Key Components

| Element | Description |
|---------|-------------|
| `EmailVerificationController` | Routes للتحقق من البريد |
| `EmailVerificationService` | Business logic للإرسال والتحقق |
| `PrismaEmailVerificationRepository` | تطبيق Prisma |
| `EmailVerificationRepositoryInterface` | واجهة الـ Repository |
| `VerifyEmailDto` | DTO لتأكيد البريد (token) |

## Flow
```
register → sendVerificationEmail(userId)
  → create token in email_verifications table
  → send email with link containing token
verify-email → find token → mark used → update user.isEmailVerified
```

## Dependencies & Context
- `PrismaModule`
- `MailModule` (إرسال البريد)
- `UsersModule` (تحديث حالة isEmailVerified)
- Skills: `auth-skill.md`, `backend-core-skill.md`
