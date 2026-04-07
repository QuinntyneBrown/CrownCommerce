/**
 * Font configuration for the application.
 * Uses system font stacks as fallback. Replace with next/font/google
 * imports when Google Fonts connectivity is available:
 *
 *   import { Fraunces, DM_Sans } from "next/font/google";
 *   export const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
 *   export const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
 */

export const fraunces = {
  variable: "--font-heading",
  className: "",
  style: { fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif" },
};

export const dmSans = {
  variable: "--font-body",
  className: "",
  style: { fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
};
