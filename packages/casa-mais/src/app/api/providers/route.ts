import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  const providers = db.getProviders();
  return NextResponse.json({ success: true, providers });
}
