import fs from 'fs';
import path from 'path';
import {
  User,
  Address,
  Plan,
  ServiceItem,
  PlanServiceRule,
  Subscription,
  ServiceRequest,
  Provider,
  Review,
  Payment,
  Coupon,
  ClientQuotaStatus,
} from '../types/index';

interface StoreData {
  users: User[];
  addresses: Address[];
  plans: Plan[];
  services: ServiceItem[];
  planServices: PlanServiceRule[];
  subscriptions: Subscription[];
  requests: ServiceRequest[];
  providers: Provider[];
  reviews: Review[];
  payments: Payment[];
  coupons: Coupon[];
  config: {
    dispatchMode: 'NEAREST' | 'BROADCAST';
    cities: string[];
    neighborhoods: string[];
    supportPhone: string;
    supportWhatsApp: string;
  };
}

function getStorePath(): string {
  // On Vercel Serverless, filesystem is read-only except /tmp
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return path.join('/tmp', 'casa_mais_store.json');
  }
  return path.join(process.cwd(), 'data-store.json');
}

const initialPlans: Plan[] = [
  {
    id: 'plano-essencial',
    name: 'Plano Essencial',
    price: 29.9,
    billingCycle: 'MONTHLY',
    description: 'Proteção fundamental para imprevistos rotineiros do lar.',
    status: 'ACTIVE',
    features: [
      'Chaveiro 24h para emergências',
      'Eletricista para reparos e trocas',
      'Encanador para vazamentos e desentupimentos',
      'Pequenos reparos e instalações',
      'Descontos especiais em serviços extras',
    ],
  },
  {
    id: 'plano-familia',
    name: 'Plano Família',
    price: 49.9,
    billingCycle: 'MONTHLY',
    description: 'O mais escolhido: segurança total e manutenção preventiva para seu lar.',
    status: 'ACTIVE',
    popular: true,
    highlightBadge: 'MAIS CONTRATADO',
    features: [
      'Tudo incluso do Plano Essencial',
      '1 Dedetização anual completa',
      '1 Limpeza preventiva de caixa d’água anual',
      '1 Visita de inspeção preventiva anual',
      'Franquia de utilização ampliada',
      'Até 25% de desconto em serviços de grande porte',
    ],
  },
  {
    id: 'plano-premium',
    name: 'Plano Premium',
    price: 79.9,
    billingCycle: 'MONTHLY',
    description: 'Cuidado VIP com suporte a eletrodomésticos e máxima disponibilidade.',
    status: 'ACTIVE',
    highlightBadge: 'COMPLETO VIP',
    features: [
      'Tudo incluso do Plano Família',
      '2 Dedetizações anuais preventivas',
      '2 Visitas preventivas anuais completas',
      'Assistência técnica para eletrodomésticos (Lavadora, Geladeira, Fogão)',
      'Máxima prioridade na fila de despacho',
      'Descontos máximos em obras e reformas',
    ],
  },
];

