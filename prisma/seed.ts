import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning up existing template database...')
  await prisma.template.deleteMany({})

  console.log('Seeding site counter...')
  await prisma.siteCounter.upsert({
    where: { key: 'total_biodatas_generated' },
    update: {},
    create: {
      key: 'total_biodatas_generated',
      value: 0,
    },
  })

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'kn', name: 'Kannada' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ur', name: 'Urdu' },
  ]

  const templatesToCreate: any[] = []

  // Design configs per language to match regional design directions
  const regionalStyles: Record<string, { theme: string; border: string; primaryColor: string; font: string }> = {
    mr: { theme: 'saffron', border: 'paithani', primaryColor: '#b45309', font: 'serif' }, // Paithani border, saffron/maroon/gold
    hi: { theme: 'mandala', border: 'gold-mandala', primaryColor: '#854d0e', font: 'serif' }, // Mandala, lotus, gold border
    gu: { theme: 'patola', border: 'patola-dots', primaryColor: '#b91c1c', font: 'serif' }, // Patola/Bandhani/Toran style
    ta: { theme: 'jasmine', border: 'kolam', primaryColor: '#a16207', font: 'serif' }, // Kolam border, temple arch, jasmine/gold
    te: { theme: 'kalamkari', border: 'pochampally', primaryColor: '#9a3412', font: 'serif' }, // Kalamkari/Pochampally/paisley
    kn: { theme: 'mysore', border: 'kasuti', primaryColor: '#7c2d12', font: 'serif' }, // Mysore/Kasuti/Ilkal inspiration
    bn: { theme: 'alpana', border: 'alpana-red', primaryColor: '#be123c', font: 'serif' }, // Alpana red-white-gold
    pa: { theme: 'phulkari', border: 'phulkari-floral', primaryColor: '#15803d', font: 'serif' }, // Phulkari floral
    ur: { theme: 'mughal', border: 'mughal-arch', primaryColor: '#065f46', font: 'nastaliq' }, // RTL, geometric/floral, Mughal arch
    en: { theme: 'modern-slate', border: 'classic-double', primaryColor: '#1e293b', font: 'sans' } // Modern simple premium
  }

  for (const lang of languages) {
    const r = regionalStyles[lang.code] || regionalStyles.en;

    // 12 Templates per language (2 free + 10 paid)
    const languageTemplates = [
      // Free templates
      {
        slug: `${lang.code}-simple-clean-free`,
        name: `${lang.name} Simple Clean (Free)`,
        category: 'Simple Free',
        priceInPaise: 0,
        isFree: true,
        requiresPayment: false,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF'],
        previewModeConfig: { resolution: 'full', blur: false },
        styleConfig: { theme: 'light', font: r.font === 'nastaliq' ? 'nastaliq' : 'sans', border: 'none', primaryColor: '#1e293b', motif: 'none' },
      },
      {
        slug: `${lang.code}-simple-classic-free`,
        name: `${lang.name} Simple Classic (Free)`,
        category: 'Simple Free',
        priceInPaise: 0,
        isFree: true,
        requiresPayment: false,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF'],
        previewModeConfig: { resolution: 'full', blur: false },
        styleConfig: { theme: 'cream', font: 'serif', border: 'thin-gold', primaryColor: '#475569', motif: 'none' },
      },
      // Paid templates (₹10 - ₹30)
      {
        slug: `${lang.code}-modern-minimal-paid`,
        name: `${lang.name} Modern Minimal`,
        category: 'Classic',
        priceInPaise: 1000, // ₹10
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: 'pastel-blue', font: r.font === 'nastaliq' ? 'nastaliq' : 'sans', border: 'minimal-blue', primaryColor: '#2563eb', motif: 'none' },
      },
      {
        slug: `${lang.code}-classic-gold-paid`,
        name: `${lang.name} Classic Gold`,
        category: 'Classic',
        priceInPaise: 1000, // ₹10
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: 'gold', font: 'serif', border: 'gold-lace', primaryColor: '#854d0e', motif: 'lotus' },
      },
      {
        slug: `${lang.code}-elegant-floral-paid`,
        name: `${lang.name} Elegant Floral`,
        category: 'Elegant',
        priceInPaise: 1000, // ₹10
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: 'floral', font: 'serif', border: 'floral-vibe', primaryColor: '#db2777', motif: 'floral' },
      },
      {
        slug: `${lang.code}-traditional-border-paid`,
        name: `${lang.name} Traditional Border`,
        category: 'Traditional',
        priceInPaise: 2000, // ₹20
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: r.theme, font: 'serif', border: r.border, primaryColor: r.primaryColor, motif: 'traditional' },
      },
      {
        slug: `${lang.code}-royal-frame-paid`,
        name: `${lang.name} Royal Frame`,
        category: 'Royal',
        priceInPaise: 3000, // ₹30
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: 'royal', font: 'serif', border: 'royal-gold', primaryColor: r.primaryColor, motif: 'royal' },
      },
      {
        slug: `${lang.code}-no-photo-professional-paid`,
        name: `${lang.name} No-Photo Professional`,
        category: 'No-photo Premium',
        priceInPaise: 2000, // ₹20
        isFree: false,
        requiresPayment: true,
        supportsPhoto: false,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: 'professional', font: r.font === 'nastaliq' ? 'nastaliq' : 'sans', border: 'grey-lines', primaryColor: '#334155', motif: 'none' },
      },
      {
        slug: `${lang.code}-photo-premium-paid`,
        name: `${lang.name} Photo Premium`,
        category: 'Premium Photo',
        priceInPaise: 3000, // ₹30
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: false,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: 'luxury', font: 'serif', border: 'premium-double', primaryColor: '#b45309', motif: 'floral' },
      },
      {
        slug: `${lang.code}-regional-special-paid`,
        name: `${lang.name} Regional Special`,
        category: 'Regional',
        priceInPaise: 2000, // ₹20
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: r.theme, font: 'serif', border: r.border, primaryColor: r.primaryColor, motif: 'traditional' },
      },
      {
        slug: `${lang.code}-soft-pastel-paid`,
        name: `${lang.name} Soft Pastel`,
        category: 'Elegant',
        priceInPaise: 1000, // ₹10
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: 'pastel-green', font: r.font === 'nastaliq' ? 'nastaliq' : 'sans', border: 'pastel-dots', primaryColor: '#0d9488', motif: 'none' },
      },
      {
        slug: `${lang.code}-luxury-ornate-paid`,
        name: `${lang.name} Luxury Ornate`,
        category: 'Royal',
        priceInPaise: 3000, // ₹30
        isFree: false,
        requiresPayment: true,
        supportsPhoto: true,
        supportsNoPhoto: true,
        supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        previewModeConfig: { resolution: 'low', blur: true },
        styleConfig: { theme: 'luxury-red', font: 'serif', border: 'ornate-heavy', primaryColor: '#be123c', motif: 'royal' },
      }
    ]

    for (const t of languageTemplates) {
      templatesToCreate.push({
        ...t,
        languageCode: lang.code,
        labelModeSupport: ['en', 'native', 'both'],
        designPackId: lang.code,
        previewImage: `/templates/${t.slug}.jpg`,
        sortOrder: templatesToCreate.length,
      })
    }
  }

  // 13. Add Paid Custom Template
  templatesToCreate.push({
    slug: 'custom-template-paid',
    name: 'Custom Background Template',
    languageCode: 'all',
    labelModeSupport: ['en', 'native', 'both'],
    category: 'Custom Template',
    priceInPaise: 2000, // ₹20
    isFree: false,
    requiresPayment: true,
    supportsPhoto: true,
    supportsNoPhoto: true,
    supportedExports: ['IMAGE', 'PDF'],
    previewModeConfig: { resolution: 'low', blur: true },
    styleConfig: { theme: 'custom', font: 'sans', border: 'none', isCustomBackground: true, primaryColor: '#1e293b' },
    designPackId: 'custom',
    previewImage: '/templates/custom-template.jpg',
    sortOrder: templatesToCreate.length,
  })

  // Upsert all templates
  for (const t of templatesToCreate) {
    await prisma.template.create({
      data: t
    })
  }

  console.log(`Seeded ${templatesToCreate.length} templates (including variants for 10 languages).`)

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
