import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  const services = db.getServices();
  return NextResponse.json({ success: true, services });
}
