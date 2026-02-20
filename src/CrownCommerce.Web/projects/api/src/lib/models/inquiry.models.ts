export interface CreateInquiryRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productId?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  productId: string | null;
  createdAt: string;
}

export interface CreateWholesaleInquiryRequest {
  businessName: string;
  contactEmail: string;
  phone: string;
  monthlyVolume: string;
  message: string;
}

export interface WholesaleInquiry {
  id: string;
  businessName: string;
  contactEmail: string;
  phone: string;
  monthlyVolume: string;
  message: string;
  status: 'pending' | 'reviewed' | 'approved' | 'declined';
  createdAt: string;
}

export type ContactSubject = 'general' | 'order-issue' | 'product-inquiry' | 'returns' | 'wholesale' | 'other';

export interface CreateContactRequest {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  createdAt: string;
}
