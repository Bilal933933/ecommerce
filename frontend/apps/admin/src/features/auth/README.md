# Admin Auth Feature

**Description:** مصادقة لوحة التحكم: تسجيل دخول المشرفين، إدارة الجلسة، التحقق من صلاحية ADMIN.

## Key Components & Functions

| Element | Description |
|---------|-------------|
| `AuthProvider` | مزود حالة المصادقة للتطبيق |
| `LoginForm` | نموذج تسجيل دخول المشرفين |
| `useLogin` | Mutation: login → setAuth → navigate |
| `store.ts` | Zustand store (token, user, role) |
| `queries.ts` | React Query keys |
| `api.ts` | دوال HTTP للمصادقة |
| `login.schema.ts` | Zod schema للتحقق من المدخلات |

## Dependencies & Context
- `@workspace/api-client` → `adminClient`
- Routes: `/auth/login` (GuestGuard)
- Backend: `modules/auth/` (ADMIN role check في RolesGuard)
- Skills: `auth-skill.md`, `admin-skill.md`
