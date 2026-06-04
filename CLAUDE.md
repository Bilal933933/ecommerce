# CLAUDE.md — The Memory Layer

> ملف الذاكرة الثابتة للمشروع. يُقرأ في بداية كل جلسة عمل لضمان استمرارية السياق.
>
> **المشروع ضمن:** `template-all/EdaraPrep/` (الـ git repo هو `template-all/`)

---

## 1. Architecture Rules

### Project Type

- **Monorepo** managed by **pnpm workspaces** + **Turborepo**
- Two top-level workspaces: `backend/` and `frontend/`

### Backend (`backend/`)

- **Framework:** NestJS (NestFactory, modules, controllers, services, repositories)
- **Language:** TypeScript, strict mode
- **Database ORM:** Prisma (PostgreSQL)
- **Auth:** JWT (access + refresh tokens) + Sessions
- **Validation:** class-validator + custom `I18nValidationPipe`
- **i18n:** `nestjs-i18n` (AR/EN), JSON files in `src/i18n/`
- **API Style:** RESTful, unified response via `ResponseInterceptor`
- **Testing:** Jest (`*.spec.ts`)

**Backend Module Pattern:**

module/
├── dto/                        # class-validator DTOs
├── types/                      # local TypeScript interfaces/types
├── [name].controller.ts        # routes / HTTP handlers
├── [name].module.ts            # NestJS module definition
├── [name].service.ts           # business logic
├── [name].repository.ts        # data access (Prisma)
├── [name].constants.ts         # (optional) module-level constants
├── decorators/                 # (optional) custom decorators
├── guards/                     # (optional) route guards
├── strategies/                 # (optional) passport strategies
├── services/                   # (optional) sub-services folder
├── controllers/                # (optional) sub-controllers folder
├── repository/                 # (optional) sub-repositories folder
└── [name].controller.spec.ts   # tests

**Backend Global Providers (in `app.module.ts`):**

1. `GlobalExceptionFilter` — catches all errors, formats to `{ success, code, message }`
2. `JwtAuthGuard` (global) — protects all routes by default; `@Public()` opt-out
3. `RolesGuard` — checks `@Roles()` decorator
4. `I18nValidationPipe` — auto-validates + translates error messages
5. `ResponseInterceptor` — wraps all success responses in `{ success, data, message }`
6. `LoggingInterceptor` — request/response logging

**Backend Core Layer (`src/core/`):**

```
core/
├── decorators/        # @ResponseMessage(), @Public()
├── exceptions/        # base, auth, internal, prisma, resource, validation exceptions
├── filters/           # GlobalExceptionFilter
├── interceptors/      # ResponseInterceptor, LoggingInterceptor
├── interfaces/        # ApiResponse<T>, PaginationMeta, etc.
├── logger/            # LoggerModule
├── pipes/             # I18nValidationPipe
├── resolvers/         # AcceptLanguageResolver
└── utils/             # helper utilities
```

### Frontend (`frontend/`)

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Routing:** react-router-dom v7
- **State Management:** Zustand (persist + devtools middleware)
- **Server State:** @tanstack/react-query v5
- **Forms:** react-hook-form + @hookform/resolvers (zod)
- **Validation:** Zod
- **Styling:** Tailwind CSS v4
- **UI Library:** Custom shadcn/ui components (`@workspace/ui`)
- **i18n:** Custom locales package (`@workspace/locales`)
- **Notifications:** sonner (toast)
- **Icons:** lucide-react
- **Fonts:** Geist (Latin) + Noto Kufi Arabic (Arabic)

**Frontend App Structure (`apps/web/`):**

