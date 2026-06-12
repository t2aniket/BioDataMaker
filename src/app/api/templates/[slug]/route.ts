import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const template = await prisma.template.findUnique({
      where: { slug },
    });

    if (!template || !template.isActive) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const serialized = {
      ...template,
      languageSupport: template.languageCode === 'all' ? ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'bn', 'pa', 'ur'] : [template.languageCode],
      styleConfig: typeof template.styleConfig === 'string' ? JSON.parse(template.styleConfig) : template.styleConfig,
      supportedExports: Array.isArray(template.supportedExports) ? template.supportedExports : JSON.parse(template.supportedExports as string),
    };

    return NextResponse.json(serialized);
  } catch (error: any) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
