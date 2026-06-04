# @workspace/store — State Management

**Description:** إدارة الحالة العامة للتطبيق عبر Zustand مع devtools + persist.

## Stores

### `useAuthStore`
**المسؤول:** حالة المصادقة (user, tokens, status)

| Action | Description |
|--------|-------------|
| `setAuth(user, accessToken, refreshToken)` | تعيين بيانات المصادقة |
| `setAccessToken(token)` | تحديث access token فقط |
| `setTokens(access, refresh)` | تحديث كلا التوكنين |
| `logout()` | مسح البيانات والعودة لـ idle |
| `setStatus(status)` | تعيين حالة المصادقة |

**Selectors:**
- `selectUser`, `selectAccessToken`, `selectRefreshToken`, `selectStatus`
- `selectIsAuthenticated` → status === 'authenticated' && user !== null
- `selectIsAdmin` → user?.role === 'ADMIN'

### `useAppStore`
**المسؤول:** إعدادات التطبيق (theme, language)

| Property | Default | Description |
|----------|---------|-------------|
| `theme` | `'light'` | `'light'` / `'dark'` / `'system'` |
| `language` | `'ar'` | `'ar'` / `'en'` |
| `toggleTheme()` | — | تبديل المظهر |
| `setLanguage(lang)` | — | تعيين اللغة |

## Usage Pattern
```typescript
// مكون
const user = useAuthStore(selectUser)
const { language, setLanguage } = useAppStore()

// خارج المكون (في API client)
const token = useAuthStore.getState().accessToken
```

## Dependencies & Context
- `zustand` (+ devtools, persist middleware)
- `@workspace/types` (AuthStore, AuthUser types)
- Skills: `frontend-pattern-skill.md`
