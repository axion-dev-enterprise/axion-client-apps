export type UserRole = 'CLIENT' | 'PROVIDER' | 'ADMIN' | 'OPERATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'MONTHLY';
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  popular?: boolean;
  highlightBadge?: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'ENCANAMENTO' | 'ELETRICIDADE' | 'CHAVEIRO' | 'PEQUENOS_REPAROS' | 'DEDETIZACAO' | 'CAIXA_DAGUA' | 'ELETRODOMESTICOS' | 'OUTROS';
  description: string;
  estimatedHours: number;
  requiresApproval: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  iconKey: string;
  color: string;
}

export interface PlanServiceRule {
  id: string;
  planId: string;
  serviceId: string;
  usageLimit: number; // e.g. 1, 2, or 999 for unlimited
  period: 'MONTHLY' | 'ANNUAL';
  maxValuePerCall: number;
}

export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'OVERDUE' | 'CANCELED';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'PIX_RECURRENT';
  status: SubscriptionStatus;
  startedAt: string;
  nextBillingDate: string;
  gatewaySubscriptionId?: string;
}

export type RequestStatus =
  | 'OPEN'
  | 'IN_REVIEW'
  | 'PROVIDER_LOCATED'
  | 'PENDING_ACCEPT'
  | 'DISPATCHED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELED';

export interface ServiceRequest {
  id: string;
  protocolCode: string; // e.g. #1048
  userId: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  category: string;
  addressId: string;
  addressSummary: string;
  city: string;
  neighborhood: string;
  description: string;
  mediaUrls: string[];
  status: RequestStatus;
  assignedProviderId?: string;
  assignedProviderName?: string;
  assignedProviderPhone?: string;
  assignedProviderRating?: number;
  scheduledFor?: string;
  completionDetails?: {
    serviceSummary: string;
    clientPresent: boolean;
    photosBefore: string[];
    photosAfter: string[];
    completedAt: string;
  };
  reviewSubmitted?: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  cpfCnpj: string;
  category: string;
  categories: string[];
  city: string;
  cities: string[];
  neighborhoods: string[];
  ratingAverage: number;
  completedCallsCount: number;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  bankInfo?: {
    pixKey: string;
    bankName: string;
  };
}

export interface Review {
  id: string;
  requestId: string;
  userId: string;
  providerId: string;
  ratingOverall: number;
  ratingPunctuality: number;
  ratingQuality: number;
  ratingCourtesy: number;
  comment: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'REFUNDED';
  gatewayId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  validMonths: number;
  active: boolean;
}

export interface ClientQuotaStatus {
  serviceId: string;
  serviceName: string;
  category: string;
  iconKey: string;
  color: string;
  limit: number;
  used: number;
  available: number;
  period: 'MONTHLY' | 'ANNUAL';
  includedInPlan: boolean;
}
