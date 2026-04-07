import type { Metadata } from "next";
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
    <html lang="en">
      <body
        data-brand={brand.id === "mane-haus" ? "mane-haus" : undefined}
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
