# Skill: Authentication System

## Description
Full authentication flow: register, login, JWT (access + refresh tokens), session management, email verification, password reset (forgot/reset), role-based guards, and logout (single/all devices).

## Context
- Backend: NestJS `src/modules/auth/`, `src/modules/sessions/`, `src/modules/email-verification/`, `src/modules/password-reset/`
- Frontend: `apps/web/src/features/auth/` + `packages/api-client/src/auth/` + `packages/store/src/auth.store.ts`
- DB: `users`, `sessions`, `email_verifications`, `password_resets` tables

## Backend Reference

### Auth Module Structure
```
modules/auth/
├── dto/
│   ├── login-auth.dto.ts        # LoginDto (email, password)
│   ├── register-auth.dto.ts     # RegisterDto (email, password, name?)
│   ├── change-password.dto.ts   # ChangePasswordDto
│   └── refresh-token.dto.ts     # RefreshTokenDto
├── types/
│   ├── jwt-payload.type.ts      # JwtPayload { sub, email, role, specializationId }
│   └── authenticatedrequest.type.ts  # AuthenticatedRequest
├── decorators/
│   ├── public.decorator.ts      # @Public() — bypass JwtAuthGuard
│   ├── current-user.decorator.ts # @CurrentUser() — extract user from request
│   └── roles.decorator.ts       # @Roles(Role.ADMIN) — RBAC
├── guards/
│   ├── jwt-auth.guard.ts        # Global guard, checks JWT, uses @Public()
│   └── roles.guard.ts           # Global guard, checks @Roles()
├── strategies/
│   └── jwt.strategy.ts          # Passport strategy for JWT extraction
├── services/
│   ├── auth.service.ts          # Business logic: register, login, logout, changePassword
│   ├── token.service.ts         # Token generation, refresh, revocation
│   ├── jwt.service.ts           # Low-level JWT sign/verify
│   └── hash.service.ts          # bcrypt hash/compare
├── auth.controller.ts           # Routes: /auth/*
└── auth.module.ts               # Module definition
```

### Auth Flow
```
register/login → JwtPayload → accessToken (15m JWT) + refreshToken (7d opaque)
  ↓
refreshToken stored in sessions table (hashed lookup)
  ↓
on refresh: validate session → generate new accessToken + rotation refreshToken
  ↓
on logout: revoke session → client clears storage
```

### Key Interfaces
```typescript
// AuthResult (return from service)
interface AuthResult {
  user: UserWithoutPassword;
  accessToken: string;
  refreshToken: string;
}

// JwtPayload
interface JwtPayload {
  sub: string;             // userId
  email: string;
  role: Role;
  specializationId: string | null;
}
```

### i18n Keys Used
- `errors.auth.invalid_credentials` / `email_taken` / `account_disabled` / `same_password`
- `responses.auth.login` / `register` / `refresh` / `logout` / `change_password` / `verify_email`
- `validation.email.invalid` / `validation.password.string` / `validation.password.min_length`

### Important Notes
- `JwtAuthGuard` is **GLOBAL** → all routes protected by default
- Use `@Public()` decorator on public routes (login, register, refresh, forgot-password, reset-password, verify-email)
- Refresh tokens use opaque tokens with `lookupHash` for security
- Token rotation: each refresh invalidates old refresh token, issues new pair
- LogoutAll increments `tokenVersion` on user, invalidating all sessions

## Frontend Reference

### Feature Module: `features/auth/`
```
auth/
├── components/
│   ├── LoginForm.tsx          # react-hook-form + zod + useLogin
│   ├── RegisterForm.tsx       # react-hook-form + zod + useRegister
│   ├── ForgotPasswordForm.tsx
│   ├── ResetPasswordForm.tsx
│   └── VerifyEmailForm.tsx
├── hooks/
│   ├── useLogin.ts            # useMutation → authClient.login → setAuth → navigate
│   ├── useRegister.ts         # useMutation → authClient.register → setAuth → navigate
│   ├── useForgotPassword.ts
│   ├── useResetPassword.ts
│   ├── useVerifyEmail.ts
│   └── useResendVerification.ts
├── pages/
│   ├── LoginPage.tsx          # wraps LoginForm
│   ├── RegisterPage.tsx       # wraps RegisterForm
│   ├── ForgotPasswordPage.tsx
│   ├── VerifyEmailPage.tsx
│   └── ResetPasswordPage.tsx
└── schemas/
    ├── login.schema.ts        # LoginSchema (zod)
    ├── register.schema.ts     # RegisterSchema (zod)
    ├── forgot-password.schema.ts
    └── reset-password.schema.ts
```

### Auth Store (`packages/store/src/auth.store.ts`)
```typescript
useAuthStore — Zustand + devtools + persist
State: user, accessToken, refreshToken, status
Actions: setAuth, setAccessToken, setTokens, logout, setStatus
Selectors: selectUser, selectAccessToken, selectIsAuthenticated, selectIsAdmin
```

### React Query Hook Pattern
```typescript
export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { language } = useAppStore()
  const t = locales[language].auth

  return useMutation({
    mutationFn: (data: LoginRequest) => authClient.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.refreshToken, response.accessToken)
      toast.success(t.login.successMessage)
      navigate("/")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t.login.errorMessage))
    },
  })
}
```

### API Client (`packages/api-client/src/auth/auth.client.ts`)
Exports: `authClient.login`, `.register`, `.logout`, `.logoutAll`, `.changePassword`, `.forgotPassword`, `.resetPassword`, `.verifyEmail`, `.resendVerification`, `.getMe`

### Routes
```
/auth/login          → GuestGuard → AuthLayout → LoginPage
/auth/register       → GuestGuard → AuthLayout → RegisterPage
/auth/forgot-password → GuestGuard → AuthLayout → ForgotPasswordPage
/auth/verify-email   → AuthLayout → VerifyEmailPage
/auth/reset-password → AuthLayout → ResetPasswordPage
```

### Guards
- **AuthGuard**: checks `selectIsAuthenticated`, redirects to `/auth/login` if false, shows loader during hydration
- **GuestGuard**: redirects authenticated users to `/`
