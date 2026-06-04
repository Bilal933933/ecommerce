# Settings Feature

**Description:** إعدادات المستخدم: تخصيص المظهر، اللغة، إدارة الحساب، التفضيلات الشخصية.

## Key Components & Functions

| Element | Description |
|---------|-------------|
| `SettingsPage` | صفحة الإعدادات الرئيسية |
| `PreferencesSection` | تخصيص المظهر واللغة والإشعارات |
| `ProfileSection` | تعديل البيانات الشخصية |
| `AccountSection` | إدارة الحساب (حذف، تصدير) |
| `settingsService` | دوال تحويل وتنسيق بيانات الإعدادات |

## Dependencies & Context
- `@workspace/store` → `useAppStore` (theme, language)
- `@workspace/locales` → `locales[lang].settings`
- Routes: `/settings` (under DashboardLayout)
- Skills: `frontend-pattern-skill.md`
