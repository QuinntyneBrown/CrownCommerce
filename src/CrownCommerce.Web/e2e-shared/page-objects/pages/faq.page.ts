import { type Locator, type Page } from '@playwright/test';

export class FaqPagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly faqList: Locator;
  readonly accordionItems: Locator;
  readonly ctaSection: Locator;
  readonly ctaTitle: Locator;
  readonly ctaButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-faq-page');
    this.heroLabel = this.root.locator('.faq__hero .faq__label');
    this.heroTitle = this.root.locator('.faq__title');
    this.heroSubtitle = this.root.locator('.faq__subtitle');
    this.faqList = this.root.locator('.faq__list');
    this.accordionItems = this.root.locator('.faq__list lib-accordion-item');
    this.ctaSection = this.root.locator('.faq__cta');
    this.ctaTitle = this.root.locator('.faq__cta-title');
    this.ctaButton = this.root.locator('.faq__cta lib-button');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/faq');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getItemCount(): Promise<number> {
    return this.accordionItems.count();
  }

  async toggleItem(index: number): Promise<void> {
    await this.accordionItems.nth(index).click();
  }
}
