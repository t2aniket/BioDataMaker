import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionEmail } from '@/lib/session';

export async function GET(request: Request) {
  // Authorize
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  try {
    let orders;
    if (query) {
      orders = await prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: query, mode: 'insensitive' } },
            { razorpayPaymentId: { contains: query, mode: 'insensitive' } },
            { razorpayOrderId: { contains: query, mode: 'insensitive' } },
            { customerEmail: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { template: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      orders = await prisma.order.findMany({
        include: { template: true },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to 100 for performance
      });
    }

    // Serialize JSON fields in template
    const serializedOrders = orders.map((o: any) => ({
      ...o,
      template: {
        ...o.template,
        languageSupport: Array.isArray(o.template.languageSupport) ? o.template.languageSupport : JSON.parse(o.template.languageSupport as string),
        styleConfig: typeof o.template.styleConfig === 'string' ? JSON.parse(o.template.styleConfig) : o.template.styleConfig,
        supportedExports: Array.isArray(o.template.supportedExports) ? o.template.supportedExports : JSON.parse(o.template.supportedExports as string),
      },
    }));

    return NextResponse.json(serializedOrders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // Authorize
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const validStatuses = ['CREATED', 'PAID', 'FAILED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
