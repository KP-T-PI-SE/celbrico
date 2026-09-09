import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing categories and products...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Seeding categories...');
    const categories = await Category.insertMany([
      {
        name: 'Pooja Kits',
        slug: 'pooja-kits',
        image: '/assets/categories/cat-pooja-kits.png',
        isActive: true,
      },
      {
        name: 'Hawan Samagri',
        slug: 'samagri',
        image: '/assets/categories/cat-samagri.png',
        isActive: true,
      },
      {
        name: 'Festive Groceries',
        slug: 'groceries',
        image: '/assets/categories/cat-groceries.png',
        isActive: true,
      },
      {
        name: 'Fresh Flowers',
        slug: 'flowers',
        image: '/assets/categories/cat-flowers.png',
        isActive: true,
      },
      {
        name: 'Fruits & Dry Fruits',
        slug: 'fruits',
        image: '/assets/categories/cat-fruits.png',
        isActive: true,
      },
    ]);

    const catMap: Record<string, mongoose.Types.ObjectId> = {};
    for (const c of categories) {
      catMap[c.slug] = c._id as mongoose.Types.ObjectId;
    }

    console.log('Seeding products...');
    await Product.insertMany([
      {
        name: 'Complete Laxmi Ganesh Pooja Kit',
        slug: 'complete-laxmi-ganesh-pooja-kit',
        category: catMap['pooja-kits'],
        price: 999,
        discountPrice: 799,
        stock: 50,
        images: ['/assets/hero-festive-hamper.png', '/assets/onboarding-pooja-hamper.png'],
        description: 'All-inclusive festive pooja kit with pure roli, chawal, dhoop, brass bell, gangajal, moli, agarbatti, and traditional vidhi guide.',
        isActive: true,
      },
      {
        name: 'Satyanarayan Katha Complete Samagri Kit',
        slug: 'satyanarayan-katha-complete-kit',
        category: catMap['pooja-kits'],
        price: 699,
        discountPrice: 549,
        stock: 40,
        images: ['/assets/onboarding-pooja-hamper.png'],
        description: 'Carefully curated kit containing panchamrit ingredients, supari, janeu, kapoor, yellow cloth, and satyanarayan book.',
        isActive: true,
      },
      {
        name: 'Pure Guggal & Loban Hawan Samagri (500g)',
        slug: 'pure-guggal-loban-hawan-samagri',
        category: catMap['samagri'],
        price: 349,
        discountPrice: 299,
        stock: 100,
        images: ['/assets/categories/cat-samagri.png'],
        description: 'Authentic organic herbs, dry coconut, guggal, loban, and kasturi blend for divine festive hawan and home purification.',
        isActive: true,
      },
      {
        name: 'Handcrafted Brass Diya Altar Set (Pack of 2)',
        slug: 'handcrafted-brass-diya-set',
        category: catMap['samagri'],
        price: 499,
        discountPrice: 399,
        stock: 65,
        images: ['/assets/bottom-diya-altar.png', '/assets/logo-diya.png'],
        description: 'Premium heavy virgin brass engraved diyas for mandir rituals and festive illuminations. Long-lasting flame reservoir.',
        isActive: true,
      },
      {
        name: 'Organic Desi A2 Cow Ghee for Diya (500ml)',
        slug: 'organic-desi-cow-ghee-500ml',
        category: catMap['groceries'],
        price: 650,
        discountPrice: 590,
        stock: 60,
        images: ['/assets/categories/cat-groceries.png'],
        description: 'Pure Vedic Bilona method cultured cow ghee ideal for sacred sacred offerings and illuminating pure diyas.',
        isActive: true,
      },
      {
        name: 'Fresh Festive Marigold Garland & Lotus Bundle',
        slug: 'fresh-festive-marigold-garland-lotus',
        category: catMap['flowers'],
        price: 249,
        discountPrice: 199,
        stock: 80,
        images: ['/assets/categories/cat-flowers.png'],
        description: 'Handpicked fresh orange and yellow marigold flowers, mango leaves, and 2 fresh sacred pink lotus buds for deity adornment.',
        isActive: true,
      },
      {
        name: 'Royal Dry Fruits & Panchmeva Pack (400g)',
        slug: 'royal-dry-fruits-panchmeva-pack',
        category: catMap['fruits'],
        price: 549,
        discountPrice: 479,
        stock: 55,
        images: ['/assets/categories/cat-fruits.png', '/assets/onboarding-produce-hamper.png'],
        description: 'Premium California almonds, jumbo cashews, green raisins, dried dates, and makhana for festive prasad and gifting.',
        isActive: true,
      },
      {
        name: 'Original Bhimseni Camphor & Chandan Tika Set',
        slug: 'original-bhimseni-camphor-chandan-set',
        category: catMap['samagri'],
        price: 249,
        discountPrice: 199,
        stock: 120,
        images: ['/assets/categories/cat-samagri.png'],
        description: '100% pure edible-grade Bhimseni Kapur that leaves zero residue, paired with aromatic Mysore Chandan paste.',
        isActive: true,
      },
    ]);

    // Ensure test admin user exists
    const adminPhone = '9999999999';
    let admin = await User.findOne({ mobileNumber: adminPhone });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash('1234', salt);
      admin = await User.create({
        mobileNumber: adminPhone,
        pinHash,
        isVerified: true,
        role: 'admin',
      });
      console.log(`Created default Admin user: +91 ${adminPhone} (PIN: 1234)`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
