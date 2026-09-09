import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  const subscriptions = db.getSubscriptions();
  return NextResponse.json({ success: true, subscriptions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, planName, amount, paymentMethod, user, address, coupon } = body;

    // 1. Find or create user
    let existingUser = db.getUserByEmail(user.email);
    if (!existingUser) {
      existingUser = db.createUser({
        name: user.name,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
        role: 'CLIENT',
        status: 'ACTIVE',
      });
    }

    // 2. Create address
    const newAddress = db.createAddress({
      userId: existingUser.id,
      zipCode: address.zipCode,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    });

    // 3. Create Subscription
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const subscription = db.createSubscription({
      userId: existingUser.id,
      planId,
      planName,
      amount,
      paymentMethod,
      status: 'ACTIVE',
      nextBillingDate: nextMonth.toISOString(),
      gatewaySubscriptionId: `gway_sub_${Date.now()}`,
    });

    // 4. Create initial payment record
    const payment = db.createPayment({
      subscriptionId: subscription.id,
      userId: existingUser.id,
      amount,
      paymentMethod: paymentMethod === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'PIX Recorrente',
      status: 'APPROVED',
      paidAt: new Date().toISOString(),
      gatewayId: `mp_pay_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      subscription,
      payment,
      user: existingUser,
      address: newAddress,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Falha ao processar assinatura' }, { status: 400 });
  }
}
