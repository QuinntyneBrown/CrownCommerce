import { type Locator, type Page } from '@playwright/test';

export class TrustBarSection {
  readonly root: Locator;
  readonly items: Locator;

  constructor(private page: Page) {
    this.root = page.locator('section.trust-bar');
    this.items = this.root.locator('lib-trust-bar-item');
  }

  async getItemCount(): Promise<number> {
    return this.items.count();
  }

  async getItemTexts(): Promise<string[]> {
    return this.items.allTextContents();
  }
}
