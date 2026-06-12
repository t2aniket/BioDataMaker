import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionEmail } from '@/lib/session';

export async function GET() {
  // 1. Authorize
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Query basic counts
    const totalDrafts = await prisma.userDraft.count();
    const totalOrders = await prisma.order.count();
    const paidOrders = await prisma.order.count({ where: { status: 'PAID' } });
    const failedOrders = await prisma.order.count({ where: { status: 'FAILED' } });
    const totalDownloads = await prisma.download.count();

    // 3. Revenue sum (INR)
    const revenueSum = await prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { amountInPaise: true },
    });
    const totalRevenue = (revenueSum._sum.amountInPaise || 0) / 100;

    // 4. Popular templates
    const popularTemplatesRaw = await prisma.order.groupBy({
      by: ['templateSlug'],
      where: { status: 'PAID' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    // Fetch template names
    const popularTemplates = await Promise.all(
      popularTemplatesRaw.map(async (item: any) => {
        const template = await prisma.template.findUnique({
          where: { slug: item.templateSlug },
        });
        return {
          id: item.templateSlug,
          name: template?.name || 'Unknown',
          slug: template?.slug || '',
          count: item._count.id,
        };
      })
    );

    // 5. Popular languages
    const popularLanguages = await prisma.userDraft.groupBy({
      by: ['selectedLanguage'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    // 6. Global Site Counters
    const counters = await prisma.siteCounter.findMany();
    const countersMap = counters.reduce((acc: any, c: any) => {
      acc[c.key] = c.value;
      return acc;
    }, {});

    return NextResponse.json({
      totalDrafts,
      totalOrders,
      paidOrders,
      failedOrders,
      totalDownloads,
      totalRevenue,
      popularTemplates,
      popularLanguages: popularLanguages.map((l: any) => ({
        code: l.selectedLanguage,
        count: l._count.id,
      })),
      counters: {
        total_biodatas_generated: countersMap.total_biodatas_generated || 0,
        total_downloads: countersMap.total_downloads || 0,
        total_paid_orders: countersMap.total_paid_orders || 0,
      },
    });
  } catch (error: any) {
    console.error('Error loading admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
