# Dashboard Feature

**Description:** الصفحة الرئيسية بعد تسجيل الدخول، تعرض ملخص الأداء والإحصائيات والإجراءات السريعة.

## Key Components & Functions

| Element | Description |
|---------|-------------|
| `DashboardPage` | الصفحة الرئيسية للوحة التحكم |
| `DashboardNavbar` | شريط التنقل العلوي |
| `DashboardWelcomeSection` | ترحيب باسم المستخدم |
| `DashboardQuickActions` | أزرار سريعة (اختبار جديد، تصفح) |
| `DashboardProgressAnalytics` | رسم بياني لتقدم الأداء |
| `DashboardRecentActivity` | قائمة آخر الأنشطة |
| `DashboardLeaderboardWidget` | ملخص لوحة المتصدرين |
| `DashboardRecommendedTests` | اختبارات مقترحة |
| `DashboardErrorReview` | مراجعة الأخطاء الأخيرة |

## Dependencies & Context
- `@workspace/api-client` → `statsClient`, `leaderboardClient`
- `@workspace/locales` → `locales[lang].dashboard`
- `@workspace/store` → `useAuthStore` (user info)
- Routes: `/dashboard`
- Layout: `DashboardLayout`
- Skills: `frontend-pattern-skill.md`
