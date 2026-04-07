import { headers } from "next/headers";

export type Brand = "origin" | "mane-haus";

export interface BrandConfig {
  id: Brand;
  name: string;
  tagline: string;
  domain: string;
  aesthetic: string;
}

export const BRANDS: Record<Brand, BrandConfig> = {
  origin: {
    id: "origin",
    name: "Origin Hair Collective",
    tagline: "Premium Hair, Authentic Origins",
    domain: "originhair.com",
    aesthetic: "dark-luxury",
  },
  "mane-haus": {
    id: "mane-haus",
    name: "Mane Haus",
    tagline: "Luxury Hair, Elevated",
    domain: "manehaus.com",
    aesthetic: "warm-luxury",
  },
};

export async function getBrand(): Promise<BrandConfig> {
  const headersList = await headers();
  const brandId = (headersList.get("x-brand") || "origin") as Brand;
  return BRANDS[brandId] || BRANDS.origin;
}

export function getBrandSync(brandId: Brand): BrandConfig {
  return BRANDS[brandId] || BRANDS.origin;
}
