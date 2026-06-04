# Admin Module

**Description:** لوحة تحكم المشرفين: إحصائيات عامة، إدارة النظام. جميع المسارات محمية بـ `@Roles(ADMIN)`.

## Key Components

| Element | Description |
|---------|-------------|
| `AdminController` | Routes: `/admin/*` |
| `AdminService` | Business logic للوحة التحكم |
| `AdminRepository` | Prisma queries للإحصائيات الإدارية |

## Key Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /admin/dashboard-stats` | إحصائيات عامة (users, exams, questions) |

## Dependencies & Context
- جميع الموديولات (لجمع الإحصائيات)
- `RolesGuard` + `JwtAuthGuard` (فحص صلاحية ADMIN)
- Skills: `admin-skill.md`, `backend-core-skill.md`
