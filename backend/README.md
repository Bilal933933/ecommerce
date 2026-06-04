# 📚 منصة البيان التعليمية - API

> **بنية تحتية احترافية وقابلة للتوسع لمنصة تعليمية مبنية بـ NestJS و Prisma**

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المتطلبات](#-المتطلبات)
- [الأدوات والتقنيات](#-الأدوات-والتقنيات)
- [البدء السريع](#-البدء-السريع)
- [بنية المشروع](#-بنية-المشروع)
- [متغيرات البيئة](#-متغيرات-البيئة)
- [الأوامر الأساسية](#-الأوامر-الأساسية)
- [معايير التطوير](#-معايير-التطوير)

---

## 📖 نظرة عامة

**منصة البيان** هي منصة تعليمية متقدمة تجمع بين:

| المكون | الوصف |
|---|---|
| **API Backend** | NestJS + Prisma + PostgreSQL |
| **Frontend** | React + Vite + Turborepo (مستودع منفصل) |
| **معايير الكود** | TypeScript Strict - لا `any` - Clean Architecture - Repository Pattern |
| **الأمان** | JWT Authentication - Role-based Access - Email Verification |
| **التدويل** | دعم العربية والإنجليزية (i18n) |
| **الأداء** | Logging متقدم مع Pino - Exception Handling موحد - Request/Response Interceptors |

---

## 🛠 المتطلبات

قبل البدء، تأكد من تثبيت:

- **Node.js** `v18.x` أو أحدث
- **npm** أو **pnpm** (مفضل)
- **PostgreSQL** `v14` أو أحدث
- **Git**

### التحقق من التثبيت:

```bash
node --version    # v18.x أو أحدث
npm --version     # 9.x أو أحدث
psql --version    # PostgreSQL 14+
```

---

## 🚀 الأدوات والتقنيات

### Framework & Runtime
- **NestJS** ^11.0.1 - إطار عمل Node.js حديث
- **Node.js** - بيئة التشغيل

### قاعدة البيانات
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **Prisma** ^7.8.0 - ORM قوي مع migrations
- **@prisma/adapter-pg** - محول PostgreSQL

### المصادقة & الأمان
- **jsonwebtoken** ^9.0.3 - JWT tokens
- **bcrypt** ^6.0.0 - تشفير كلمات المرور
- **Guards & Decorators** - نظام تحكم وصول مبني

### التحقق من البيانات
- **class-validator** ^0.15.1 - التحقق من DTOs
- **class-transformer** ^0.5.1 - تحويل البيانات

### Logging & Monitoring
- **nestjs-pino** ^4.6.1 - مكتبة logging
- **pino** ^10.3.1 - محرك logging سريع
- **pino-pretty** ^13.1.3 - تنسيق logs جميل

### التدويل (i18n)
- **nestjs-i18n** ^10.8.3 - دعم متعدد اللغات
- **i18n** ^0.15.3

### أدوات البريد
- **resend** ^6.12.2 - خدمة البريد الإلكتروني

### التطوير والاختبار
- **TypeScript** ^5.7.3 - لغة البرمجة الرئيسية
- **Jest** ^30.0.0 - إطار الاختبار
- **ESLint** & **Prettier** - تنسيق وجودة الكود
- **NestJS CLI** - أدوات سطر الأوامر

---

## ⚡ البدء السريع

### 1. استنساخ المستودع

```bash
git clone <repository-url>
cd "New folder"
```

### 2. تثبيت المكتبات

```bash
pnpm install
# أو إذا كنت تستخدم npm
npm install
```

### 3. إعداد متغيرات البيئة

انسخ الملف `env.example` إلى `.env`:

```bash
cp .env.example .env
```

ثم عدّل القيم حسب إعدادات بيئتك (انظر [متغيرات البيئة](#-متغيرات-البيئة))

### 4. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات وتطبيق Migrations
pnpm prisma migrate dev --name init

# أو إذا كنت تريد إعادة تعيين البيانات
pnpm prisma migrate reset
```

### 5. بدء التطبيق

```bash
# وضع التطوير (مع Live Reload)
pnpm start:dev

# أو وضع الإنتاج
pnpm build
pnpm start:prod
```

التطبيق سيكون متاحاً على: `http://localhost:3000`

---

## 📁 بنية المشروع

```
src/
├── main.ts                              ← نقطة الدخول الرئيسية
├── app.module.ts                        ← الموديول الرئيسي
│
├── config/                              ← إدارة الإعدادات
│   ├── config.module.ts                 ← @Global module
│   ├── config.service.ts                ← خدمة الإعدادات
│   ├── configration/
│   │   ├── app.config.ts                ← إعدادات التطبيق (PORT, CORS)
│   │   ├── auth.config.ts               ← إعدادات JWT
│   │   └── database.config.ts           ← إعدادات قاعدة البيانات
│   └── env/
│       ├── env.schema.ts                ← التحقق من متغيرات البيئة
│       └── env.validation.ts            ← دالة الفحص والتحقق
│
├── core/                                ← منطق أساسي مشترك
│   ├── decorators/
│   │   └── response-message.decorator.ts  ← ديكوريتور للاستجابات
│   │
│   ├── exceptions/                      ← معالجة الأخطاء
│   │   ├── base.exception.ts            ← الفئة الأساسية
│   │   ├── auth.exception.ts            ← أخطاء المصادقة
│   │   ├── validation.exception.ts      ← أخطاء التحقق
│   │   ├── prisma.exception.ts          ← أخطاء قاعدة البيانات
│   │   ├── resource.exception.ts        ← أخطاء الموارد
│   │   ├── internal.exception.ts        ← أخطاء داخلية
│   │   └── index.ts                     ← تصدير مركزي
│   │
│   ├── filters/
│   │   └── global-exception.filter.ts   ← معالج الأخطاء العام
│   │
│   ├── interceptors/                    ← معالجات الطلبات والاستجابات
│   │   ├── response.interceptor.ts      ← تنسيق الاستجابات
│   │   └── logging.interceptor.ts       ← تسجيل الطلبات
│   │
│   ├── middleware/                      ← Middleware إضافي
│   │
│   ├── pipes/
│   │   └── i18n-validation.pipe.ts      ← التحقق مع i18n
│   │
│   ├── resolvers/
│   │   └── accept-language.resolver.ts  ← حل اللغة المطلوبة
│   │
│   ├── interfaces/
│   │   └── api-response.interface.ts    ← واجهة الاستجابات
│   │
│   └── logger/
│       ├── logger.module.ts             ← وحدة Logging
│       └── logging.interceptor.ts       ← interceptor للتسجيل
│
├── dto/                                 ← Data Transfer Objects
│   ├── register.dto.ts
│   └── ... (DTOs أخرى)
│
├── i18n/                                ← ملفات التدويل
│   ├── ar/                              ← العربية
│   │   ├── errors.json
│   │   ├── responses.json
│   │   └── validation.json
│   └── en/                              ← الإنجليزية
│       ├── errors.json
│       ├── responses.json
│       └── validation.json
│
├── modules/                             ← الميزات الرئيسية
│   ├── app/                             ← الموديول الأساسي
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── app.service.ts
│   │
│   ├── auth/                            ← المصادقة
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── types/
│   │
│   ├── users/                           ← إدارة المستخدمين
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── ...
│   │
│   ├── email-verification/              ← التحقق من البريد
│   │   ├── email-verification.controller.ts
│   │   ├── email-verification.module.ts
│   │   ├── email-verification.service.ts
│   │   ├── dto/
│   │   └── repository/
│   │
│   ├── password-reset/                  ← إعادة تعيين كلمة المرور
│   │   ├── password-reset.controller.ts
│   │   ├── password-reset.module.ts
│   │   ├── password-reset.service.ts
│   │   ├── dto/
│   │   └── repository/
│   │
│   ├── mail/                            ← خدمة البريد
│   │   ├── mail.module.ts
│   │   ├── mail.service.ts
│   │   └── templates/
│   │
│   ├── prisma/                          ← خدمة Prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   └── ... (موديولات أخرى)
│
└── http/                                ← اختبار API (REST Client)
    ├── auth.http
    ├── users.http
    └── ...

prisma/
├── schema.prisma                        ← تعريف النموذج
└── migrations/                          ← سجل التغييرات

test/                                    ← الاختبارات
├── app.e2e-spec.ts
└── jest-e2e.json
```

---

## 🔧 متغيرات البيئة

أنشئ ملف `.env` في جذر المشروع:

```env
# ────── Server ──────────
PORT=3000
NODE_ENV=development

# CORS Origins
CORS_ORIGIN_WEB=http://localhost:5173
CORS_ORIGIN_ADMIN=http://localhost:5174

# ────── Database ────────
DATABASE_URL=postgresql://user:password@localhost:5432/bayyan_db

# ────── JWT ─────────────
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRATION=30d

# ────── Email (Resend) ──
RESEND_API_KEY=re_your_api_key_here
SENDER_EMAIL=noreply@bayyan.edu

# ────── App Info ────────
APP_NAME="منصة البيان التعليمية"
APP_URL=http://localhost:3000
```

### شرح المتغيرات:

| المتغير | الوصف | المثال |
|---|---|---|
| `PORT` | منفذ الخادم | `3000` |
| `NODE_ENV` | بيئة التطوير | `development` أو `production` |
| `DATABASE_URL` | اتصال قاعدة البيانات | `postgresql://...` |
| `JWT_SECRET` | مفتاح توقيع الـ JWT | أي مفتاح عشوائي قوي |
| `RESEND_API_KEY` | مفتاح خدمة البريد | الحصول من [resend.com](https://resend.com) |

---

## 📝 الأوامر الأساسية

### 🚀 التطوير

```bash
# بدء الخادم في وضع التطوير (Live Reload)
pnpm start:dev

# بدء الخادم مع المصحح (Debugger)
pnpm start:debug

# بدء الخادم في وضع الإنتاج
pnpm start:prod
```

### 🔨 البناء والإنتاج

```bash
# بناء المشروع
pnpm build

# تشغيل النسخة المبنية
pnpm start:prod
```

### 🗄️ قاعدة البيانات

```bash
# تطبيق migration جديد (ينشئ ملف جديد)
pnpm prisma migrate dev --name <name>

# عرض حالة migrations
pnpm prisma migrate status

# إعادة تعيين قاعدة البيانات (حذف وإعادة إنشاء)
pnpm prisma migrate reset

# فتح واجهة Prisma Studio (لعرض وتعديل البيانات)
pnpm prisma studio

# توليد Prisma Client (تلقائي عند تثبيت)
pnpm prisma generate
```

### 🧪 الاختبار

```bash
# تشغيل جميع الاختبارات
pnpm test

# تشغيل الاختبارات في وضع المراقبة
pnpm test:watch

# تشغيل الاختبارات مع تقرير التغطية
pnpm test:cov

# اختبارات End-to-End
pnpm test:e2e

# تشغيل الاختبارات مع المصحح
pnpm test:debug
```

### 🎨 جودة الكود

```bash
# فحص الكود مع ESLint وإصلاح الأخطاء
pnpm lint

# تنسيق الملفات مع Prettier
pnpm format
```

---

## ✅ معايير التطوير

### 📐 معايير الكود

- **TypeScript Strict Mode** - لا يسمح بـ `any`
- **Clean Architecture** - فصل الطبقات وعدم الخلط
- **Repository Pattern** - فصل منطق الوصول للبيانات
- **Dependency Injection** - استخدام NestJS DI

### 📦 هيكل الموديولات

```typescript
// Structure of each module:
src/modules/feature/
├── feature.module.ts       ← تسجيل الموديول
├── feature.controller.ts   ← المسارات و HTTP logic
├── feature.service.ts      ← Business logic
├── dto/                    ← Data Transfer Objects
├── entities/               ← Database models
├── repository/             ← Database access
├── guards/                 ← Authorization
├── decorators/             ← Custom decorators
└── types/                  ← TypeScript types
```

### 🔒 نمط Guard

```typescript
// استخدام Guards للتحقق من الصلاحيات
@Get()
@UseGuards(JwtGuard)
@Roles(Role.ADMIN)
findAll() { }
```

### 💥 معالجة الأخطاء

```typescript
// استخدام Custom Exceptions
throw new ValidationException('Invalid data');
throw new AuthException('Unauthorized');
throw new PrismaException('Database error');
```

### 🌍 التدويل

```typescript
// استخدام i18n للرسائل
this.i18n.t('validation.email_required')
this.i18n.t('errors.user_not_found')
```

---

## 🔐 الأمان

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Role-based Access Control (RBAC)
- ✅ Email Verification
- ✅ Password Reset Flow
- ✅ CORS Configuration
- ✅ Environment Variables Validation

---

## 📚 المراجع والموارد

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [JWT Introduction](https://jwt.io/introduction)

---

## 🤝 المساهمة

1. إنشئ فرع جديد: `git checkout -b feature/amazing-feature`
2. قم بـ commit التغييرات: `git commit -m 'Add amazing feature'`
3. اجعل الفرع متاحاً: `git push origin feature/amazing-feature`
4. افتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص تحت [UNLICENSED](LICENSE)

---

## 📞 التواصل والدعم

للأسئلة والدعم، يرجى فتح issue في المستودع.

---

**تم آخر تحديث:** يونيو 2026

---

## app.module.ts — الترتيب مهم

```typescript
imports: [
  AppConfigModule,   // ١. أولاً — يتحقق من .env عند البدء
  AppLoggerModule,   // ٢. ثانياً — Logger
  I18nModule,        // ٣. ثالثاً — الترجمة
  // ... باقي الموديولات
]

providers: [
  APP_FILTER   → GlobalExceptionFilter,   // يعترض كل الأخطاء
  APP_PIPE     → I18nValidationPipe,       // useFactory + inject: [I18nService]
  APP_INTERCEPTOR → LoggingInterceptor,    // أولاً (يقيس الوقت)
  APP_INTERCEPTOR → ResponseInterceptor,   // ثانياً (يشكّل الرد)
]
```

---

## نظام الأخطاء

### القاعدة الأساسية
```
أخطاء NestJS المدمجة (NotFoundException, ConflictException...)
+
أخطاء Prisma (P2002, P2025...)
+
أخطاء مخصصة (BaseException وأبناؤها)
    ↓
كلها تمر عبر GlobalExceptionFilter
    ↓
يترجمها ويُرجعها بشكل ApiError موحد
```

### الاستخدام في الـ Service
```typescript
// استيراد من NestJS مباشرة — هذا هو النمط المتبع
import { NotFoundException, ConflictException } from '@nestjs/common';

// مثال
if (!user) throw new NotFoundException('errors.not_found');
if (exists) throw new ConflictException('errors.auth.email_taken');
```

### متى نستخدم الأخطاء المخصصة؟
| الخطأ | متى |
|---|---|
| `ValidationException` | داخل `I18nValidationPipe` فقط — لا تستخدمه مباشرة |
| `PrismaException` | داخل `GlobalExceptionFilter` فقط — يعالج أخطاء Prisma تلقائياً |
| `InternalException` | Fallback في `GlobalExceptionFilter` — لا تستخدمه مباشرة |
| `BaseException` | لا يُستخدم مباشرة — أب فقط |

---

## شكل الردود الموحد

### نجاح عادي (ApiSuccess)
```json
{
  "success": true,
  "data": { },
  "message": "تم جلب البيانات بنجاح"
}
```

### نجاح مع Pagination (ApiSuccessPaginated)
```json
{
  "success": true,
  "data": [],
  "message": "تم جلب البيانات بنجاح",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### خطأ (ApiError)
```json
{
  "success": false,
  "code": "errors.not_found",
  "message": "العنصر المطلوب غير موجود",
  "details": [],
  "path": "/api/users/1",
  "timestamp": "2026-04-30T..."
}
```

---

## نظام الترجمة (i18n)

### المكتبة: nestjs-i18n
### اللغة الافتراضية: ar
### اللغة الاحتياطية: en
### تحديد اللغة من الـ Request (بالترتيب):
1. Query param: `?lang=ar`
2. AcceptLanguageResolver (Header: `Accept-Language: ar`)
3. HeaderResolver
4. Fallback: `ar`

### هيكل ملفات الترجمة
```
i18n/
├── ar/validation.json   ← أخطاء الـ DTO
├── ar/errors.json       ← أخطاء النظام والـ Business Logic
├── ar/responses.json    ← رسائل النجاح
└── en/ (نفس المفاتيح)
```

### مفاتيح errors.json الموجودة
```json
{
  "validation_error": "...",
  "not_found": "...",
  "conflict": "...",
  "unauthorized": "...",
  "forbidden": "...",
  "server_error": "...",
  "database_error": "...",
  "auth": {
    "invalid_credentials": "...",
    "token_expired": "...",
    "token_invalid": "...",
    "email_taken": "...",
    "account_disabled": "..."
  }
}
```

### مفاتيح responses.json الموجودة
```json
{
  "default": {
    "post": "...",
    "get": "...",
    "patch": "...",
    "delete": "..."
  },
  "auth": {
    "login": "...",
    "register": "...",
    "logout": "...",
    "refresh": "..."
  }
}
```

---

## @ResponseMessage Decorator

```typescript
// بدون decorator → رسالة تلقائية حسب HTTP Method
@Get()
findAll() { }

// مع decorator → مفتاح محدد من responses.json
@ResponseMessage('responses.auth.login')
@Post('login')
login() { }
```

---

## نمط الترجمة في قاعدة البيانات

### Entity + Translation Table Pattern
```prisma
model Level {
  id           String             @id @default(uuid())
  order        Int
  isActive     Boolean            @default(true)
  translations LevelTranslation[]
  @@index([order])
}

model LevelTranslation {
  id          String  @id @default(uuid())
  levelId     String
  locale      Locale               // Enum: ar | en
  name        String
  description String?
  level       Level   @relation(fields: [levelId], references: [id], onDelete: Cascade)
  @@unique([levelId, locale])
  @@index([levelId, locale])
}

enum Locale {
  ar
  en
}
```

### قاعدة مهمة
- كل entity له جدول رئيسي (البيانات الثابتة) + جدول ترجمة (النصوص)
- العلاقة: `1 Entity → N Translations`
- القيد الإجباري: `@@unique([entityId, locale])`

---

## AppConfigService — الاستخدام

```typescript
// الحقن
constructor(private readonly config: AppConfigService) {}

// الاستخدام
this.config.port
this.config.dbUrl
this.config.jwtSecret
this.config.jwtRefreshSecret
this.config.jwtExpiresIn
this.config.jwtRefreshExpiresIn
this.config.corsOrigins        // string[] — للاستخدام في CORS
this.config.corsOriginWeb
this.config.corsOriginAdmin
this.config.isProduction
this.config.nodeEnv
```

---

## Prisma — النماذج الموجودة

```
user
session
level + levelTranslation
grade + gradeTranslation
env
```

---

## قواعد لا تُكسر

1. **لا `any`** في أي ملف
2. **لا رسائل نصية** مباشرة في الأخطاء — مفاتيح فقط
3. **لا منطق لغة** في الـ Controllers أو Services — فقط في الـ Filter والـ Pipe
4. **كل موديول جديد** يضيف مفاتيحه في `errors.json` و`responses.json`
5. **Pagination** يُرجع `{ data: T[], meta: PaginationMeta }` من الـ Service
6. **Repository Pattern** — لا استعلامات Prisma مباشرة في الـ Service
7. **useFactory** عند الحاجة لحقن dependency في APP_PIPE أو APP_FILTER

---

## الموديولات المبنية

```
✓ البنية التحتية (Core Layer)
✓ PrismaModule
✓ AuthModule
✓ UsersModule
✓ QuestionsModule
✓ SectionsModule
✓ SpecializationsModule
✓ ExamsModule
✓ ResultsModule
✓ LeaderboardModule
✓ StatsModule
✓ FilesModule
✓ MailModule
✓ EmailVerificationModule
✓ PasswordResetModule
✓ SessionsModule
✓ AdminModule
```