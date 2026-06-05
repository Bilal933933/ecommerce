import prisma from './connect';
import { seedCategories } from './seeds/categories.seed';
import { seedProducts } from './seeds/products.seed';
import { seedCart } from './seeds/cart.seed';
import { seedOrders } from './seeds/orders.seed';

async function main() {
  console.log('🌱 بدء عملية البذر (Seeding)...\n');

  await seedCategories();
  await seedProducts();
  await seedCart();
  await seedOrders();

  console.log('\n✅ اكتملت عملية البذر بنجاح!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ حدث خطأ أثناء البذر:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