const initialServices: ServiceItem[] = [
  {
    id: 'srv-encanador',
    name: 'Encanador',
    category: 'ENCANAMENTO',
    description: 'Reparo de vazamentos, torneiras, registros, sifões e desentupimentos residenciais.',
    estimatedHours: 2,
    requiresApproval: false,
    status: 'ACTIVE',
    iconKey: 'Droplets',
    color: '#0284c7', // Sky Blue
  },
  {
    id: 'srv-eletricista',
    name: 'Eletricista',
    category: 'ELETRICIDADE',
    description: 'Disjuntores, curtos-circuitos, tomadas, interruptores, chuveiros e iluminação.',
    estimatedHours: 2,
    requiresApproval: false,
    status: 'ACTIVE',
    iconKey: 'Zap',
    color: '#d97706', // Amber/Gold
  },
  {
    id: 'srv-chaveiro',
    name: 'Chaveiro',
    category: 'CHAVEIRO',
    description: 'Abertura de portas travadas, troca de segredo de fechaduras e cópia de chaves.',
    estimatedHours: 1,
    requiresApproval: false,
    status: 'ACTIVE',
    iconKey: 'Key',
    color: '#e11d48', // Rose/Red
  },
  {
    id: 'srv-reparos',
    name: 'Pequenos Reparos',
    category: 'PEQUENOS_REPAROS',
    description: 'Fixação de suportes, quadros, cortinas, maçanetas, dobradiças e prateleiras.',
    estimatedHours: 2,
    requiresApproval: false,
    status: 'ACTIVE',
    iconKey: 'Wrench',
    color: '#059669', // Emerald Green
  },
  {
    id: 'srv-dedetizacao',
    name: 'Dedetização',
    category: 'DEDETIZACAO',
    description: 'Controle de pragas urbanas (baratas, formigas, aranhas e escorpiões) com laudo.',
    estimatedHours: 3,
    requiresApproval: true,
    status: 'ACTIVE',
    iconKey: 'Bug',
    color: '#ea580c', // Orange
  },
  {
    id: 'srv-caixa-dagua',
    name: 'Limpeza de Caixa d’Água',
    category: 'CAIXA_DAGUA',
    description: 'Esgotamento, higienização, desinfecção e vedação de reservatório até 1.000L.',
    estimatedHours: 3,
    requiresApproval: true,
    status: 'ACTIVE',
    iconKey: 'ShieldCheck',
    color: '#0891b2', // Cyan
  },
  {
    id: 'srv-eletrodomesticos',
    name: 'Eletrodomésticos',
    category: 'ELETRODOMESTICOS',
    description: 'Diagnóstico e reparo mecânico de geladeira, máquina de lavar, secadora e micro-ondas.',
    estimatedHours: 3,
    requiresApproval: true,
    status: 'ACTIVE',
    iconKey: 'Cpu',
    color: '#6366f1', // Indigo
  },
];

const initialPlanRules: PlanServiceRule[] = [
  // Essencial
  { id: 'r1', planId: 'plano-essencial', serviceId: 'srv-encanador', usageLimit: 2, period: 'ANNUAL', maxValuePerCall: 150 },
  { id: 'r2', planId: 'plano-essencial', serviceId: 'srv-eletricista', usageLimit: 2, period: 'ANNUAL', maxValuePerCall: 150 },
  { id: 'r3', planId: 'plano-essencial', serviceId: 'srv-chaveiro', usageLimit: 2, period: 'ANNUAL', maxValuePerCall: 150 },
  { id: 'r4', planId: 'plano-essencial', serviceId: 'srv-reparos', usageLimit: 2, period: 'ANNUAL', maxValuePerCall: 150 },

  // Família
  { id: 'r5', planId: 'plano-familia', serviceId: 'srv-encanador', usageLimit: 4, period: 'ANNUAL', maxValuePerCall: 200 },
  { id: 'r6', planId: 'plano-familia', serviceId: 'srv-eletricista', usageLimit: 4, period: 'ANNUAL', maxValuePerCall: 200 },
  { id: 'r7', planId: 'plano-familia', serviceId: 'srv-chaveiro', usageLimit: 3, period: 'ANNUAL', maxValuePerCall: 200 },
  { id: 'r8', planId: 'plano-familia', serviceId: 'srv-reparos', usageLimit: 3, period: 'ANNUAL', maxValuePerCall: 200 },
  { id: 'r9', planId: 'plano-familia', serviceId: 'srv-dedetizacao', usageLimit: 1, period: 'ANNUAL', maxValuePerCall: 250 },
  { id: 'r10', planId: 'plano-familia', serviceId: 'srv-caixa-dagua', usageLimit: 1, period: 'ANNUAL', maxValuePerCall: 250 },

  // Premium
  { id: 'r11', planId: 'plano-premium', serviceId: 'srv-encanador', usageLimit: 6, period: 'ANNUAL', maxValuePerCall: 300 },
  { id: 'r12', planId: 'plano-premium', serviceId: 'srv-eletricista', usageLimit: 6, period: 'ANNUAL', maxValuePerCall: 300 },
  { id: 'r13', planId: 'plano-premium', serviceId: 'srv-chaveiro', usageLimit: 4, period: 'ANNUAL', maxValuePerCall: 250 },
  { id: 'r14', planId: 'plano-premium', serviceId: 'srv-reparos', usageLimit: 5, period: 'ANNUAL', maxValuePerCall: 250 },
  { id: 'r15', planId: 'plano-premium', serviceId: 'srv-dedetizacao', usageLimit: 2, period: 'ANNUAL', maxValuePerCall: 300 },
  { id: 'r16', planId: 'plano-premium', serviceId: 'srv-caixa-dagua', usageLimit: 2, period: 'ANNUAL', maxValuePerCall: 300 },
  { id: 'r17', planId: 'plano-premium', serviceId: 'srv-eletrodomesticos', usageLimit: 2, period: 'ANNUAL', maxValuePerCall: 350 },
];

