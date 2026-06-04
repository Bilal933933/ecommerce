# Sessions Module

**Description:** إدارة جلسات refresh tokens: إنشاء، إلغاء، تجديد مع تتبع الـ User Agent و IP.

## Key Components

| Element | Description |
|---------|-------------|
| `SessionsService` | Business logic للجلسات |
| `SessionsRepositoryInterface` | واجهة الـ Repository |
| `PrismaSessionsRepository` | تطبيق Prisma للجلسات |
| `SessionsConstants` | ثوابت (مدة انتهاء الجلسة) |

## Key Functions
- `createSession`: إنشاء جلسة جديدة مع lookup hash
- `findSessionByRefreshToken`: البحث عن جلسة بالتوكن
- `revokeSession`: إلغاء جلسة محددة
- `revokeAllUserSessions`: إلغاء كل جلسات المستخدم

## Dependencies & Context
- `PrismaModule`
- `UsersModule` (tokenVersion للتجديد)
- Skills: `auth-skill.md`, `backend-core-skill.md`
