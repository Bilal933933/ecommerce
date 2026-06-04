# Auth Feature

**Description:** إدارة تسجيل الدخول، إنشاء حساب، التحقق من البريد، إعادة تعيين كلمة المرور، وتسجيل الخروج.

## Key Components & Functions

| Element | Description |
|---------|-------------|
| `LoginPage` / `LoginForm` | نموذج تسجيل الدخول |
| `RegisterPage` / `RegisterForm` | نموذج إنشاء حساب جديد |
| `ForgotPasswordPage` / `ForgotPasswordForm` | طلب إعادة تعيين كلمة المرور |
| `ResetPasswordPage` / `ResetPasswordForm` | تعيين كلمة مرور جديدة |
| `VerifyEmailPage` / `VerifyEmailForm` | تأكيد البريد الإلكتروني |
| `useLogin` | Mutation: login → setAuth → navigate |
| `useRegister` | Mutation: register → setAuth → navigate |
| `useForgotPassword` | Mutation: forgot password request |
| `useResetPassword` | Mutation: reset password with token |
| `useVerifyEmail` | Mutation: verify email with token |
| `useResendVerification` | Mutation: resend verification email |
| `login.schema.ts` | Zod schema: email + password |
| `register.schema.ts` | Zod schema: name + email + password + confirm |

## Dependencies & Context
- `@workspace/store` → `useAuthStore` (JWT tokens, user state, hydration)
- `@workspace/api-client` → `authClient` (HTTP requests)
- `@workspace/locales` → `locales[lang].auth` (i18n)
- `@workspace/ui` → Button, Input, Label, Field, FieldError
- Backend: `modules/auth/`, `modules/email-verification/`, `modules/password-reset/`
- Routes: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/verify-email`, `/auth/reset-password`
- Guards: `AuthGuard` (redirect if unauthenticated), `GuestGuard` (redirect if authenticated)
- Skills: `auth-skill.md`, `frontend-pattern-skill.md`
