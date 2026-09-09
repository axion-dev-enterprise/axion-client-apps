import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { providerId, serviceSummary, clientPresent, photosBefore, photosAfter } = body;

    const request = db.getRequestById(id);
    if (!request) {
      return NextResponse.json({ success: false, error: 'Chamado não encontrado' }, { status: 404 });
    }

    const completedAt = new Date().toISOString();

    const updated = db.updateRequest(id, {
      status: 'COMPLETED',
      completedAt,
      completionDetails: {
        serviceSummary: serviceSummary || 'Serviço residencial concluído com sucesso.',
        clientPresent: clientPresent ?? true,
        photosBefore: photosBefore || [],
        photosAfter: photosAfter || [],
        completedAt,
      },
    });

    // Increment completed calls count for provider
    if (providerId) {
      const provider = db.getProviderById(providerId);
      if (provider) {
        db.updateProvider(providerId, {
          completedCallsCount: provider.completedCallsCount + 1,
        });
      }
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Falha ao finalizar atendimento' }, { status: 400 });
  }
}
