import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { draftToken, templateId, orderId, exportType } = body;

    if (!draftToken || !templateId || !exportType) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await prisma.download.create({
      data: {
        orderId: orderId || null,
        draftToken,
        templateSlug: templateId,
        exportType,
        downloadCount: 1,
      },
    });

    // 2. Increment global downloads counter in SiteCounter
    try {
      await prisma.siteCounter.upsert({
        where: { key: 'total_downloads' },
        update: { value: { increment: 1 } },
        create: { key: 'total_downloads', value: 1 },
      });
    } catch (counterErr) {
      console.error('Error incrementing counter:', counterErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
