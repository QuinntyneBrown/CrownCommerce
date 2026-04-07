import type { Metadata } from "next";
import { fraunces, dmSans } from "@/lib/theme/fonts";
import { getBrand } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrownCommerce",
  description: "Premium hair products for every queen",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = await getBrand();

  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body data-brand={brand.id === "mane-haus" ? "mane-haus" : undefined}>
        {children}
      </body>
    </html>
  );
}
