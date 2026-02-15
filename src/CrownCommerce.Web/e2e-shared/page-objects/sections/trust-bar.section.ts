import { type Locator, type Page } from '@playwright/test';

export class TrustBarSectionPOM {
  readonly root: Locator;
  readonly trustItems: Locator;
  /** Alias for `trustItems` (Mane Haus compat) */
  readonly items: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.trust-bar');
    this.trustItems = this.root.locator('lib-trust-bar-item');
    this.items = this.trustItems;
  }

  async getTrustItemTexts(): Promise<string[]> {
    return this.root.locator('.trust-item__text').allTextContents();
  }

  async getTrustItemCount(): Promise<number> {
    return this.trustItems.count();
  }

  /** Alias for `getTrustItemCount()` (Mane Haus compat) */
  async getItemCount(): Promise<number> {
    return this.getTrustItemCount();
  }

  /** Alias for `getTrustItemTexts()` (Mane Haus compat) */
  async getItemTexts(): Promise<string[]> {
    return this.getTrustItemTexts();
  }

  async hasTrustItemIcon(index: number): Promise<boolean> {
    return this.trustItems.nth(index).locator('.trust-item__icon svg').isVisible();
  }
}
