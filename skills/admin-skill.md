# Skill: Admin Panel

## Description
Admin dashboard and CRUD management for users, products, files, levels, and specializations/sections/questions management.

## Context
- Backend: `src/modules/admin/`, `src/modules/users/` (admin endpoints)
- Frontend: `apps/admin/` (separate app), `packages/api-client/src/admin/`
- Auth: ADMIN role required (`@Roles(Role.ADMIN)`)

## Backend Reference

### Admin Module
```
modules/admin/
├── admin.controller.ts      # Routes: /admin/*
├── admin.service.ts         # Business logic
├── admin.repository.ts      # Prisma queries
└── admin.module.ts          # Module definition
```

### Admin Endpoints
```
GET /admin/dashboard-stats   → getDashboardStats()
  → returns { totalUsers, totalExams, totalQuestions, ... }
```

### Role-Based Access
- `@Roles(Role.ADMIN)` decorator on admin-only endpoints
- `RolesGuard` (global) checks `@Roles()` metadata
- `JwtAuthGuard` (global) ensures user is authenticated first

## Frontend Reference

### Admin App Structure (`apps/admin/`)
```
admin/
├── src/
│   ├── app/
│   │   ├── App.tsx               # RouterProvider
│   │   └── main.tsx              # mount point (Theme, QueryClient, Auth)
│   ├── components/
│   │   ├── Layout.tsx            # AdminLayout with sidebar
│   │   ├── Header.tsx            # Admin header
│   │   ├── Footer.tsx            # Admin footer
│   │   ├── sidebar/              # AdminSidebar
│   │   ├── ui/                   # Local UI wrappers
│   │   ├── mode-toggle.tsx
│   │   ├── theme-provider.tsx
│   │   └── UserMenu.tsx
│   ├── features/
│   │   ├── auth/                 # Admin auth (login, providers, store)
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── providers/
│   │   │   ├── schemas/
│   │   │   ├── api.ts
│   │   │   ├── queries.ts
│   │   │   ├── store.ts
│   │   │   └── index.ts
│   │   ├── users/                # User CRUD
│   │   │   ├── hooks/
│   │   │   ├── api.ts
│   │   │   ├── queries.ts
│   │   │   ├── store.ts
│   │   │   └── index.ts
│   │   ├── files/                # File management
│   │   └── products/             # Product management
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── About.tsx
│   │   ├── Products.tsx
│   │   └── Auth/                 # Login page
│   ├── lib/
│   ├── hooks/
│   ├── config/
│   └── routes/
│       ├── index.tsx
│       ├── guards/               # AdminAuthGuard
│       └── layouts/              # AdminLayout
```

### Admin API Client (`packages/api-client/src/admin/admin.client.ts`)
Exports: `getDashboardStats`, `getUsers`, `getUser`, `createUser`, `updateUser`, `deleteUser`, etc.

### Profile & Stats Types (`packages/types/src/admin.types.ts`)
```typescript
interface AdminDashboardStats {
  totalUsers: number;
  totalExams: number;
  totalQuestions: number;
  // ...
}
```

### Admin Routes
```
/                    → HomePage (public)
/dashboard           → AdminAuthGuard → DashboardPage
/auth/login          → GuestGuard → AdminLoginPage
/users               → AdminAuthGuard → UsersPage
/products            → AdminAuthGuard → ProductsPage
/about               → AboutPage (public)
```

### Admin Auth Pattern
- Admin app has its own auth store, provider, and guard
- Different from web app auth — checks for ADMIN role
- Uses same API base URL but with admin-specific endpoints
