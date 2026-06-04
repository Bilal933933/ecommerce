// src/common/utils/slug.util.ts

interface SlugRepo {
  exists: (slug: string, excludeId?: string) => Promise<boolean>;
}

export class SlugUtil {
  private readonly arabicToEnglishDigits: { [key: string]: string } = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
  };

  generateSlug(name: string): string {
    if (!name) return '';

    return (
      name
        .trim()
        .toLowerCase()
        // توحيد الأحرف المتشابهة
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ة]/g, 'ه')
        .replace(/[ى]/g, 'ي')
        // تحويل الأرقام العربية
        .replace(/[٠-٩]/g, (d) => this.arabicToEnglishDigits[d] ?? d)
        // إزالة الأحرف غير المسموحة
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        // تحويل المسافات إلى شرطات
        .replace(/\s+/g, '-')
        // إزالة الشرطات المتكررة
        .replace(/-+/g, '-')
        // إزالة الشرطات من البداية والنهاية
        .replace(/^-|-$/g, '')
    );
  }

  async ensureUniqueSlug(
    slug: string,
    repo: SlugRepo,
    excludeId?: string,
  ): Promise<string> {
    const exists = await repo.exists(slug, excludeId);
    if (exists) {
      // إضافة timestamp أقصر وأكثر قابلية للقراءة
      const suffix = Date.now().toString(36);
      return `${slug}-${suffix}`;
    }
    return slug;
  }
}
