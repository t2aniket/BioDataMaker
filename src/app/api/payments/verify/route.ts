import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'All Razorpay details are required' }, { status: 400 });
    }

    // 1. Verify Razorpay cryptographic signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    const isSignatureValid = generated_signature === razorpay_signature;

    if (!isSignatureValid) {
      // Mark matching order as FAILED
      await prisma.order.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Mark matching order as PAID
    const updatedOrder = await prisma.order.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: 'PAID',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
    });

    // 3. Track paid orders count in SiteCounter
    try {
      await prisma.siteCounter.upsert({
        where: { key: 'total_paid_orders' },
        update: { value: { increment: 1 } },
        create: { key: 'total_paid_orders', value: 1 },
      });
    } catch (counterErr) {
      console.error('Error incrementing counter:', counterErr);
    }

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
