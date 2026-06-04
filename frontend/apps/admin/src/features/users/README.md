# Admin Users Feature

**Description:** إدارة المستخدمين من لوحة التحكم: عرض، إنشاء، تعديل، حذف المستخدمين.

## Key Components & Functions

| Element | Description |
|---------|-------------|
| `store.ts` | Zustand store (users list, filters) |
| `queries.ts` | React Query keys و endpoints |
| `api.ts` | دوال HTTP للمستخدمين |
| `useLogin` | Hook placeholder (pending) |

## Dependencies & Context
- `@workspace/api-client` → `adminClient` (getUsers, createUser, updateUser, deleteUser)
- `@workspace/types` → User types
- Routes: `/users` (AdminAuthGuard)
- Backend: `modules/users/`, `modules/admin/`
- Skills: `admin-skill.md`
