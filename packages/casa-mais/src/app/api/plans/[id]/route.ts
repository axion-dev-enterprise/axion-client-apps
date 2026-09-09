import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = db.updatePlan(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Plano não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true, plan: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Falha ao atualizar plano' }, { status: 400 });
  }
}
