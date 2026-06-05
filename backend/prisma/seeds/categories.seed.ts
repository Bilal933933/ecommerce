import prisma from '../connect';

export async function seedCategories() {
  console.log('  🗑️  حذف التصنيفات السابقة');
  await prisma.categoryTranslation.deleteMany();
  await prisma.category.deleteMany();

  const electronics = await prisma.category.create({
    data: {
      slug: 'electronics',
      icon: 'Laptop',
      color: '#2563eb',
      order: 1,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'إلكترونيات',
            description: 'كل ما يخص الأجهزة الإلكترونية والكهربائية',
          },
          {
            locale: 'en',
            name: 'Electronics',
            description: 'All electronics and electrical devices',
          },
        ],
      },
    },
  });
  console.log(`  ✅ ${electronics.slug}`);

  const fashion = await prisma.category.create({
    data: {
      slug: 'fashion',
      icon: 'Shirt',
      color: '#db2777',
      order: 2,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'موضة',
            description: 'الأزياء والملابس والإكسسوارات',
          },
          {
            locale: 'en',
            name: 'Fashion',
            description: 'Clothing, accessories and style',
          },
        ],
      },
    },
  });
  console.log(`  ✅ ${fashion.slug}`);

  const home = await prisma.category.create({
    data: {
      slug: 'home-garden',
      icon: 'Home',
      color: '#059669',
      order: 3,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'المنزل والحديقة',
            description: 'أثاث، ديكور، أدوات منزلية ومستلزمات الحديقة',
          },
          {
            locale: 'en',
            name: 'Home & Garden',
            description: 'Furniture, decor, kitchenware and garden supplies',
          },
        ],
      },
    },
  });
  console.log(`  ✅ ${home.slug}`);

  const sports = await prisma.category.create({
    data: {
      slug: 'sports',
      icon: 'Trophy',
      color: '#dc2626',
      order: 4,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'رياضة',
            description: 'معدات رياضية، لياقة بدنية وأنشطة خارجية',
          },
          {
            locale: 'en',
            name: 'Sports',
            description: 'Sports equipment, fitness and outdoor activities',
          },
        ],
      },
    },
  });
  console.log(`  ✅ ${sports.slug}`);

  const books = await prisma.category.create({
    data: {
      slug: 'books',
      icon: 'BookOpen',
      color: '#7c3aed',
      order: 5,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'كتب',
            description: 'كتب عربية وإنجليزية في جميع المجالات',
          },
          {
            locale: 'en',
            name: 'Books',
            description: 'Arabic and English books across all genres',
          },
        ],
      },
    },
  });
  console.log(`  ✅ ${books.slug}`);

  const beauty = await prisma.category.create({
    data: {
      slug: 'beauty',
      icon: 'Sparkles',
      color: '#e11d48',
      order: 6,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'الجمال والعناية',
            description: 'مستحضرات تجميل، عناية بالبشرة والشعر',
          },
          {
            locale: 'en',
            name: 'Beauty & Care',
            description: 'Cosmetics, skincare and hair care',
          },
        ],
      },
    },
  });
  console.log(`  ✅ ${beauty.slug}`);

  const mobilePhones = await prisma.category.create({
    data: {
      slug: 'mobile-phones',
      icon: 'Smartphone',
      color: '#2563eb',
      order: 1,
      parentId: electronics.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'هواتف محمولة',
            description: 'جوالات، تابلت وإكسسوارات',
          },
          {
            locale: 'en',
            name: 'Mobile Phones',
            description: 'Smartphones, tablets and accessories',
          },
        ],
      },
    },
  });
  console.log(`  ✅ ${mobilePhones.slug}`);

  await prisma.category.create({
    data: {
      slug: 'laptops',
      icon: 'Monitor',
      color: '#2563eb',
      order: 2,
      parentId: electronics.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'لابتوب وأجهزة كمبيوتر',
            description: 'لابتوبات، أجهزة مكتبية وملحقاتها',
          },
          {
            locale: 'en',
            name: 'Laptops & Computers',
            description: 'Laptops, desktops and peripherals',
          },
        ],
      },
    },
  });
  console.log('  ✅ laptops');

  await prisma.category.create({
    data: {
      slug: 'audio',
      icon: 'Headphones',
      color: '#2563eb',
      order: 3,
      parentId: electronics.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'سماعات وصوتيات',
            description: 'سماعات، مكبرات صوت وأجهزة صوت',
          },
          {
            locale: 'en',
            name: 'Audio & Headphones',
            description: 'Headphones, speakers and audio gear',
          },
        ],
      },
    },
  });
  console.log('  ✅ audio');

  await prisma.category.create({
    data: {
      slug: 'mens-fashion',
      icon: 'User',
      color: '#db2777',
      order: 1,
      parentId: fashion.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'أزياء رجالية',
            description: 'ملابس رجالية، أحذية وإكسسوارات',
          },
          {
            locale: 'en',
            name: "Men's Fashion",
            description: "Men's clothing, shoes and accessories",
          },
        ],
      },
    },
  });
  console.log('  ✅ mens-fashion');

  await prisma.category.create({
    data: {
      slug: 'womens-fashion',
      icon: 'User',
      color: '#db2777',
      order: 2,
      parentId: fashion.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'أزياء نسائية',
            description: 'ملابس نسائية، أحذية وحقائب',
          },
          {
            locale: 'en',
            name: "Women's Fashion",
            description: "Women's clothing, shoes and bags",
          },
        ],
      },
    },
  });
  console.log('  ✅ womens-fashion');

  await prisma.category.create({
    data: {
      slug: 'kids-fashion',
      icon: 'Baby',
      color: '#db2777',
      order: 3,
      parentId: fashion.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'أزياء أطفال',
            description: 'ملابس أطفال ومواليد',
          },
          {
            locale: 'en',
            name: "Kids' Fashion",
            description: "Children's and baby clothing",
          },
        ],
      },
    },
  });
  console.log('  ✅ kids-fashion');

  await prisma.category.create({
    data: {
      slug: 'furniture',
      icon: 'Sofa',
      color: '#059669',
      order: 1,
      parentId: home.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'أثاث',
            description: 'أثاث منزلي، غرف نوم وصالونات',
          },
          {
            locale: 'en',
            name: 'Furniture',
            description: 'Home furniture, bedrooms and living rooms',
          },
        ],
      },
    },
  });
  console.log('  ✅ furniture');

  await prisma.category.create({
    data: {
      slug: 'kitchen',
      icon: 'UtensilsCrossed',
      color: '#059669',
      order: 2,
      parentId: home.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'أدوات مطبخ',
            description: 'أواني، أجهزة مطبخ وأدوات طهي',
          },
          {
            locale: 'en',
            name: 'Kitchenware',
            description: 'Cookware, kitchen appliances and utensils',
          },
        ],
      },
    },
  });
  console.log('  ✅ kitchen');

  await prisma.category.create({
    data: {
      slug: 'fitness',
      icon: 'Dumbbell',
      color: '#dc2626',
      order: 1,
      parentId: sports.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'لياقة بدنية',
            description: 'أجهزة رياضية، أوزان وتمارين',
          },
          {
            locale: 'en',
            name: 'Fitness',
            description: 'Gym equipment, weights and exercise gear',
          },
        ],
      },
    },
  });
  console.log('  ✅ fitness');

  await prisma.category.create({
    data: {
      slug: 'outdoor',
      icon: 'Mountain',
      color: '#dc2626',
      order: 2,
      parentId: sports.id,
      translations: {
        create: [
          {
            locale: 'ar',
            name: 'أنشطة خارجية',
            description: 'تخييم، مشي ورحلات',
          },
          {
            locale: 'en',
            name: 'Outdoor Activities',
            description: 'Camping, hiking and adventure gear',
          },
        ],
      },
    },
  });
  console.log('  ✅ outdoor');
}
