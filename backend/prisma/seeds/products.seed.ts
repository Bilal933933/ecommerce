/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '../connect';

async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category)
    throw new Error(`Category "${slug}" not found. Run categories seed first.`);
  return category;
}

export async function seedProducts() {
  console.log('  🗑️  حذف المنتجات السابقة');
  await prisma.productVariantValue.deleteMany();
  await prisma.productVariantImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productAttributeValueTranslation.deleteMany();
  await prisma.productAttributeValue.deleteMany();
  await prisma.productAttributeTranslation.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productTranslation.deleteMany();
  await prisma.product.deleteMany();

  const electronics = await getCategory('electronics');
  const mobilePhones = await getCategory('mobile-phones');
  const laptops = await getCategory('laptops');
  const fashion = await getCategory('fashion');
  const mensFashion = await getCategory('mens-fashion');
  const womensFashion = await getCategory('womens-fashion');
  const home = await getCategory('home-garden');
  const furniture = await getCategory('furniture');
  const sports = await getCategory('sports');
  const fitness = await getCategory('fitness');
  const beauty = await getCategory('beauty');

  // ─── 1. هاتف ذكي ──────────────────────────────────────────
  const phone = await prisma.product.create({
    data: {
      slug: 'smartphone-pro-x',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: mobilePhones.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'هاتف ذكي Pro X',
            description:
              'هاتف متطور بشاشة OLED 6.7 إنش، كاميرا 108MP، بطارية 5000mAh',
          },
          {
            locale: 'en',
            name: 'Smartphone Pro X',
            description:
              'Advanced phone with 6.7" OLED display, 108MP camera, 5000mAh battery',
          },
        ],
      },
      attributes: {
        create: [
          {
            order: 1,
            translations: {
              create: [
                { locale: 'ar', name: 'اللون' },
                { locale: 'en', name: 'Color' },
              ],
            },
            values: {
              create: [
                {
                  order: 1,
                  translations: {
                    create: [
                      { locale: 'ar', name: 'أسود' },
                      { locale: 'en', name: 'Black' },
                    ],
                  },
                },
                {
                  order: 2,
                  translations: {
                    create: [
                      { locale: 'ar', name: 'أبيض' },
                      { locale: 'en', name: 'White' },
                    ],
                  },
                },
              ],
            },
          },
          {
            order: 2,
            translations: {
              create: [
                { locale: 'ar', name: 'السعة' },
                { locale: 'en', name: 'Storage' },
              ],
            },
            values: {
              create: [
                {
                  order: 1,
                  translations: {
                    create: [
                      { locale: 'ar', name: '128 جيجابايت' },
                      { locale: 'en', name: '128GB' },
                    ],
                  },
                },
                {
                  order: 2,
                  translations: {
                    create: [
                      { locale: 'ar', name: '256 جيجابايت' },
                      { locale: 'en', name: '256GB' },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'PHONE-BLK-128',
            price: 1999,
            comparePrice: 2299,
            stock: 50,
            isDefault: true,
          },
          { sku: 'PHONE-BLK-256', price: 2499, comparePrice: 2799, stock: 30 },
          { sku: 'PHONE-WHT-128', price: 1999, stock: 20 },
        ],
      },
    },
  });
  console.log(`  ✅ ${phone.slug}`);

  // ─── 2. لابتوب محمول ──────────────────────────────────────
  const laptop = await prisma.product.create({
    data: {
      slug: 'ultrabook-pro-15',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: laptops.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'لابتوب ألترابوك Pro 15',
            description: 'لابتوب خفيف مع معالج i7، رام 16GB، شاشة 15.6 إنش',
          },
          {
            locale: 'en',
            name: 'Ultrabook Pro 15',
            description:
              'Lightweight laptop with i7 processor, 16GB RAM, 15.6" display',
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'LAPTOP-I7-16',
            price: 5499,
            comparePrice: 5999,
            stock: 15,
            isDefault: true,
          },
          { sku: 'LAPTOP-I9-32', price: 7499, stock: 10 },
        ],
      },
    },
  });
  console.log(`  ✅ ${laptop.slug}`);

  // ─── 3. سماعات لاسلكية ────────────────────────────────────
  const headphones = await prisma.product.create({
    data: {
      slug: 'wireless-headphones-pro',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: electronics.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'سماعات لاسلكية برو',
            description: 'سماعات بلوتوث مع عزل ضوضاء، بطارية 30 ساعة',
          },
          {
            locale: 'en',
            name: 'Wireless Headphones Pro',
            description:
              'Bluetooth headphones with noise cancellation, 30h battery',
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'HEADPHONE-BLK',
            price: 899,
            comparePrice: 1099,
            stock: 100,
            isDefault: true,
          },
          { sku: 'HEADPHONE-WHT', price: 899, stock: 75 },
        ],
      },
    },
  });
  console.log(`  ✅ ${headphones.slug}`);

  // ─── 4. قميص رجالي ────────────────────────────────────────
  const shirt = await prisma.product.create({
    data: {
      slug: 'cotton-shirt-slim',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: mensFashion.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'قميص قطني نحيف',
            description: 'قميص رجالي قطني بقصة نحيفة، مناسب للعمل والمناسبات',
          },
          {
            locale: 'en',
            name: 'Slim Fit Cotton Shirt',
            description:
              "Men's slim fit cotton shirt, suitable for work and occasions",
          },
        ],
      },
      attributes: {
        create: [
          {
            order: 1,
            translations: {
              create: [
                { locale: 'ar', name: 'المقاس' },
                { locale: 'en', name: 'Size' },
              ],
            },
            values: {
              create: [
                {
                  order: 1,
                  translations: {
                    create: [
                      { locale: 'ar', name: 'M' },
                      { locale: 'en', name: 'M' },
                    ],
                  },
                },
                {
                  order: 2,
                  translations: {
                    create: [
                      { locale: 'ar', name: 'L' },
                      { locale: 'en', name: 'L' },
                    ],
                  },
                },
                {
                  order: 3,
                  translations: {
                    create: [
                      { locale: 'ar', name: 'XL' },
                      { locale: 'en', name: 'XL' },
                    ],
                  },
                },
              ],
            },
          },
          {
            order: 2,
            translations: {
              create: [
                { locale: 'ar', name: 'اللون' },
                { locale: 'en', name: 'Color' },
              ],
            },
            values: {
              create: [
                {
                  order: 1,
                  translations: {
                    create: [
                      { locale: 'ar', name: 'أبيض' },
                      { locale: 'en', name: 'White' },
                    ],
                  },
                },
                {
                  order: 2,
                  translations: {
                    create: [
                      { locale: 'ar', name: 'أزرق' },
                      { locale: 'en', name: 'Blue' },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'SHIRT-WHT-M',
            price: 149,
            comparePrice: 199,
            stock: 200,
            isDefault: true,
          },
          { sku: 'SHIRT-WHT-L', price: 149, stock: 150 },
          { sku: 'SHIRT-WHT-XL', price: 159, stock: 100 },
          { sku: 'SHIRT-BLU-M', price: 149, stock: 180 },
          { sku: 'SHIRT-BLU-L', price: 149, stock: 120 },
        ],
      },
    },
  });
  console.log(`  ✅ ${shirt.slug}`);

  // ─── 5. حقيبة يد نسائية ────────────────────────────────────
  const bag = await prisma.product.create({
    data: {
      slug: 'leather-handbag-elegant',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: womensFashion.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'حقيبة يد جلدية أنيقة',
            description:
              'حقيبة يد نسائية من الجلد الطبيعي، مقاس وسط، مثالية للعمل',
          },
          {
            locale: 'en',
            name: 'Elegant Leather Handbag',
            description:
              "Women's genuine leather handbag, medium size, perfect for work",
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'BAG-BRN',
            price: 599,
            comparePrice: 799,
            stock: 40,
            isDefault: true,
          },
          { sku: 'BAG-BLK', price: 599, stock: 35 },
        ],
      },
    },
  });
  console.log(`  ✅ ${bag.slug}`);

  // ─── 6. أريكة منزلية ───────────────────────────────────────
  const sofa = await prisma.product.create({
    data: {
      slug: 'fabric-sofa-3-seat',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: furniture.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'أريكة قماش 3 مقاعد',
            description: 'أريكة منزلية مريحة 3 مقاعد، قماش عالي الجودة',
          },
          {
            locale: 'en',
            name: '3-Seater Fabric Sofa',
            description: 'Comfortable 3-seater home sofa, high quality fabric',
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'SOFA-GRY',
            price: 2999,
            comparePrice: 3599,
            stock: 10,
            isDefault: true,
          },
          { sku: 'SOFA-BGE', price: 2799, stock: 8 },
        ],
      },
    },
  });
  console.log(`  ✅ ${sofa.slug}`);

  // ─── 7. جهاز مشي كهربائي ──────────────────────────────────
  const treadmill = await prisma.product.create({
    data: {
      slug: 'electric-treadmill-pro',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: fitness.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'جهاز مشي كهربائي Pro',
            description:
              'جهاز مشي كهربائي بمحرك 3HP، سرعة حتى 18 كم/س، ميلان آلي',
          },
          {
            locale: 'en',
            name: 'Electric Treadmill Pro',
            description:
              'Electric treadmill with 3HP motor, speed up to 18 km/h, auto incline',
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'TREADMILL-3HP',
            price: 4999,
            comparePrice: 5999,
            stock: 5,
            isDefault: true,
          },
        ],
      },
    },
  });
  console.log(`  ✅ ${treadmill.slug}`);

  // ─── 8. كريم ترطيب بشرة ────────────────────────────────────
  const cream = await prisma.product.create({
    data: {
      slug: 'moisturizing-cream-vitamin-c',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: beauty.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'كريم ترطيب فيتامين C',
            description:
              'كريم ترطيب للوجه بفيتامين C، مناسب لجميع أنواع البشرة، 50مل',
          },
          {
            locale: 'en',
            name: 'Vitamin C Moisturizing Cream',
            description:
              'Face moisturizer with Vitamin C, suitable for all skin types, 50ml',
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'CRM-VITC-50',
            price: 199,
            comparePrice: 249,
            stock: 300,
            isDefault: true,
          },
          { sku: 'CRM-VITC-100', price: 349, stock: 200 },
        ],
      },
    },
  });
  console.log(`  ✅ ${cream.slug}`);

  // ─── 9. كتاب تطوير الذات ──────────────────────────────────
  const book = await prisma.product.create({
    data: {
      slug: 'atomic-habits-arabic',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'العادات الذرية',
            description:
              'كتاب العادات الذرية لجيمس كلير - نسخة عربية - أفضل كتب تطوير الذات',
          },
          {
            locale: 'en',
            name: 'Atomic Habits',
            description:
              'Atomic Habits by James Clear - Arabic edition - best self-development book',
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'BOOK-ATOMIC-HB',
            price: 89,
            comparePrice: 119,
            stock: 500,
            isDefault: true,
          },
          { sku: 'BOOK-ATOMIC-PB', price: 59, stock: 1000 },
        ],
      },
    },
  });
  console.log(`  ✅ ${book.slug}`);

  // ─── 10. ساعة ذكية ────────────────────────────────────────
  const watch = await prisma.product.create({
    data: {
      slug: 'smart-watch-sport',
      type: 'PHYSICAL',
      status: 'PUBLISHED',
      categoryId: electronics.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'ساعة ذكية رياضية',
            description:
              'ساعة ذكية مقاومة للماء، قياس نبضات القلب، GPS، بطارية 7 أيام',
          },
          {
            locale: 'en',
            name: 'Smart Sport Watch',
            description:
              'Waterproof smart watch, heart rate monitor, GPS, 7-day battery',
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'WATCH-BLK',
            price: 1299,
            comparePrice: 1499,
            stock: 60,
            isDefault: true,
          },
          { sku: 'WATCH-BLU', price: 1299, stock: 40 },
        ],
      },
    },
  });
  console.log(`  ✅ ${watch.slug}`);
}
