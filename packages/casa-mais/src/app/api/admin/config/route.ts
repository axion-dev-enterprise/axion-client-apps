import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  const config = db.getConfig();
  return NextResponse.json({ success: true, config });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = db.updateConfig(body);
    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Falha ao salvar configurações' }, { status: 400 });
  }
}
