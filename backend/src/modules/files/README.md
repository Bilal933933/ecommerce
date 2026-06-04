# Files Module

**Description:** رفع وإدارة الملفات عبر Cloudinary: الصور الشخصية، المستندات، مع إدارة جلسات الرفع.

## Key Components

| Element | Description |
|---------|-------------|
| `FilesAdminController` | Routes إدارية للملفات |
| `FilesService` | Business logic للملفات |
| `CloudinaryService` | التكامل مع Cloudinary API |
| `FilesRepository` | Prisma queries للملفات |
| `SignedUrlDto` | DTO لطلب رابط رفع موقّع |
| `ConfirmUploadDto` | DTO لتأكيد اكتمال الرفع |

## Key Endpoints
| Endpoint | Description |
|----------|-------------|
| `POST /admin/files/signed-url` | إنشاء رابط رفع موقّت |
| `POST /admin/files/confirm` | تأكيد اكتمال الرفع |
| `DELETE /admin/files/:id` | حذف ملف |

## Key Functions
- `uploadFile`: رفع ملف إلى Cloudinary
- `deleteFile`: حذف ملف من Cloudinary ومن DB
- `getSignedUrl`: إنشاء رابط رفع موقّت

## Dependencies & Context
- `PrismaModule`
- `AppConfigService` (Cloudinary credentials)
- Skills: `backend-core-skill.md`
