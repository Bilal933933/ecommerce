# Prisma Module

**Description:** موديول Prisma الأساسي: يوفر اتصال PostgreSQL لجميع الموديولات.

## Key Components

| Element | Description |
|---------|-------------|
| `PrismaService` | NestJS wrapper حول PrismaClient |
| `PrismaModule` | Module تعريف (global export) |

## دورة الحياة
- `onModuleInit`: اتصال بقاعدة البيانات
- `onModuleDestroy`: قطع الاتصال
- `enableShutdownHooks`: إيقاف آمن

## Dependencies & Context
- مستخدم من قبل جميع repositories في المشروع
- قاعدة البيانات: PostgreSQL (محدد في `prisma/schema.prisma`)
- Skills: `backend-core-skill.md`
