# Landing Feature

**Description:** صفحة الهبوط الترحيبية للموقع: تعريف بالمنصة، الميزات، التخصصات، إحصائيات، دعوة للتسجيل.

## Key Components & Functions

| Element | Description |
|---------|-------------|
| `LandingPage` | صفحة الهبوط الرئيسية |
| `Navbar` | شريط التنقل (لوجو، روابط، زر تسجيل) |
| `Hero` | القسم الترحيبي الرئيسي |
| `Features` | عرض ميزات المنصة |
| `Specializations` | عرض التخصصات المتاحة |
| `Statistics` | إحصائيات المنصة (أرقام) |
| `GeneralSections` | المحاور العامة |
| `LeaderboardPreview` | معاينة للمتصدرين |
| `CTASection` | قسم الدعوة للتسجيل |
| `Footer` | تذييل الصفحة |

## Dependencies & Context
- `@workspace/locales` → `locales[lang].landing`
- `@workspace/store` → `useAuthStore` (تفادي عرضها للمسجل)
- Routes: `/` (public, no guard)
- Skills: `frontend-pattern-skill.md`
