/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import prisma from '../connect';
import * as bcrypt from 'bcrypt';

const DRIVER_EMAIL = 'driver@example.com';
const CUSTOMER_EMAIL = 'customer@example.com';

async function ensureDriverUser() {
  const existing = await prisma.user.findUnique({
    where: { email: DRIVER_EMAIL },
  });
  if (existing) return existing;

  const hashed = await bcrypt.hash('password123', 10);
  return prisma.user.create({
    data: {
      email: DRIVER_EMAIL,
      name: 'Test Driver',
      password: hashed,
      role: 'DELIVERY',
      isEmailVerified: true,
    },
  });
}

async function getConfirmedOrder() {
  const user = await prisma.user.findUnique({
    where: { email: CUSTOMER_EMAIL },
  });
  if (!user) return null;

  let order = await prisma.order.findFirst({
    where: { userId: user.id, status: 'PENDING' },
  });

  if (!order) {
    order = await prisma.order.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (!order) return null;

  if (order.status === 'PENDING') {
    order = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CONFIRMED' },
    });
  }

  return order;
}

export async function seedDeliveries() {
  console.log('  🧹 حذف التوصيلات السابقة');
  await prisma.delivery.deleteMany();

  console.log('  👤 إنشاء سائق تجريبي');
  const driver = await ensureDriverUser();

  console.log('  📦 الحصول على طلب مؤكد');
  const order = await getConfirmedOrder();
  if (!order) {
    console.log('  ⚠️  لا يوجد طلب — تخطي بذر التوصيلات');
    return;
  }

  console.log('  🚚 إنشاء توصيل داخلي');
  const delivery = await prisma.delivery.create({
    data: {
      orderId: order.id,
      type: 'INTERNAL',
      status: 'ASSIGNED',
      driverId: driver.id,
      estimatedAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      notes: 'توصيل تجريبي',
    },
  });

  console.log(`  ✅ تم إنشاء التوصيل ${delivery.id} للسائق ${DRIVER_EMAIL}`);
}
