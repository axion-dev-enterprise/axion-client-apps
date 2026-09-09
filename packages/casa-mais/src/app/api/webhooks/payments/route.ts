import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function POST(req: Request) {
  try {
    const event = await req.json();
    console.log('[CASA+ Webhook] Received payment event:', event.type || event.action);

    const eventType = event.type || event.action || 'payment.approved';
    const data = event.data || event;

    if (eventType.includes('approved') || eventType.includes('paid')) {
      const subId = data.subscriptionId || data.subscription_id;
      if (subId) {
        db.createPayment({
          subscriptionId: subId,
          userId: data.userId || 'usr-cliente-joao',
          amount: data.amount || 49.9,
          paymentMethod: data.paymentMethod || 'Cartão de Crédito',
          status: 'APPROVED',
          paidAt: new Date().toISOString(),
          gatewayId: data.id || `gway_${Date.now()}`,
        });
      }
    } else if (eventType.includes('canceled') || eventType.includes('cancelled')) {
      const subId = data.subscriptionId || data.subscription_id;
      if (subId) {
        db.cancelSubscription(subId);
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err) {
    console.error('[CASA+ Webhook] Error processing event:', err);
    return NextResponse.json({ success: false, error: 'Webhook processing error' }, { status: 400 });
  }
}
