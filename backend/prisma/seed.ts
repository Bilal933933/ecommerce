import prisma from './connect';

async function main() {
  console.log('🌱 بدء عملية البذر (Seeding)...\n');

  console.log('✅ اكتملت عملية البذر بنجاح!');
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
