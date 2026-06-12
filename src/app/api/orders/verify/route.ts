import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPaymentSchema } from '@/lib/validations'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentSchema.parse(body)

    // Find the order
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || ''
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      // Signature mismatch
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' }
      })
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Payment successful
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date()
      }
    })

    return NextResponse.json({ success: true, orderId: order.id })

  } catch (error: any) {
    console.error('Error verifying payment:', error)
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
