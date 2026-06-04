# Admin Products Feature

**Description:** إدارة المنتجات من لوحة التحكم: عرض، إنشاء، تعديل، حذف.

## Key Components & Functions

| Element | Description |
|---------|-------------|
| `ProductCard` | بطاقة عرض منتج |
| `ProductSkeleton` | حالة تحميل المنتجات |
| `ProductsEmpty` | حالة عدم وجود منتجات |
| `store.ts` | Zustand store (products) |
| `queries.ts` | React Query keys |
| `api.ts` | دوال HTTP للمنتجات |
| `data.ts` | بيانات وهمية |

## Dependencies & Context
- Backend product endpoints (via adminClient)
- Routes: `/products` (AdminAuthGuard)
- Skills: `admin-skill.md`
