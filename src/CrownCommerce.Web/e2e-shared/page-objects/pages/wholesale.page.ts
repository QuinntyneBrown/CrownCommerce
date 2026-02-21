import { type Locator, type Page } from '@playwright/test';

export class WholesalePagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly benefitsGrid: Locator;
  readonly benefitCards: Locator;
  readonly tiersGrid: Locator;
  readonly tierCards: Locator;
  readonly formSection: Locator;
  readonly formIntro: Locator;
  readonly formCard: Locator;
  readonly businessNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly volumeSelect: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly formError: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-wholesale-page');
    this.heroLabel = this.root.locator('.wholesale__hero .wholesale__label');
    this.heroTitle = this.root.locator('.wholesale__title');
    this.heroSubtitle = this.root.locator('.wholesale__subtitle');
    this.benefitsGrid = this.root.locator('.wholesale__benefits-grid');
    this.benefitCards = this.root.locator('.wholesale__benefits-grid lib-benefit-card');
    this.tiersGrid = this.root.locator('.wholesale__tiers-grid');
    this.tierCards = this.root.locator('.wholesale__tiers-grid lib-pricing-tier-card');
    this.formSection = this.root.locator('.wholesale__form-section');
    this.formIntro = this.root.locator('.wholesale__form-intro');
    this.formCard = this.root.locator('.wholesale__form-card');
    this.businessNameInput = this.root.locator('lib-form-input').first();
    this.emailInput = this.root.locator('lib-form-input').nth(1);
    this.phoneInput = this.root.locator('lib-form-input').nth(2);
    this.volumeSelect = this.root.locator('lib-form-select');
    this.messageTextarea = this.root.locator('lib-form-textarea');
    this.submitButton = this.root.locator('.wholesale__form-card lib-button');
    this.successMessage = this.root.locator('.wholesale__form-card--success');
    this.formError = this.root.locator('.wholesale__form-error');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/wholesale');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getBenefitCardCount(): Promise<number> {
    return this.benefitCards.count();
  }

  async getTierCardCount(): Promise<number> {
    return this.tierCards.count();
  }
}