src/
├── app/
│   ├── App.tsx                  # entry component (RouterProvider)
│   └── main.tsx                 # mount point (providers: Theme, QueryClient, Auth)
├── AuthProvider.tsx             # hydration provider for auth store
├── components/                  # global shared components
│   ├── Header.tsx, Footer.tsx, Layout.tsx, ...
│   ├── theme-provider.tsx
│   ├── mode-toggle.tsx
│   ├── sidebar/                 # AppSidebar, SidebarNav, SidebarUser
│   └── ui/                      # local UI wrappers
├── config/                      # app config (navigation.ts)
├── data/                        # mock data
├── features/                    # 8 feature modules
│   ├── auth/                    # authentication
│   ├── dashboard/               # main dashboard
│   ├── profile/                 # user profile
│   ├── settings/                # user settings
│   ├── users/                   # user management
│   ├── landing/                 # landing page
│   ├── about/                   # about page
│   └── files/                   # file upload
├── hooks/                       # global custom hooks
├── lib/                         # utilities (router, utils, iconMapper)
├── pages/                       # legacy page components
└── routes/                      # route definitions
    ├── index.tsx                # route config array
    ├── guards/                  # AuthGuard, GuestGuard
    └── layouts/                 # AuthLayout, DashboardLayout, MainLayout

**Feature Module Pattern (Frontend):**

feature/
├── types/           # local types & re-exports from @workspace/types
├── schemas/         # feature-specific zod validation schemas
├── service/         # re-exports from @workspace/api-client & data transformation (business logic)
├── hooks/           # custom hooks (e.g., useFeature.ts) connecting to services
├── components/      # UI components using local hooks/schemas/types
├── pages/           # page components (FeaturePage.tsx)
├── data/            # mock data / constants
└── index.ts         # barrel exports


### Shared Packages (`frontend/packages/`)

| Package | Alias | Purpose | Key Deps |
|---------|-------|---------|----------|
| `ui` | `@workspace/ui` | shadcn/ui components, hooks, styles | tailwindcss, radix-ui |
| `api-client` | `@workspace/api-client` | Axios HTTP client + per-feature clients | axios, @tanstack/react-query |
| `store` | `@workspace/store` | Zustand stores (auth, app) | zustand |
| `types` | `@workspace/types` | Shared TypeScript types | none |
| `locales` | `@workspace/locales` | AR/EN translation objects | none |

### Admin App (`apps/admin/`)

Same structure as `web/` but admin-focused:

```

features/
├── auth/          # admin login/logout + providers
├── users/         # user management CRUD
├── files/         # file management
└── products/      # product management

```

Pages: Home, About, Dashboard, Products, Auth (Login)

---

## 2. Naming Conventions

### General

- **Language:** Arabic comments/strings in AR locale files; English code identifiers
- **Case:** camelCase for variables/functions, PascalCase for components/types/classes, UPPER_SNAKE for constants/env vars
- **File naming:** kebab-case (e.g., `login-auth.dto.ts`, `auth.store.ts`, `use-mobile.ts`)

### Backend

| Element | Convention | Example |
|---------|-----------|---------|
| Module | kebab-case dir + PascalCase class | `auth/`, `AuthModule` |
| Controller | PascalCase | `AuthController` |
| Service | PascalCase | `UsersService` |
| Repository | PascalCase | `UsersRepository` |
| DTO | PascalCase + `Dto` suffix | `CreateUserDto` |
| Guard | PascalCase + `Guard` suffix | `JwtAuthGuard` |
| Strategy | PascalCase + `Strategy` suffix | `JwtStrategy` |
| Decorator | kebab-case file, PascalCase fn | `public.decorator.ts`, `Public` |
| Type | kebab-case file + `.type.ts` suffix | `jwt-payload.type.ts` |
| Interface | PascalCase | `AuthResult`, `UserWithoutPassword` |
| Constant | UPPER_SNAKE | `PASSING_SCORE` |
| Route param | camelCase | `@Param('examId') examId: string` |

### Frontend

| Element | Convention | Example |
|---------|-----------|---------|
| Component | PascalCase, file = component name | `LoginForm.tsx`, `DashboardPage.tsx` |
| Hook | camelCase + `use` prefix | `useLogin`, `useMyProfile` |
| Store | camelCase + `Store` descriptor | `auth.store.ts`, `useAppStore.ts` |
| Type file | kebab-case + `.types.ts` suffix | `user.types.ts`, `auth.types.ts` |
| Schema file | kebab-case + `.schema.ts` suffix | `login.schema.ts` |
| Client file | kebab-case + `.client.ts` suffix | `auth.client.ts`, `users.client.ts` |
| Service file | kebab-case | `authTransformer.ts` |
| Constants | UPPER_SNAKE | `API_TIMEOUT`, `MAX_FILE_SIZE` |
| CSS classes | Tailwind utility classes (no custom CSS files) | — |
| Import alias | `@/` → `apps/web/src/` | `import { X } from "@/components/..."` |

