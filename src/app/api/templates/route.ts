import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionEmail } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { priceInPaise: 'asc' },
    });

    const serialized = templates.map((t: any) => ({
      ...t,
      languageSupport: Array.isArray(t.languageSupport) ? t.languageSupport : JSON.parse(t.languageSupport as string),
      styleConfig: typeof t.styleConfig === 'string' ? JSON.parse(t.styleConfig) : t.styleConfig,
      supportedExports: Array.isArray(t.supportedExports) ? t.supportedExports : JSON.parse(t.supportedExports as string),
    }));

    return NextResponse.json(serialized);
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, name, category, languageSupport, priceInPaise, isFree, isActive, previewImage, styleConfig, supportedExports } = body;

    if (!slug || !name || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        slug,
        name,
        category,
        languageSupport: languageSupport || [],
        priceInPaise: Number(priceInPaise) || 0,
        isFree: !!isFree,
        isActive: isActive !== false,
        previewImage: previewImage || '/templates/simple-clean.jpg',
        styleConfig: styleConfig || {},
        supportedExports: supportedExports || ['IMAGE', 'PDF'],
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, category, languageSupport, priceInPaise, isFree, isActive, styleConfig, supportedExports } = body;

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const template = await prisma.template.update({
      where: { id },
      data: {
        name,
        category,
        languageSupport,
        priceInPaise: priceInPaise !== undefined ? Number(priceInPaise) : undefined,
        isFree,
        isActive,
        styleConfig,
        supportedExports,
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
