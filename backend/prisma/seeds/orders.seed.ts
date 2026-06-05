/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import prisma from '../connect';
import * as bcrypt from 'bcrypt';

const CUSTOMER_EMAIL = 'customer@example.com';

async function ensureTestUser() {
  const existing = await prisma.user.findUnique({
    where: { email: CUSTOMER_EMAIL },
  });
  if (existing) return existing;

  const hashed = await bcrypt.hash('password123', 10);
  return prisma.user.create({
    data: {
      email: CUSTOMER_EMAIL,
      name: 'Test Customer',
      password: hashed,
      role: 'CUSTOMER',
      isEmailVerified: true,
    },
  });
}

async function getVariants() {
  return prisma.productVariant.findMany({
    where: { isDeleted: false },
    include: {
      product: {
        select: { id: true, type: true },
      },
    },
    take: 2,
  });
}

export async function seedOrders() {
  console.log('  🧹 حذف الطلبات السابقة');
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();

  console.log('  👤 التأكد من وجود مستخدم تجريبي');
  const user = await ensureTestUser();

  const variants = await getVariants();
  if (variants.length === 0) {
    console.log('  ⚠️  لا توجد منتجات — سيتم تخطي بذر الطلبات');
    return;
  }

  console.log('  📦 إنشاء طلب تجريبي');

  const first = variants[0];
  const second = variants.length > 1 ? variants[1] : null;

  const firstTotal = Number(first.price) * 2;
  const items: any[] = [
    {
      variantId: first.id,
      productId: first.product.id,
      quantity: 2,
      productName: { ar: 'منتج تجريبي', en: 'Test Product' },
      variantDetails: { 'اللون': 'أسود', 'المقاس': 'M' },
      unitPrice: first.price,
      totalPrice: firstTotal,
    },
  ];

  if (second) {
    const secondTotal = Number(second.price) * 1;
    items.push({
      variantId: second.id,
      productId: second.product.id,
      quantity: 1,
      productName: { ar: 'منتج تجريبي 2', en: 'Test Product 2' },
      variantDetails: { 'اللون': 'أبيض', 'المقاس': 'L' },
      unitPrice: second.price,
      totalPrice: secondTotal,
    });
  }

  const subtotal = Number(first.price) * 2 + (second ? Number(second.price) * 1 : 0);
  const total = subtotal;

  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${new Date().getFullYear()}-00001`,
      userId: user.id,
      status: 'PENDING',
      subtotal,
      shippingCost: 0,
      total,
      shippingAddress: {
        street: 'شارع الملك',
        city: 'الرياض',
        country: 'السعودية',
        zipCode: '12345',
      },
      items: { create: items },
      statusHistory: {
        create: {
          status: 'PENDING',
          changedById: user.id,
        },
      },
    },
    include: {
      items: true,
      statusHistory: true,
    },
  });

  console.log(`  ✅ تم إنشاء الطلب ${order.orderNumber} للمستخدم ${CUSTOMER_EMAIL}`);
}