### Database (Prisma)

| Element | Convention | Example |
|---------|-----------|---------|
| Model | PascalCase, singular | `User`, `Session`, `File` |
| Table | snake_case, plural (`@@map`) | `users` |
| Field | camelCase | `isActive`, `isEmailVerified` |
| Enum | PascalCase | `Role`, `FileType`, `FileStatus` |
| Relation field | camelCase | `userId` |

---

## 3. Test / Code Expectations

### Before committing/pushing

- [ ] TypeScript compiles (`pnpm build` or `turbo build`)
- [ ] Lint passes (`pnpm lint` or `turbo lint`)
- [ ] Tests pass (`pnpm test` or `turbo test`)

### Backend testing rules

- Units test services in isolation (mock repositories)
- Use `UsersService` as reference pattern for service + spec structure
- Controller specs test HTTP status codes + response shapes
- e2e tests in `backend/test/`

### Vitest testing patterns

- **Mocking lucide-react**: vitest inlines lucide-react from source, which resolves a DIFFERENT React copy (pnpm isolation). Always mock lucide-react in component tests using `require("react")` + `R.createElement()` in the factory:

  ```ts
  vi.mock("lucide-react", () => {
    const R = require("react")
    return { Users: (props: any) => R.createElement("div", { "data-testid": "users", ...props }) }
  })
  ```

- **Zustand mocks**: use `vi.mock("@workspace/store", () => ({ useAppStore: () => ({ ... }) }))`

### Code quality standards

- **No `any`** — prefer `unknown` + type guards
- **No console.log** in production code (use Logger service)
- **No commented-out code blocks** — delete dead code
- **DTOs must use class-validator decorators** for validation
- **All API responses** go through `ResponseInterceptor` (uniform `{ success, data, message }`)
- **Error messages** use i18n keys (e.g., `'errors.auth.invalid_credentials'`)
- **Auth errors** throw NestJS HTTP exceptions (not custom)
- **Repository layer** owns all Prisma queries (service never imports Prisma directly)
- **React Query hooks** follow pattern: `useMutation`/`useQuery` + toast + navigate
- **State** flows: server data → React Query → component props; UI state → Zustand
- **Zustand stores** use `devtools` + `persist` middleware
- **Locale keys** follow: `[section].[item]` (e.g., `auth.login.email`)
- **Components** prefer composition over inheritance, functional components only

---

## 4. Repo Map

