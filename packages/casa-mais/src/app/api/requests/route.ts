import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const providerId = searchParams.get('providerId');

  if (userId) {
    const requests = db.getRequestsByUserId(userId);
    return NextResponse.json({ success: true, requests });
  }

  if (providerId) {
    const requests = db.getRequestsByProviderId(providerId);
    return NextResponse.json({ success: true, requests });
  }

  const requests = db.getRequests();
  return NextResponse.json({ success: true, requests });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, clientName, clientPhone, category, serviceName, description, mediaUrls, address } = body;

    // 1. Quota Verification (Requirement #20)
    const quotas = db.getClientQuotaStatus(userId);
    const serviceQuota = quotas.find(
      (q) => q.category.toUpperCase() === category.toUpperCase() || q.serviceName.toLowerCase() === serviceName.toLowerCase()
    );

    if (serviceQuota && serviceQuota.includedInPlan && serviceQuota.available <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Limite de utilização anual atingido para ${serviceName}. Você já utilizou suas ${serviceQuota.limit} franquias inclusas. Solicite um upgrade de plano ou contrate o serviço avulso com desconto.`,
        },
        { status: 403 }
      );
    }

    // 2. Resolve Service Id
    const services = db.getServices();
    const serviceItem = services.find((s) => s.category.toUpperCase() === category.toUpperCase()) || services[0];

    // 3. Address summary
    const addressSummary = `${address.street}, ${address.number}${address.complement ? ` (${address.complement})` : ''} - ${address.neighborhood}, ${address.city}`;

    // 4. Create service request
    const newRequest = db.createRequest({
      userId: userId || 'usr-cliente-joao',
      clientName: clientName || 'João da Silva Santos',
      clientPhone: clientPhone || '(63) 99234-5678',
      serviceId: serviceItem.id,
      serviceName: serviceItem.name,
      category: serviceItem.category,
      addressId: 'addr-default',
      addressSummary,
      city: address.city || 'Palmas',
      neighborhood: address.neighborhood || 'Jardim Aureny III',
      description,
      mediaUrls: mediaUrls || [],
      status: 'OPEN',
    });

    // 5. Automatic dispatch simulation if NEAREST is active (Section 12)
    const config = db.getConfig();
    if (config.dispatchMode === 'NEAREST') {
      const providers = db.getProviders();
      const matchingProvider = providers.find((p) => p.categories.includes(category));
      if (matchingProvider) {
        db.updateRequest(newRequest.id, {
          status: 'PROVIDER_LOCATED',
          assignedProviderId: matchingProvider.id,
          assignedProviderName: matchingProvider.name,
          assignedProviderPhone: matchingProvider.phone,
          assignedProviderRating: matchingProvider.ratingAverage,
        });
      }
    }

    const updated = db.getRequestById(newRequest.id);
    return NextResponse.json({ success: true, request: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Falha ao registrar chamado' }, { status: 400 });
  }
}
