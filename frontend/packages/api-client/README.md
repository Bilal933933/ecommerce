# @workspace/api-client — HTTP Client

**Description:** عميل HTTP موحد عبر Axios مع معالجات للتوكن، تجديد الجلسة، ومعالجة الأخطاء.

## Key Components

| Module | Description |
|--------|-------------|
| `http.ts` | Axios instance (baseURL, timeout, headers) |
| `interceptors.ts` | طلب: إضافة Bearer token. رد: تجديد تلقائي عند 401 |
| `queryClient.ts` | React Query client مع إعدادات افتراضية |
| `auth.client.ts` | دوال المصادقة (login, register, logout, refresh) |
| `users.client.ts` | دوال المستخدمين والبروفايل |
| `exams.client.ts` | دوال الاختبارات |
| `questions.client.ts` | دوال الأسئلة |
| `sections.client.ts` | دوال المحاور |
| `specializations.client.ts` | دوال التخصصات |
| `results.client.ts` | دوال النتائج |
| `leaderboard.client.ts` | دوال المتصدرين |
| `stats.client.ts` | دوال الإحصائيات |
| `files.client.ts` | دوال الملفات |
| `admin.client.ts` | دوال لوحة التحكم |
| `getErrorMessage.ts` | استخراج رسالة الخطأ المترجمة |

## Initialization
```typescript
import { initApiClient } from "@workspace/api-client"

initApiClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  onSessionExpired: () => useAuthStore.getState().logout(),
  onSessionRefreshed: (data) => useAuthStore.getState().setTokens(data.accessToken, data.refreshToken),
})
```

## Response Pattern
```typescript
// كل client يعيد data مفكوك (ليس AxiosResponse كاملاً)
const exam = await examsClient.getExam(id) // returns Exam (not { data: { data: Exam } })
```

## Dependencies & Context
- `axios`
- `@tanstack/react-query`
- `@workspace/types` (API types)
- `@workspace/store` (accessToken, refreshToken)
- Skills: `frontend-pattern-skill.md`
