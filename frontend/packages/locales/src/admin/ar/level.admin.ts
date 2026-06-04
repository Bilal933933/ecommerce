// packages/locales/ar/levelAdmin.ts

export const levelAdmin = {
  // عنوان الصفحة
  title: "المراحل الدراسية",
  description: "إدارة المراحل الدراسية للمنصة",
  
  // الأزرار
  addButton: "إضافة مرحلة",
  addFirst: "إضافة أول مرحلة",
  editButton: "تعديل",
  deleteButton: "حذف",
  
  // حالة التحميل
  loading: "جارٍ التحميل...",
  noData: "لا توجد مراحل دراسية بعد",
  
  // الحقول
  nameLabel: "اسم المرحلة",
  namePlaceholder: "مثال: المرحلة الابتدائية",
  descriptionLabel: "الوصف (اختياري)",
  descriptionPlaceholder: "وصف مختصر للمرحلة",
  orderLabel: "الترتيب",
  orderPlaceholder: "1",
  
  // أخطاء الحقول
  nameRequired: "اسم المرحلة مطلوب",
  nameMin: "اسم المرحلة يجب أن يكون 3 أحرف على الأقل",
  nameMax: "اسم المرحلة يجب أن لا يتجاوز 50 حرفاً",
  orderInvalidType: "الترتيب يجب أن يكون رقماً",
  orderMin: "الترتيب يجب أن يكون 1 على الأقل",
  orderInteger: "الترتيب يجب أن يكون رقماً صحيحاً",
  
  // رسائل الـ Dialog
  createTitle: "إضافة مرحلة جديدة",
  editTitle: "تعديل المرحلة",
  deleteTitle: "حذف المرحلة",
  deleteDescription: "هل أنت متأكد من حذف مرحلة \"{name}\"؟ سيتم حذف جميع الصفوف المرتبطة بها أيضاً. لا يمكن التراجع عن هذا الإجراء.",
  
  // رسائل النجاح
  createSuccess: "تم إنشاء المرحلة بنجاح",
  updateSuccess: "تم تحديث المرحلة بنجاح",
  deleteSuccess: "تم حذف المرحلة بنجاح",
  
  // رسائل الخطأ
  errorOccurred: "حدث خطأ",
  createError: "حدث خطأ أثناء إنشاء المرحلة",
  updateError: "حدث خطأ أثناء تحديث المرحلة",
  deleteError: "حدث خطأ أثناء حذف المرحلة",
  orderConflict: "ترتيب المرحلة مستخدم بالفعل",
  
  // أزرار الـ Dialog
  cancel: "إلغاء",
  confirmDelete: "تأكيد الحذف",
  save: "حفظ التعديلات",
  create: "إنشاء المرحلة",
  
  // حالة الحفظ
  saving: "جارٍ الحفظ...",
  deleting: "جارٍ الحذف...",
} as const;