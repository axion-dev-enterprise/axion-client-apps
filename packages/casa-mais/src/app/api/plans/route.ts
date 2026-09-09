import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  const plans = db.getPlans();
  return NextResponse.json({ success: true, plans });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPlan = db.createPlan(body);
    return NextResponse.json({ success: true, plan: newPlan });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Falha ao criar plano' }, { status: 400 });
  }
}
