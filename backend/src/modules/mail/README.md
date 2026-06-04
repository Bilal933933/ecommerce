# Mail Module

**Description:** خدمة البريد الإلكتروني عبر Resend API: إرسال رسائل التحقق من البريد وإعادة تعيين كلمة المرور.

## Key Components

| Element | Description |
|---------|-------------|
| `MailService` | إرسال البريد عبر Resend API |
| `MailModule` | تعريف الموديول |
| `verify-email.template.ts` | قالب بريد التحقق |
| `reset-password.template.ts` | قالب بريد إعادة التعيين |

## Key Functions
- `sendVerificationEmail(userId, email, token)`: إرسال رابط التحقق
- `sendPasswordResetEmail(userId, email, token)`: إرسال رابط إعادة التعيين

## Dependencies & Context
- `AppConfigService` (RESEND_API_KEY, MAIL_FROM, APP_URL)
- Skills: `auth-skill.md`, `backend-core-skill.md`
