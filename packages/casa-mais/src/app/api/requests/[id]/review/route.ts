import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { providerId, userId, ratingOverall, ratingPunctuality, ratingQuality, ratingCourtesy, comment } = body;

    const review = db.createReview({
      requestId: id,
      userId: userId || 'usr-cliente-joao',
      providerId: providerId || 'prov-carlos',
      ratingOverall: Number(ratingOverall) || 5,
      ratingPunctuality: Number(ratingPunctuality) || 5,
      ratingQuality: Number(ratingQuality) || 5,
      ratingCourtesy: Number(ratingCourtesy) || 5,
      comment: comment || '',
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Falha ao salvar avaliação' }, { status: 400 });
  }
}
