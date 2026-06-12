import { NextResponse } from 'next/server';

export async function GET() {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://freebiodatamaker.com';
  
  const pages = [
    '',
    '/languages',
    '/templates',
    '/pricing',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
    '/redownload',
    // Language SEO Pages
    '/marathi-biodata-maker',
    '/hindi-biodata-maker',
    '/english-biodata-maker',
    '/gujarati-biodata-maker',
    '/tamil-biodata-maker',
    '/telugu-biodata-maker',
    '/kannada-biodata-maker',
    '/bengali-biodata-maker',
    '/punjabi-biodata-maker',
    '/urdu-biodata-maker',
    // Format SEO Pages
    '/marriage-biodata-format-for-boy',
    '/marriage-biodata-format-for-girl',
    '/hindu-marriage-biodata-format',
    '/muslim-marriage-biodata-format',
    '/sikh-marriage-biodata-format',
    '/christian-marriage-biodata-format',
    '/biodata-format-with-photo',
    '/biodata-format-without-photo',
    '/editable-marriage-biodata-word-format',
    '/marriage-biodata-pdf-download',
    '/royal-marriage-biodata-template',
    '/simple-marriage-biodata-template'
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
    <url>
      <loc>${BASE_URL}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
      `;
    })
    .join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