const initialUsers: User[] = [
  {
    id: 'usr-admin',
    name: 'Iago Barreto (Diretoria AXION)',
    email: 'admin@casamais.com.br',
    phone: '(11) 98888-0000',
    cpf: '000.000.000-00',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'usr-cliente-joao',
    name: 'João da Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(63) 99234-5678',
    cpf: '123.456.789-00',
    role: 'CLIENT',
    status: 'ACTIVE',
    createdAt: '2026-08-10T14:30:00Z',
  },
  {
    id: 'usr-prov-carlos',
    name: 'Carlos Eduardo Ferreira',
    email: 'carlos.eletrica@casamais.com.br',
    phone: '(63) 98411-2233',
    cpf: '321.654.987-11',
    role: 'PROVIDER',
    status: 'ACTIVE',
    createdAt: '2026-08-05T09:00:00Z',
  },
  {
    id: 'usr-prov-marcos',
    name: 'Marcos Vinícius Encanador',
    email: 'marcos.hidro@casamais.com.br',
    phone: '(63) 98122-3344',
    cpf: '456.789.123-22',
    role: 'PROVIDER',
    status: 'ACTIVE',
    createdAt: '2026-08-05T09:30:00Z',
  },
  {
    id: 'usr-prov-roberto',
    name: 'Roberto Chaves Express',
    email: 'roberto.chaveiro@casamais.com.br',
    phone: '(63) 99133-4455',
    cpf: '789.123.456-33',
    role: 'PROVIDER',
    status: 'ACTIVE',
    createdAt: '2026-08-06T11:00:00Z',
  },
];

const initialAddresses: Address[] = [
  {
    id: 'addr-joao-1',
    userId: 'usr-cliente-joao',
    zipCode: '77060-000',
    street: 'Rua das Palmeiras',
    number: '425',
    complement: 'Casa 02',
    neighborhood: 'Jardim Aureny III',
    city: 'Palmas',
    state: 'TO',
  },
];

const initialSubscriptions: Subscription[] = [
  {
    id: 'sub-joao-1',
    userId: 'usr-cliente-joao',
    planId: 'plano-familia',
    planName: 'Plano Família',
    amount: 49.9,
    paymentMethod: 'CREDIT_CARD',
    status: 'ACTIVE',
    startedAt: '2026-08-10T14:35:00Z',
    nextBillingDate: '2026-10-10T14:35:00Z',
    gatewaySubscriptionId: 'sub_gway_789456123',
  },
];

