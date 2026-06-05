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

export async function seedCart() {
  console.log('  🧹 حذف عناصر السلة السابقة');
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  console.log('  👤 التأكد من وجود مستخدم تجريبي');
  const user = await ensureTestUser();

  const variant = await prisma.productVariant.findFirst({
    where: { isDefault: true, isDeleted: false },
    include: { product: { select: { id: true } } },
  });
  if (!variant) {
    console.log('  ⚠️  لا توجد منتجات — سيتم تخطي بذر السلة');
    return;
  }

  console.log('  🛒 إنشاء سلة تجريبية');

  const cart = await prisma.cart.create({
    data: { userId: user.id },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      variantId: variant.id,
      productId: variant.product.id,
      quantity: 2,
      priceAtAdd: variant.price,
    },
  });

  const secondVariant = await prisma.productVariant.findFirst({
    where: {
      id: { not: variant.id },
      isDeleted: false,
    },
    include: { product: { select: { id: true } } },
  });

  if (secondVariant) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: secondVariant.id,
        productId: secondVariant.product.id,
        quantity: 1,
        priceAtAdd: secondVariant.price,
      },
    });
  }

  console.log(`  ✅ تم إنشاء السلة للمستخدم ${CUSTOMER_EMAIL}`);
}
