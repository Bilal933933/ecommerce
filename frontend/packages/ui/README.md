# @workspace/ui — UI Component Library

**Description:** مكتبة مكونات shadcn/ui مخصصة للمشروع: أزرار، حقول، بطاقات، حوارات، قوائم منسدلة، وغيرها.

## Key Components

| Component | Description |
|-----------|-------------|
| `Button` | زر تفاعلي بأنماط متعددة |
| `Input` | حقل إدخال نص |
| `Label` | تسمية للحقول |
| `Card` / `CardHeader` / `CardContent` / `CardFooter` | بطاقة عرض |
| `Field` / `FieldError` / `FieldSet` | حقل نموذج مع أخطاء |
| `Dialog` / `DialogContent` / `DialogHeader` / `DialogFooter` | نافذة حوار |
| `DropdownMenu` + sub-components | قائمة منسدلة |
| `Avatar` / `AvatarImage` / `AvatarFallback` / `AvatarBadge` / `AvatarGroup` | صورة شخصية |
| `Badge` | شارة تصنيف |
| `Separator` | فاصل بصري |
| `Progress` | شريط تقدم |
| `Sheet` | لوحة جانبية |
| `Loader` / `Spinner` / `SpinnerButton` | مؤشرات تحميل |
| `Skeleton` | هيكل عظمي للتحميل |
| `Tabs` | تبويب |
| `Tooltip` | تلميح منبثق |
| `Alert` / `AlertDialog` | تنبيهات |

## Utilities
- `cn()`: دمج Tailwind classes مع clsx
- `use-mobile`: كشف جهاز محمول

## Dependencies & Context
- `tailwindcss` v4 (styling)
- `radix-ui/react-*` (headless primitives)
- `lucide-react` (icons)
- `@workspace/types` (shared types)
- كل التطبيقات (web + admin) تعتمد على هذه الحزمة
