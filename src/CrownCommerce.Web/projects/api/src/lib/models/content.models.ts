export interface Testimonial {
  id: string;
  customerName: string;
  customerLocation: string | null;
  content: string;
  rating: number;
  imageUrl: string | null;
  createdAt: string;
}

export interface CreateTestimonialRequest {
  customerName: string;
  customerLocation?: string;
  content: string;
  rating: number;
  imageUrl?: string;
}

export interface UpdateTestimonialRequest {
  customerName: string;
  customerLocation?: string;
  content: string;
  rating: number;
  imageUrl?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface BrandStory {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  founder: BrandFounder;
  mission: BrandMission;
  values: BrandValue[];
  timeline: BrandTimelineEvent[];
  ctaTitle: string;
  ctaDescription: string;
}

export interface BrandFounder {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
}

export interface BrandMission {
  title: string;
  description: string;
}

export interface BrandValue {
  icon: string;
  title: string;
  description: string;
}

export interface BrandTimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface HairCareGuide {
  heroTitle: string;
  heroSubtitle: string;
  sections: HairCareSection[];
  ctaTitle: string;
  ctaDescription: string;
}

export interface HairCareSection {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  tips: HairCareTip[];
}

export interface HairCareTip {
  icon: string;
  title: string;
  description: string;
}

export interface ShippingPolicy {
  heroTitle: string;
  heroSubtitle: string;
  zones: ShippingZone[];
  processingTime: string;
  trackingInfo: string;
  processSteps: PolicyStep[];
}

export interface ShippingZone {
  name: string;
  deliveryTime: string;
  rate: string;
  freeShippingMinimum: number | null;
}

export interface PolicyStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

export interface ReturnsPolicy {
  heroTitle: string;
  heroSubtitle: string;
  eligibilityWindow: string;
  conditions: ReturnCondition[];
  processSteps: PolicyStep[];
  exchangeInfo: string;
}

export interface ReturnCondition {
  title: string;
  description: string;
  eligible: boolean;
}

export interface WholesaleTier {
  id: string;
  name: string;
  minimumOrder: number;
  discount: string;
  features: string[];
  highlighted: boolean;
}
