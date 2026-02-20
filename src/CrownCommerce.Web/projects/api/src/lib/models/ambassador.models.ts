export interface AmbassadorPerk {
  icon: string;
  title: string;
  description: string;
}

export interface AmbassadorStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

export interface AmbassadorProgram {
  heroTitle: string;
  heroSubtitle: string;
  perks: AmbassadorPerk[];
  howItWorks: AmbassadorStep[];
  ctaTitle: string;
  ctaDescription: string;
}

export interface CreateAmbassadorApplicationRequest {
  fullName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  tiktokHandle?: string;
  followerCount: string;
  whyJoin: string;
}

export type AmbassadorApplicationStatus = 'pending' | 'under-review' | 'approved' | 'declined';

export interface AmbassadorApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  tiktokHandle: string | null;
  followerCount: string;
  whyJoin: string;
  status: AmbassadorApplicationStatus;
  createdAt: string;
}
