import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const request = db.getRequestById(id);

  if (!request) {
    return NextResponse.json({ success: false, error: 'Chamado não encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true, request });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = db.updateRequest(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Chamado não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Falha ao atualizar chamado' }, { status: 400 });
  }
}
