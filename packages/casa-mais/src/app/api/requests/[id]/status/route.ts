import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, providerId, providerName, providerPhone } = body;

    const updates: Record<string, any> = { status };
    if (providerId) updates.assignedProviderId = providerId;
    if (providerName) updates.assignedProviderName = providerName;
    if (providerPhone) updates.assignedProviderPhone = providerPhone;

    const updated = db.updateRequest(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Chamado não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Falha ao atualizar status' }, { status: 400 });
  }
}