const initialProviders: Provider[] = [
  {
    id: 'prov-carlos',
    userId: 'usr-prov-carlos',
    name: 'Carlos Eduardo Ferreira',
    phone: '(63) 98411-2233',
    email: 'carlos.eletrica@casamais.com.br',
    cpfCnpj: '321.654.987-11',
    category: 'Eletricista',
    categories: ['ELETRICIDADE', 'PEQUENOS_REPAROS'],
    city: 'Palmas',
    cities: ['Palmas', 'Taquaralto', 'Porto Nacional'],
    neighborhoods: ['Jardim Aureny III', 'Jardim Aureny I', 'Centro', 'Plano Diretor Sul'],
    ratingAverage: 4.9,
    completedCallsCount: 42,
    status: 'APPROVED',
    bankInfo: {
      pixKey: 'carlos.eletrica@casamais.com.br',
      bankName: 'Nubank (260)',
    },
  },
  {
    id: 'prov-marcos',
    userId: 'usr-prov-marcos',
    name: 'Marcos Vinícius Hidráulica',
    phone: '(63) 98122-3344',
    email: 'marcos.hidro@casamais.com.br',
    cpfCnpj: '456.789.123-22',
    category: 'Encanador',
    categories: ['ENCANAMENTO', 'CAIXA_DAGUA'],
    city: 'Palmas',
    cities: ['Palmas'],
    neighborhoods: ['Centro', 'Plano Diretor Norte', 'Plano Diretor Sul'],
    ratingAverage: 4.8,
    completedCallsCount: 38,
    status: 'APPROVED',
    bankInfo: {
      pixKey: '456.789.123-22',
      bankName: 'Banco Inter (077)',
    },
  },
  {
    id: 'prov-roberto',
    userId: 'usr-prov-roberto',
    name: 'Roberto Chaves Express',
    phone: '(63) 99133-4455',
    email: 'roberto.chaveiro@casamais.com.br',
    cpfCnpj: '789.123.456-33',
    category: 'Chaveiro',
    categories: ['CHAVEIRO'],
    city: 'Palmas',
    cities: ['Palmas'],
    neighborhoods: ['Plano Diretor Sul', 'Centro', 'Jardim Aureny III'],
    ratingAverage: 5.0,
    completedCallsCount: 65,
    status: 'APPROVED',
    bankInfo: {
      pixKey: '(63) 99133-4455',
      bankName: 'Caixa Econômica (104)',
    },
  },
];

const initialRequests: ServiceRequest[] = [
  {
    id: 'req-1048',
    protocolCode: '#1048',
    userId: 'usr-cliente-joao',
    clientName: 'João da Silva Santos',
    clientPhone: '(63) 99234-5678',
    serviceId: 'srv-eletricista',
    serviceName: 'Eletricista Residencial',
    category: 'ELETRICIDADE',
    addressId: 'addr-joao-1',
    addressSummary: 'Rua das Palmeiras, 425 - Jardim Aureny III, Palmas - TO',
    city: 'Palmas',
    neighborhood: 'Jardim Aureny III',
    description: 'Disjuntor principal desarmando repetidamente ao ligar o chuveiro elétrico no modo inverno.',
    mediaUrls: ['/logo.png'],
    status: 'DISPATCHED', // Prestador a caminho
    assignedProviderId: 'prov-carlos',
    assignedProviderName: 'Carlos Eduardo Ferreira',
    assignedProviderPhone: '(63) 98411-2233',
    assignedProviderRating: 4.9,
    scheduledFor: 'Hoje, até 15:30',
    createdAt: '2026-09-08T10:15:00Z',
    updatedAt: '2026-09-08T11:00:00Z',
  },
  {
    id: 'req-1042',
    protocolCode: '#1042',
    userId: 'usr-cliente-joao',
    clientName: 'João da Silva Santos',
    clientPhone: '(63) 99234-5678',
    serviceId: 'srv-chaveiro',
    serviceName: 'Abertura de Porta',
    category: 'CHAVEIRO',
    addressId: 'addr-joao-1',
    addressSummary: 'Rua das Palmeiras, 425 - Jardim Aureny III, Palmas - TO',
    city: 'Palmas',
    neighborhood: 'Jardim Aureny III',
    description: 'Chave quebrada dentro da fechadura da porta principal.',
    mediaUrls: [],
    status: 'COMPLETED',
    assignedProviderId: 'prov-roberto',
    assignedProviderName: 'Roberto Chaves Express',
    assignedProviderPhone: '(63) 99133-4455',
    assignedProviderRating: 5.0,
    completionDetails: {
      serviceSummary: 'Remoção do fragmento de chave e lubrificação da fechadura com grafite.',
      clientPresent: true,
      photosBefore: ['/logo.png'],
      photosAfter: ['/logo.png'],
      completedAt: '2026-08-22T16:30:00Z',
    },
    reviewSubmitted: true,
    createdAt: '2026-08-22T15:00:00Z',
    updatedAt: '2026-08-22T16:35:00Z',
    completedAt: '2026-08-22T16:30:00Z',
  },
];

