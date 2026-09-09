import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  try {
    const plansCount = db.getPlans().length;
    const servicesCount = db.getServices().length;
    const requestsCount = db.getRequests().length;

    return NextResponse.json({
      status: 'healthy',
      service: 'casa-mais',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      stats: {
        plans: plansCount,
        services: servicesCount,
        activeRequests: requestsCount,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        type: 'https://axionenterprise.cloud/errors/internal-server-error',
        title: 'Internal Server Error',
        status: 500,
        detail: 'Health check failed to query database state.',
      },
      { status: 500, headers: { 'Content-Type': 'application/problem+json' } }
    );
  }
}
