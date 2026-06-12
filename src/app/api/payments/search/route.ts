import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: query },
          { razorpayPaymentId: query },
        ],
        status: 'PAID',
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Paid order not found matching reference' }, { status: 404 });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Error searching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
