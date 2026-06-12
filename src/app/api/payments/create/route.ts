import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, draftToken, customerEmail, customerPhone } = body;

    if (!templateId || !draftToken) {
      return NextResponse.json({ error: 'Template ID and Draft Token are required' }, { status: 400 });
    }

    if (!customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'Email and Phone are required' }, { status: 400 });
    }

    if (!customerEmail.includes('@') || !customerEmail.includes('.')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 12) {
      return NextResponse.json({ error: 'Please enter a valid Indian mobile number' }, { status: 400 });
    }

    // 1. Fetch template from database to get the correct price
    const template = await prisma.template.findFirst({
      where: {
        OR: [
          { slug: templateId },
          { id: templateId }
        ]
      },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (template.isFree || template.priceInPaise === 0) {
      return NextResponse.json({ error: 'This template is free and does not require payment' }, { status: 400 });
    }

    // 2. Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Create Razorpay order on backend
    const razorpayOrder = await razorpay.orders.create({
      amount: template.priceInPaise,
      currency: 'INR',
      receipt: orderNumber,
    });

    // 4. Save Order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        draftToken,
        templateSlug: template.slug,
        amountInPaise: template.priceInPaise,
        currency: 'INR',
        status: 'CREATED',
        razorpayOrderId: razorpayOrder.id,
        customerEmail: customerEmail || null,
        customerPhone: customerPhone || null,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      keyId: process.env.RAZORPAY_KEY_ID || '',
    });
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
