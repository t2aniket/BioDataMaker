import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const contact = searchParams.get('contact');

  if (!query || !contact) {
    return NextResponse.json({ error: 'Order reference and contact detail are required' }, { status: 400 });
  }

  const cleanQuery = query.trim();
  const cleanContact = contact.trim().toLowerCase();

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: cleanQuery },
          { razorpayPaymentId: cleanQuery },
        ],
        status: 'PAID',
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Paid order not found matching reference' }, { status: 404 });
    }

    // Verify contact matches customerEmail or customerPhone
    const emailMatch = order.customerEmail && order.customerEmail.toLowerCase().trim() === cleanContact;
    
    // Clean phone values to compare numbers only
    const cleanOrderPhone = order.customerPhone ? order.customerPhone.replace(/\D/g, '') : '';
    const cleanSearchContact = cleanContact.replace(/\D/g, '');
    const phoneMatch = cleanOrderPhone && cleanSearchContact && cleanOrderPhone.includes(cleanSearchContact);

    if (!emailMatch && !phoneMatch) {
      return NextResponse.json({ success: false, error: 'Contact details do not match this order.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Error searching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
