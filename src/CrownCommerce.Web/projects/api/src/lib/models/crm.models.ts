export type ContactStatus = 'Active' | 'Inactive' | 'Archived' | 'Blocked';
export type CustomerTier = 'Standard' | 'VIP' | 'Elite';
export type CrmBrand = 'OriginHairCollective' | 'ManeHaus';
export type LeadSource = 'Website' | 'Referral' | 'TradeShow' | 'ColdOutreach' | 'SocialMedia' | 'Other';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Negotiating' | 'Won' | 'Lost';

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: ContactStatus;
  tier: CustomerTier;
  brand: CrmBrand | null;
  totalOrders: number;
  totalSpent: number;
  firstPurchaseDate: string | null;
  lastPurchaseDate: string | null;
  createdAt: string;
  tags: string[];
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string | null;
  phone: string | null;
  source: LeadSource;
  leadStatus: LeadStatus;
  estimatedAnnualRevenue: number;
  industry: string | null;
  createdAt: string;
  qualifiedDate: string | null;
  tags: string[];
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  brand?: CrmBrand;
  preferredContactMethod?: string;
  marketingOptIn?: boolean;
}

export interface CreateLeadRequest {
  name: string;
  company: string;
  email?: string;
  phone?: string;
  address?: string;
  jobTitle?: string;
  source: LeadSource;
  estimatedAnnualRevenue: number;
  industry?: string;
  notes?: string;
}