const initialReviews: Review[] = [
  {
    id: 'rev-1',
    requestId: 'req-1042',
    userId: 'usr-cliente-joao',
    providerId: 'prov-roberto',
    ratingOverall: 5,
    ratingPunctuality: 5,
    ratingQuality: 5,
    ratingCourtesy: 5,
    comment: 'Atendimento impecável! Chegou em menos de 20 minutos e resolveu sem danificar a fechadura.',
    createdAt: '2026-08-22T16:40:00Z',
  },
];

const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    subscriptionId: 'sub-joao-1',
    userId: 'usr-cliente-joao',
    amount: 49.9,
    paymentMethod: 'Cartão de Crédito (Mastercard final 8821)',
    status: 'APPROVED',
    gatewayId: 'mp_pay_99887766',
    paidAt: '2026-08-10T14:35:00Z',
    createdAt: '2026-08-10T14:35:00Z',
  },
  {
    id: 'pay-2',
    subscriptionId: 'sub-joao-1',
    userId: 'usr-cliente-joao',
    amount: 49.9,
    paymentMethod: 'Cartão de Crédito (Mastercard final 8821)',
    status: 'APPROVED',
    gatewayId: 'mp_pay_99887767',
    paidAt: '2026-09-10T14:35:00Z',
    createdAt: '2026-09-10T14:35:00Z',
  },
];

const initialCoupons: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'CASA10',
    discountPercent: 10,
    validMonths: 3,
    active: true,
  },
  {
    id: 'cpn-2',
    code: 'BEMVINDO',
    discountPercent: 15,
    validMonths: 1,
    active: true,
  },
];

let inMemoryStore: StoreData | null = null;

function loadStore(): StoreData {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  const filePath = getStorePath();

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      inMemoryStore = JSON.parse(content);
      return inMemoryStore!;
    }
  } catch (err) {
    console.warn('[CASA+ Store] Fallback to preloaded data:', err);
  }

  inMemoryStore = {
    users: initialUsers,
    addresses: initialAddresses,
    plans: initialPlans,
    services: initialServices,
    planServices: initialPlanRules,
    subscriptions: initialSubscriptions,
    requests: initialRequests,
    providers: initialProviders,
    reviews: initialReviews,
    payments: initialPayments,
    coupons: initialCoupons,
    config: {
      dispatchMode: 'NEAREST',
      cities: ['Palmas', 'Porto Nacional', 'Araguaína', 'Gurupi', 'Paraíso do Tocantins'],
      neighborhoods: [
        'Jardim Aureny I',
        'Jardim Aureny II',
        'Jardim Aureny III',
        'Jardim Aureny IV',
        'Plano Diretor Sul',
        'Plano Diretor Norte',
        'Centro',
        'Taquaralto',
      ],
      supportPhone: '(63) 3215-0000',
      supportWhatsApp: '5563992345678',
    },
  };

  saveStore(inMemoryStore);
  return inMemoryStore;
}

function saveStore(data: StoreData): void {
  inMemoryStore = data;
  try {
    const filePath = getStorePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[CASA+ Store] Notice: Store state held in memory:', err);
  }
}

