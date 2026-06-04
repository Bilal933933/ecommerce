# Profile Feature

**Description:** عرض وتحرير الملف الشخصي: البيانات الشخصية، الإحصائيات، تقدم المحاور، الجلسات النشطة، تغيير كلمة المرور.

## Key Components & Functions

| Element | Description |
|---------|-------------|
| `ProfilePage` | الصفحة الرئيسية للملف الشخصي |
| `ProfileLayout` | تخطيط الصفحة (sidebar + main) |
| `ProfileSidebar` | الصورة، الاسم، التخصص |
| `StatsOverview` | إحصائيات الأداء الكلي |
| `SectionProgressList` | قائمة تقدم كل محور |
| `RecentExamsList` | آخر الاختبارات |
| `SessionsList` | الجلسات النشطة مع زر الإنهاء |
| `AccountActions` | تغيير كلمة المرور، حذف الحساب |
| `UserInfoCard` | معلومات المستخدم القابلة للتعديل |
| `AvatarCard` | رفع وتغيير الصورة الشخصية |
| `SpecializationCard` | اختيار التخصص |
| `EditProfileModal` | نافذة تعديل البيانات |
| `ChangePasswordModal` | نافذة تغيير كلمة المرور |
| `VerifyEmailModal` | نافذة تأكيد البريد الإلكتروني |
| `ConfirmLogoutAllModal` | تأكيد تسجيل الخروج من الكل |
| `LoadingSkeleton` | حالة التحميل |
| `useMyProfile` | Query: جلب كامل بيانات البروفايل |
| `useProfileActions` | Mutation: تحديث بيانات المستخدم |
| `useProfileAvatar` | Mutation: رفع الصورة الشخصية |

## Dependencies & Context
- `@workspace/api-client` → `usersClient`, `filesClient`
- `@workspace/locales` → `locales[lang].profile`
- `@workspace/ui` → Button, Input, Dialog, Avatar, Card
- Routes: `/profile` (under DashboardLayout)
- Backend: `modules/users/`, `modules/files/`
- Skills: `profile-skill.md`, `frontend-pattern-skill.md`
