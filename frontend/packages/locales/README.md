# @workspace/locales — Internationalization

**Description:** ملفات الترجمة العربية والإنجليزية لجميع ميزات التطبيق.

## Structure
```
locales/src/
├── index.ts              # barrel: locales object { ar, en }
├── ar/                   # Arabic (default)
│   ├── app.ts            # عامة (مرحباً، تحميل، خطأ)
│   ├── auth.ts           # المصادقة (تسجيل، دخول، كلمة مرور)
│   ├── dashboard.ts      # لوحة التحكم
│   ├── exams.ts          # قائمة الاختبارات
│   ├── examCreation.ts   # إنشاء اختبار
│   ├── examTake.ts       # جلسة الاختبار
│   ├── examSession.ts    # جلسة إضافية
│   ├── examResults.ts    # نتائج الاختبار
│   ├── examsHistory.ts   # سجل الاختبارات
│   ├── landing.ts        # صفحة الهبوط
│   ├── leaderboard.ts    # المتصدرين
│   ├── statistics.ts     # الإحصائيات
│   ├── profile.ts        # الملف الشخصي
│   ├── settings.ts       # الإعدادات
│   ├── specializations.ts# التخصصات والمحاور
│   └── about.ts          # عن المنصة
├── en/                   # English (mirrors ar/)
└── admin/                # Admin-specific translations
    ├── ar/level.admin.ts
    ├── ar/file.admin.ts
    ├── en/level.admin.ts
    └── en/file.admin.ts
```

## Usage
```typescript
import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store"

const { language } = useAppStore()
const t = locales[language].auth
return <h1>{t.login.title}</h1>
```

## Key Convention
- المفاتيح تتبع: `section.item.subitem`
- اللغة العربية هي الافتراضية (fallback)
- Skills: `frontend-pattern-skill.md`