export const db = {
  // Config
  getConfig() {
    return loadStore().config;
  },
  updateConfig(newConfig: Partial<StoreData['config']>) {
    const store = loadStore();
    store.config = { ...store.config, ...newConfig };
    saveStore(store);
    return store.config;
  },

  // Users
  getUsers() {
    return loadStore().users;
  },
  getUserById(id: string) {
    return loadStore().users.find((u) => u.id === id);
  },
  getUserByEmail(email: string) {
    return loadStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser(userData: Omit<User, 'id' | 'createdAt'>) {
    const store = loadStore();
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },
  updateUser(id: string, updates: Partial<User>) {
    const store = loadStore();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx >= 0) {
      store.users[idx] = { ...store.users[idx], ...updates };
      saveStore(store);
      return store.users[idx];
    }
    return null;
  },

  // Addresses
  getAddressesByUserId(userId: string) {
    return loadStore().addresses.filter((a) => a.userId === userId);
  },
  createAddress(addr: Omit<Address, 'id'>) {
    const store = loadStore();
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    store.addresses.push(newAddr);
    saveStore(store);
    return newAddr;
  },

  // Plans
  getPlans() {
    return loadStore().plans;
  },
  getPlanById(id: string) {
    return loadStore().plans.find((p) => p.id === id);
  },
  updatePlan(id: string, updates: Partial<Plan>) {
    const store = loadStore();
    const idx = store.plans.findIndex((p) => p.id === id);
    if (idx >= 0) {
      store.plans[idx] = { ...store.plans[idx], ...updates };
      saveStore(store);
      return store.plans[idx];
    }
    return null;
  },
  createPlan(plan: Omit<Plan, 'id'>) {
    const store = loadStore();
    const newPlan: Plan = {
      ...plan,
      id: `plano-${Date.now()}`,
    };
    store.plans.push(newPlan);
    saveStore(store);
    return newPlan;
  },

  // Services
  getServices() {
    return loadStore().services;
  },
  getServiceById(id: string) {
    return loadStore().services.find((s) => s.id === id);
  },
  updateService(id: string, updates: Partial<ServiceItem>) {
    const store = loadStore();
    const idx = store.services.findIndex((s) => s.id === id);
    if (idx >= 0) {
      store.services[idx] = { ...store.services[idx], ...updates };
      saveStore(store);
      return store.services[idx];
    }
    return null;
  },

  // Plan Service Rules
  getPlanRules(planId?: string) {
    const store = loadStore();
    if (planId) {
      return store.planServices.filter((r) => r.planId === planId);
    }
    return store.planServices;
  },
  updatePlanRule(id: string, updates: Partial<PlanServiceRule>) {
    const store = loadStore();
    const idx = store.planServices.findIndex((r) => r.id === id);
    if (idx >= 0) {
      store.planServices[idx] = { ...store.planServices[idx], ...updates };
      saveStore(store);
      return store.planServices[idx];
    }
    return null;
  },

  // Subscriptions
  getSubscriptions() {
    return loadStore().subscriptions;
  },
  getActiveSubscriptionByUserId(userId: string) {
    return loadStore().subscriptions.find((s) => s.userId === userId && s.status === 'ACTIVE');
  },
  createSubscription(sub: Omit<Subscription, 'id' | 'startedAt'>) {
    const store = loadStore();
    const newSub: Subscription = {
      ...sub,
      id: `sub-${Date.now()}`,
      startedAt: new Date().toISOString(),
    };
    store.subscriptions.push(newSub);
    saveStore(store);
    return newSub;
  },
  cancelSubscription(id: string) {
    const store = loadStore();
    const sub = store.subscriptions.find((s) => s.id === id);
    if (sub) {
      sub.status = 'CANCELED';
      saveStore(store);
      return sub;
    }
    return null;
  },

  // Service Requests
  getRequests() {
    return loadStore().requests;
  },
  getRequestsByUserId(userId: string) {
    return loadStore().requests.filter((r) => r.userId === userId);
  },
  getRequestsByProviderId(providerId: string) {
    return loadStore().requests.filter((r) => r.assignedProviderId === providerId);
  },
  getRequestById(id: string) {
    return loadStore().requests.find((r) => r.id === id || r.protocolCode === id);
  },
  createRequest(reqData: Omit<ServiceRequest, 'id' | 'protocolCode' | 'createdAt' | 'updatedAt'>) {
    const store = loadStore();
    const protocolNum = 1000 + store.requests.length + 1;
    const newReq: ServiceRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      protocolCode: `#${protocolNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.requests.unshift(newReq);
    saveStore(store);
    return newReq;
  },
  updateRequest(id: string, updates: Partial<ServiceRequest>) {
    const store = loadStore();
    const idx = store.requests.findIndex((r) => r.id === id || r.protocolCode === id);
    if (idx >= 0) {
      store.requests[idx] = {
        ...store.requests[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveStore(store);
      return store.requests[idx];
    }
    return null;
  },

  // Providers
  getProviders() {
    return loadStore().providers;
  },
  getProviderById(id: string) {
    return loadStore().providers.find((p) => p.id === id);
  },
  getProviderByUserId(userId: string) {
    return loadStore().providers.find((p) => p.userId === userId);
  },
  updateProvider(id: string, updates: Partial<Provider>) {
    const store = loadStore();
    const idx = store.providers.findIndex((p) => p.id === id);
    if (idx >= 0) {
      store.providers[idx] = { ...store.providers[idx], ...updates };
      saveStore(store);
      return store.providers[idx];
    }
    return null;
  },

  // Reviews
  getReviews() {
    return loadStore().reviews;
  },
  createReview(rev: Omit<Review, 'id' | 'createdAt'>) {
    const store = loadStore();
    const newRev: Review = {
      ...rev,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.reviews.push(newRev);

    // Update request state
    const req = store.requests.find((r) => r.id === rev.requestId);
    if (req) {
      req.reviewSubmitted = true;
    }

    // Recalculate provider average
    const providerReviews = store.reviews.filter((r) => r.providerId === rev.providerId);
    const avg = providerReviews.reduce((acc, r) => acc + r.ratingOverall, 0) / providerReviews.length;
    const prov = store.providers.find((p) => p.id === rev.providerId);
    if (prov) {
      prov.ratingAverage = Number(avg.toFixed(1));
    }

    saveStore(store);
    return newRev;
  },

  // Payments
  getPayments() {
    return loadStore().payments;
  },
  createPayment(pay: Omit<Payment, 'id' | 'createdAt'>) {
    const store = loadStore();
    const newPayment: Payment = {
      ...pay,
      id: `pay-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    store.payments.push(newPayment);
    saveStore(store);
    return newPayment;
  },

  // Coupons
  getCoupons() {
    return loadStore().coupons;
  },
  getCouponByCode(code: string) {
    return loadStore().coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
  },

  // Quota calculation (Requirement #20)
  getClientQuotaStatus(userId: string): ClientQuotaStatus[] {
    const store = loadStore();
    const activeSub = store.subscriptions.find((s) => s.userId === userId && s.status === 'ACTIVE');

    if (!activeSub) {
      return store.services.map((srv) => ({
        serviceId: srv.id,
        serviceName: srv.name,
        category: srv.category,
        iconKey: srv.iconKey,
        color: srv.color,
        limit: 0,
        used: 0,
        available: 0,
        period: 'ANNUAL',
        includedInPlan: false,
      }));
    }

    const rules = store.planServices.filter((r) => r.planId === activeSub.planId);
    const userCalls = store.requests.filter((r) => r.userId === userId && r.status !== 'CANCELED');

    return store.services.map((srv) => {
      const rule = rules.find((r) => r.serviceId === srv.id);
      if (!rule) {
        return {
          serviceId: srv.id,
          serviceName: srv.name,
          category: srv.category,
          iconKey: srv.iconKey,
          color: srv.color,
          limit: 0,
          used: 0,
          available: 0,
          period: 'ANNUAL',
          includedInPlan: false,
        };
      }

      const usedCount = userCalls.filter((c) => c.serviceId === srv.id).length;
      const available = Math.max(0, rule.usageLimit - usedCount);

      return {
        serviceId: srv.id,
        serviceName: srv.name,
        category: srv.category,
        iconKey: srv.iconKey,
        color: srv.color,
        limit: rule.usageLimit,
        used: usedCount,
        available,
        period: rule.period,
        includedInPlan: true,
      };
    });
  },
};
