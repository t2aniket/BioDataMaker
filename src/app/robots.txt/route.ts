export async function GET() {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://freebiodatamaker.com';
  
  const content = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /download/
Disallow: /create?draft=

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
