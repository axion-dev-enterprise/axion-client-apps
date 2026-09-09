import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  const users = db.getUsers();
  return NextResponse.json({ success: true, users });
}
