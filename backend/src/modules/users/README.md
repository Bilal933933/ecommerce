# Users Module

**Description:** إدارة المستخدمين: CRUD كامل (Admin)، البروفايل الشخصي مع الإحصائيات والتقدم.

## Key Components

| Element | Description |
|---------|-------------|
| `UsersController` | Routes: `/users/*` (8 endpoints) |
| `UsersService` | Business logic للمستخدمين والبروفايل |
| `UsersRepository` | Prisma queries للمستخدمين |
| `UpdateMeDto` | تحديث بيانات المستخدم الشخصية |
| `CreateUserDto` | إنشاء مستخدم جديد (Admin) |
| `UpdateUserDto` | تحديث مستخدم (Admin) |
| `SetAvatarDto` | تعيين الصورة الشخصية |
| `UsersFilesController` | رفع الصور الشخصية |
| `getMyProfile` | بروفايل شامل مع stats + sections + sessions |

## Dependencies & Context
- `PrismaModule` (PrismaService)
- `ResultsModule` (إحصائيات المستخدم)
- `SessionsModule` (الجلسات النشطة)
- Skills: `profile-skill.md`, `backend-core-skill.md`