```
EdaraPrep/                              # ← project root
├── CLAUDE.md                           # ← this file (Memory Layer)
├── .env                                # backend env vars
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma               # DB schema (5 models, 4 enums, NO exam)
│   │   ├── migrations/                 # Prisma migrations
│   │   └── seed.ts                     # seeding scripts
│   └── src/
│       ├── main.ts                     # bootstrap (NestFactory, port 5000)
│       ├── app.module.ts               # imports all modules + global providers
│       ├── config/                     # AppConfigModule + AppConfigService
│       ├── core/                       # shared infrastructure
│       │   ├── decorators/             # @ResponseMessage(), @Public()
│       │   ├── exceptions/             # custom exception classes
│       │   ├── filters/                # GlobalExceptionFilter
│       │   ├── interceptors/           # ResponseInterceptor, LoggingInterceptor
│       │   ├── interfaces/             # ApiResponse types
│       │   ├── logger/                 # LoggerModule
│       │   ├── pipes/                  # I18nValidationPipe
│       │   ├── resolvers/              # AcceptLanguageResolver
│       │   └── utils/
│       ├── dto/                        # shared DTOs
│       ├── http/                       # REST client test files (*.http)
│       ├── i18n/                       # translations (ar/, en/)
│       └── modules/                    # 11 feature modules
│           ├── admin/                  # admin dashboard API
│           ├── app/                    # root AppModule + health check
│           ├── auth/                   # login, register, JWT, guards, decorators
│           ├── contact/                # contact form submissions
│           ├── email-verification/     # email verification flow
│           ├── files/                  # Cloudinary file upload
│           ├── mail/                   # Resend email service + templates
│           ├── password-reset/         # forgot/reset password
│           ├── prisma/                 # PrismaModule + PrismaService
│           ├── sessions/               # refresh token sessions
│           └── users/                  # user CRUD + profile (no specializations)
│
├── frontend/
│   ├── apps/
│   │   ├── web/                        # public-facing (port 3000)
│   │   │   └── src/
│   │   │       ├── app/                # App.tsx, main.tsx
│   │   │       ├── AuthProvider.tsx     # auth hydration
│   │   │       ├── components/         # Header, Footer, sidebar/, ui/
│   │   │       ├── config/             # navigation.ts
│   │   │       ├── data/               # mock data
│   │   │       ├── features/           # 8 modules
│   │   │       │   ├── auth/           # forms, hooks, schemas, pages
│   │   │       │   ├── dashboard/      # DashboardPage + widgets
│   │   │       │   ├── profile/        # ProfilePage + sessions
│   │   │       │   ├── settings/       # SettingsPage
│   │   │       │   ├── users/          # user management
│   │   │       │   ├── landing/        # LandingPage sections
│   │   │       │   ├── about/          # AboutPage sections
│   │   │       │   └── files/          # FileUploader + hooks
│   │   │       ├── hooks/              # use-mobile.ts
│   │   │       ├── lib/                # router.ts, utils.ts, iconMapper.ts
│   │   │       ├── pages/              # legacy pages
│   │   │       └── routes/             # index.tsx, guards/, layouts/
│   │   └── admin/                      # admin panel (port 5174)
│   │       └── src/
│   │           ├── app/                # App.tsx, main.tsx
│   │           ├── components/         # Layout, Header, sidebar/
│   │           ├── config/             # navigation.ts
│   │           ├── features/           # 7 modules
│   │           │   ├── auth/           # LoginPage, providers, schemas
│   │           │   ├── users/          # user management CRUD
│   │           │   ├── files/          # file management
│   │           │   ├── products/       # product management
│   │           │   ├── dashboard/      # DashboardPage
│   │           │   ├── profile/        # ProfilePage
│   │           │   ├── settings/       # SettingsPage
│   │           │   └── about/          # AboutPage
│   │           ├── hooks/
│   │           ├── lib/
│   │           ├── pages/              # legacy pages
│   │           └── routes/             # guards/ (ADMIN check), layouts/
│   └── packages/                       # 5 shared packages
│       ├── ui/                         # @workspace/ui (22 shadcn components)
│       ├── api-client/                 # @workspace/api-client (auth, users, admin, contact, files)
│       ├── store/                      # @workspace/store (auth.store, useAppStore)
│       ├── types/                      # @workspace/types (api, auth, user, file, product)
│       └── locales/                    # @workspace/locales (ar/, en/, admin/)
```

---

## Key Data Flow

```
React Component
    → API Client (@workspace/api-client)
        → Axios + Interceptors (attach token)
            → NestJS Backend
                → Guards (JwtAuthGuard → RolesGuard)
                    → Controller
                        → Service (business logic)
                            → Repository (Prisma queries)
                                → PostgreSQL
                    ← ResponseInterceptor uniformat
            ← ApiResponse<T>
    → React Query Cache
    → Component re-render
    → Zustand (if global state update needed)
```

---

## Environment Variables

### Backend `.env`

```
PORT=5000
DATABASE_URL=postgresql://localhost:5432/edaraprep
JWT_SECRET=super-secret-jwt-key-12345
JWT_REFRESH_SECRET=super-secret-refresh-key-67890
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
RESEND_API_KEY=re_placeholder
MAIL_FROM=noreply@edaraprep.com
APP_URL=http://localhost:3000
CORS_ORIGIN_WEB=http://localhost:3000
CORS_ORIGIN_ADMIN=http://localhost:5174
CLOUDINARY_CLOUD_NAME=placeholder
CLOUDINARY_API_KEY=placeholder
CLOUDINARY_API_SECRET=placeholder
```

### Frontend `apps/web/.env.local`

```
VITE_API_BASE_URL=http://localhost:5000
```

### Frontend `apps/admin/.env.local`

```
VITE_API_BASE_URL=http://localhost:5000
```
