# Skill: Frontend Patterns

## Description
Standard patterns used across all frontend features: feature module structure, React Query hooks, Zustand stores, form handling with react-hook-form + zod schemas, i18n locale usage, component composition, and styling approach.

## Context
- All files in `apps/web/src/` and `apps/admin/src/`
- Shared packages in `packages/`

## 1. Feature Module Structure
Every feature follows this structure:
```
feature-name/
├── components/          # UI components — each is a PascalCase .tsx file
├── hooks/               # React Query hooks — each is useCamelCase.ts
├── pages/               # Page-level components — PascalCase Page.tsx
├── types/               # Local types — index.ts barrel
├── service/             # Data transformation services
├── schemas/             # Zod schemas (only if forms exist)
├── data/                # Mock data / constants
└── index.ts             # Barrel exports
```

### Barrel Export Pattern
```typescript
// index.ts
export { FeaturePage } from "./pages/FeaturePage"
export { FeatureComponent } from "./components/FeatureComponent"
export type { FeatureType } from "./types"
```

## 2. React Query Hook Pattern

### Query Hook (read data)
```typescript
// hooks/useFeature.ts
import { useQuery } from "@tanstack/react-query"
import { featureClient } from "@workspace/api-client"

export function useFeature(id: string) {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => featureClient.getFeature(id),
  })
}
```

### Mutation Hook (write data)
```typescript
// hooks/useCreateFeature.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { featureClient, getErrorMessage } from "@workspace/api-client"
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales"

export function useCreateFeature() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { language } = useAppStore()
  const t = locales[language].featureName

  return useMutation({
    mutationFn: (data: CreateRequest) => featureClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      toast.success(t.successMessage)
      navigate('/features')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t.errorMessage))
    },
  })
}
```

### Key Rules
- `useQuery` for GET requests (cached automatically)
- `useMutation` for POST/PUT/PATCH/DELETE
- Always invalidate related queries after mutation success
- Show toast on success/error (using `sonner`)
- Navigate on success if needed

## 3. Zustand Store Pattern

### Auth Store (`packages/store/src/auth.store.ts`)
```typescript
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setAuth: (user, accessToken, refreshToken) =>
          set({ user, accessToken, refreshToken, status: 'authenticated' }),
        logout: () => set({ ...initialState, status: 'unauthenticated' }),
        setTokens: (accessToken, refreshToken) =>
          set({ accessToken, refreshToken }),
        setStatus: (status) => set({ status }),
      }),
      { name: 'al-bayan-auth-store' }
    ),
    { name: 'AuthStore' }
  )
)
```

### App Store (`packages/store/src/useAppStore.ts`)
```typescript
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'ar',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'app-store' }
  )
)
```

### Store Rules
- `devtools` middleware for Redux DevTools
- `persist` middleware for localStorage
- Selectors defined as exported functions for consistent access
- Zustand NOT used for server state (React Query owns that)

## 4. Form Pattern (react-hook-form + zod)

### Schema Definition
```typescript
// schemas/login.schema.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(t.login.emailInvalid),
  password: z.string().min(8, t.login.passwordMinLength),
})

export type LoginSchema = z.infer<typeof loginSchema>
```

### Component Usage
```typescript
export function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const { mutate: login, isPending } = useLogin()

  return (
    <form onSubmit={handleSubmit((data) => login(data))} noValidate>
      <Field data-invalid={!!errors.email}>
        <Label htmlFor="email">Email</Label>
        <Controller name="email" control={control}
          render={({ field }) => <Input {...field} id="email" />}
        />
        {errors.email && <FieldError errors={[errors.email]} />}
      </Field>
      <Button type="submit" disabled={isPending}>Submit</Button>
    </form>
  )
}
```

### Form Rules
- Always use `Controller` from react-hook-form (needed for custom components)
- Add `noValidate` to `<form>` to disable browser validation
- Use `Field`, `Label`, `FieldError` from `@workspace/ui`
- Disable form while `isPending`
- Show password toggle with lucide-react `Eye`/`EyeOff`

## 5. i18n Locale Pattern

### Locale Structure
```
packages/locales/src/
├── index.ts                 # barrel: `locales` object + `Locale` type
├── ar/                      # Arabic
│   ├── auth.ts, app.ts, dashboard.ts, exams.ts, examCreation.ts, ...
└── en/                      # English
    ├── auth.ts, app.ts, dashboard.ts, exams.ts, examCreation.ts, ...
```

### Usage in Components
```typescript
import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store"

function Component() {
  const { language } = useAppStore()
  const t = locales[language].auth
  return <h1>{t.login.title}</h1>
}
```

### Key Rules
- Locale key nesting: `[section].[item].[subitem]`
- Arabic is the default/fallback language
- Each feature has its own locale file (auth.ts, exams.ts, etc.)
- Admin has separate locale files in `admin/` subdirectory

## 6. Component Composition
- Prefer composition over inheritance
- Page components compose feature components
- Components are functional, not class-based
- Props typed with TypeScript interfaces
- No CSS files — all styling via Tailwind utility classes

## 7. API Client Pattern

### Per-Feature Client
```typescript
// packages/api-client/src/exams/exams.client.ts
import { http } from "../http"
import type { ApiResponse, Exam, CreateExamRequest } from "@workspace/types"

export const examsClient = {
  create: async (data: CreateExamRequest): Promise<Exam> => {
    const res = await http.post<ApiResponse<Exam>>("/exams", data)
    return res.data.data!
  },
  getMyExams: async (page = 1, limit = 20) => {
    const res = await http.get<ApiResponse<Exam[]>>("/exams/my", { params: { page, limit } })
    return res.data.data!
  },
}
```

### Key Rules
- Every feature client returns unwrapped `data` (not raw Axios response)
- `http` instance configured with baseURL + interceptors
- All responses typed with `ApiResponse<T>` wrapper, then unwrapped
- Auth interceptor auto-attaches Bearer token
- Refresh interceptor auto-rotates tokens on 401

## 8. Route Guards Pattern
```typescript
// AuthGuard.tsx
export function AuthGuard() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const status = useAuthStore(selectStatus)

  if (status === "idle" || status === "loading") {
    return <LoadingSpinner />  // hydration in progress
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}
```

## 9. Import Aliases
- `@/` → `apps/web/src/` (web app)
- `@workspace/ui` → `packages/ui/src`
- `@workspace/api-client` → `packages/api-client/src`
- `@workspace/store` → `packages/store/src`
- `@workspace/types` → `packages/types/src`
- `@workspace/locales` → `packages/locales/src`
