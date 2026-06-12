import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with templates and categories...')

  const languages = [
    'en', // English
    'hi', // Hindi
    'mr', // Marathi
    'gu', // Gujarati
    'ta', // Tamil
    'te', // Telugu
    'kn', // Kannada
    'bn', // Bengali
    'pa', // Punjabi
    'ur', // Urdu
  ]

  // Create site counter if it doesn't exist
  await prisma.siteCounter.upsert({
    where: { key: 'total_biodatas_generated' },
    update: {},
    create: {
      key: 'total_biodatas_generated',
      value: 0,
    },
  })

  const templatesToCreate = [
    {
      slug: 'simple-clean',
      name: 'Simple Clean',
      category: 'Simple Free',
      languageSupport: languages,
      priceInPaise: 0,
      isFree: true,
      previewImage: '/templates/simple-clean.jpg',
      styleConfig: { theme: 'light', font: 'sans' },
      supportedExports: ['IMAGE', 'PDF'],
    },
    {
      slug: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'Modern Free',
      languageSupport: languages,
      priceInPaise: 0,
      isFree: true,
      previewImage: '/templates/modern-minimal.jpg',
      styleConfig: { theme: 'light', font: 'sans', layout: 'twocolumn' },
      supportedExports: ['IMAGE', 'PDF'],
    },
    {
      slug: 'classic-gold',
      name: 'Classic Gold',
      category: 'Classic',
      languageSupport: languages,
      priceInPaise: 1000, // ₹10
      isFree: false,
      previewImage: '/templates/classic-gold.jpg',
      styleConfig: { theme: 'gold', font: 'serif', border: 'ornate' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'elegant-floral',
      name: 'Elegant Floral',
      category: 'Elegant',
      languageSupport: languages,
      priceInPaise: 1000, // ₹10
      isFree: false,
      previewImage: '/templates/elegant-floral.jpg',
      styleConfig: { theme: 'floral', font: 'serif', motif: 'flowers' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'marathi-ganpati-traditional',
      name: 'Marathi Ganpati Traditional',
      category: 'Traditional',
      languageSupport: ['mr', 'hi', 'en'], // Specific language preference or all
      priceInPaise: 2000, // ₹20
      isFree: false,
      previewImage: '/templates/marathi-ganpati.jpg',
      styleConfig: { theme: 'orange', motif: 'ganpati', border: 'traditional' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'gujarati-patola-royal',
      name: 'Gujarati Patola Royal',
      category: 'Regional',
      languageSupport: ['gu', 'hi', 'en'],
      priceInPaise: 2000, // ₹20
      isFree: false,
      previewImage: '/templates/gujarati-patola.jpg',
      styleConfig: { theme: 'red', pattern: 'patola', border: 'heavy' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'tamil-kolam-elegant',
      name: 'Tamil Kolam Elegant',
      category: 'Regional',
      languageSupport: ['ta', 'en'],
      priceInPaise: 2000, // ₹20
      isFree: false,
      previewImage: '/templates/tamil-kolam.jpg',
      styleConfig: { theme: 'yellow', motif: 'kolam', layout: 'centered' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'punjabi-phulkari-premium',
      name: 'Punjabi Phulkari Premium',
      category: 'Premium Photo',
      languageSupport: ['pa', 'hi', 'en'],
      priceInPaise: 3000, // ₹30
      isFree: false,
      previewImage: '/templates/punjabi-phulkari.jpg',
      styleConfig: { theme: 'multicolor', pattern: 'phulkari', photo: 'large' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'bengali-alpana-classic',
      name: 'Bengali Alpana Classic',
      category: 'Regional',
      languageSupport: ['bn', 'en'],
      priceInPaise: 2000, // ₹20
      isFree: false,
      previewImage: '/templates/bengali-alpana.jpg',
      styleConfig: { theme: 'white-red', motif: 'alpana', font: 'serif' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'urdu-geometric-royal',
      name: 'Urdu Geometric Royal',
      category: 'Royal',
      languageSupport: ['ur', 'hi', 'en'],
      priceInPaise: 3000, // ₹30
      isFree: false,
      previewImage: '/templates/urdu-geometric.jpg',
      styleConfig: { theme: 'green-gold', pattern: 'geometric', layout: 'rtl-friendly' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    // Adding 10 more variations to reach 20
    {
      slug: 'simple-blue',
      name: 'Simple Blue',
      category: 'Simple Free',
      languageSupport: languages,
      priceInPaise: 0,
      isFree: true,
      previewImage: '/templates/simple-blue.jpg',
      styleConfig: { theme: 'blue', font: 'sans' },
      supportedExports: ['IMAGE', 'PDF'],
    },
    {
      slug: 'modern-dark',
      name: 'Modern Dark Mode',
      category: 'Modern Free',
      languageSupport: languages,
      priceInPaise: 0,
      isFree: true,
      previewImage: '/templates/modern-dark.jpg',
      styleConfig: { theme: 'dark', font: 'sans', layout: 'twocolumn' },
      supportedExports: ['IMAGE', 'PDF'],
    },
    {
      slug: 'classic-silver',
      name: 'Classic Silver',
      category: 'Classic',
      languageSupport: languages,
      priceInPaise: 1000,
      isFree: false,
      previewImage: '/templates/classic-silver.jpg',
      styleConfig: { theme: 'silver', font: 'serif', border: 'ornate' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'elegant-rose',
      name: 'Elegant Rose',
      category: 'Elegant',
      languageSupport: languages,
      priceInPaise: 1000,
      isFree: false,
      previewImage: '/templates/elegant-rose.jpg',
      styleConfig: { theme: 'rose', font: 'serif', motif: 'flowers' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'traditional-peacock',
      name: 'Traditional Peacock',
      category: 'Traditional',
      languageSupport: languages,
      priceInPaise: 2000,
      isFree: false,
      previewImage: '/templates/traditional-peacock.jpg',
      styleConfig: { theme: 'cyan-green', motif: 'peacock' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'regional-kerala-mural',
      name: 'Kerala Mural Art',
      category: 'Regional',
      languageSupport: ['en'], // Usually en for south india generic, but can add ml if needed
      priceInPaise: 2000,
      isFree: false,
      previewImage: '/templates/kerala-mural.jpg',
      styleConfig: { theme: 'earthy', pattern: 'mural' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'royal-rajputana',
      name: 'Royal Rajputana',
      category: 'Royal',
      languageSupport: ['hi', 'en'],
      priceInPaise: 3000,
      isFree: false,
      previewImage: '/templates/royal-rajputana.jpg',
      styleConfig: { theme: 'maroon-gold', pattern: 'royal-arch' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'premium-photo-modern',
      name: 'Premium Photo Modern',
      category: 'Premium Photo',
      languageSupport: languages,
      priceInPaise: 3000,
      isFree: false,
      previewImage: '/templates/premium-photo-modern.jpg',
      styleConfig: { theme: 'light', photo: 'full-bleed' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'no-photo-classic',
      name: 'No-Photo Classic Text',
      category: 'No-photo Premium',
      languageSupport: languages,
      priceInPaise: 2000,
      isFree: false,
      previewImage: '/templates/no-photo-classic.jpg',
      styleConfig: { theme: 'cream', layout: 'text-heavy' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    },
    {
      slug: 'no-photo-modern',
      name: 'No-Photo Modern Typography',
      category: 'No-photo Premium',
      languageSupport: languages,
      priceInPaise: 2000,
      isFree: false,
      previewImage: '/templates/no-photo-modern.jpg',
      styleConfig: { theme: 'white', font: 'display-sans' },
      supportedExports: ['IMAGE', 'PDF', 'DOCX'],
    }
  ]

  for (const t of templatesToCreate) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    })
  }

  console.log('Seeded 20 templates.')

  // Seed default admin user
  const crypto = require('crypto');
  const passwordHash = crypto.createHash('sha256').update('adminpassword123').digest('hex');
  await prisma.adminUser.upsert({
    where: { email: 'admin@biodatamaker.com' },
    update: {
      passwordHash,
    },
    create: {
      email: 'admin@biodatamaker.com',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Seeded admin user (admin@biodatamaker.com / adminpassword123).');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
