# 🚀 shadcn/ui Monorepo Template

<div dir="rtl">

قالب Monorepo حديث ومتكامل مبني على Turbo و Pnpm و shadcn/ui لإنشاء تطبيقات React قابلة للتوسع.

---



## ⚡ البدء السريع

### المتطلبات
- Node.js >= 20
- pnpm >= 9.15

### التثبيت والتشغيل

```bash
# تثبيت الحزم
pnpm install

# تشغيل التطبيقات
pnpm dev

# الموقع: http://localhost:5173 (web) و http://localhost:5174 (admin)
```

---

## 📦 ما هو مضمن؟

✅ **Monorepo** - إدارة متعددة التطبيقات
✅ **shadcn/ui** - مكونات UI قابلة للتخصيص
✅ **React Router** - توجيه متقدم
✅ **React Query** - إدارة البيانات
✅ **Zustand** - إدارة الحالة
✅ **TypeScript** - أمان النوع الكامل
✅ **Tailwind CSS** - تصميم احترافي

---

## 📂 بنية المشروع

```
client/
├── apps/
│   ├── web/          # موقع عام
│   └── admin/        # لوحة تحكم
├── packages/
│   ├── ui/           # مكونات مشتركة
│   ├── api-client/   # عميل HTTP
│   ├── store/        # إدارة الحالة
│   ├── types/        # أنواع مشتركة
│   └── locales/      # ترجمات
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

---

## 🎯 الأوامر الرئيسية

```bash
# التطوير
pnpm dev              # جميع التطبيقات
pnpm dev:web          # موقع web فقط
pnpm dev:admin        # لوحة التحكم فقط

# البناء
pnpm build            # بناء الكل
pnpm build:web        # بناء web
pnpm build:admin      # بناء admin

# التحقق
pnpm lint             # فحص الأخطاء
pnpm format           # تنسيق الأكواد
pnpm typecheck        # فحص النوع

# التنظيف
pnpm clean            # حذف ملفات مؤقتة
```

---

## 🎨 إضافة مكونات

```bash
# إضافة مكون جديد
pnpm dlx shadcn-ui@latest add button -c apps/web
```

المكونات تُوضع في `packages/ui/src/components/`

### الاستخدام

```tsx
import { Button } from "@workspace/ui/components/button";

export function MyApp() {
  return <Button>اضغط هنا</Button>;
}
```

---

## 🔗 الروابط المفيدة

- [Turbo](https://turbo.build/repo)
- [Pnpm](https://pnpm.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📄 الترخيص

مفتوح المصدر ومتاح للاستخدام الحر

</div>
