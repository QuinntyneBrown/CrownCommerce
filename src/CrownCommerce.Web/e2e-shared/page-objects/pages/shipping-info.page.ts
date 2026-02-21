import { type Locator, type Page } from '@playwright/test';

export class ShippingInfoPagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly ratesGrid: Locator;
  readonly rateCards: Locator;
  readonly processingSection: Locator;
  readonly processingBody: Locator;
  readonly processNotes: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-shipping-info-page');
    this.heroLabel = this.root.locator('.shipping__hero .shipping__label');
    this.heroTitle = this.root.locator('.shipping__title');
    this.heroSubtitle = this.root.locator('.shipping__subtitle');
    this.ratesGrid = this.root.locator('.shipping__rates-grid');
    this.rateCards = this.root.locator('.shipping__rates-grid lib-shipping-rate-card');
    this.processingSection = this.root.locator('.shipping__processing');
    this.processingBody = this.root.locator('.shipping__body');
    this.processNotes = this.root.locator('.shipping__process-notes lib-checklist-item');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/shipping-info');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getRateCardCount(): Promise<number> {
    return this.rateCards.count();
  }

  async getProcessNoteCount(): Promise<number> {
    return this.processNotes.count();
  }
}
