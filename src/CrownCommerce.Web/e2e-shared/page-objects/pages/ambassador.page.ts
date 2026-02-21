import { type Locator, type Page } from '@playwright/test';

export class AmbassadorPagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroApplyButton: Locator;
  readonly perksGrid: Locator;
  readonly perkCards: Locator;
  readonly stepsGrid: Locator;
  readonly stepCards: Locator;
  readonly ctaSection: Locator;
  readonly ctaTitle: Locator;
  readonly applySection: Locator;
  readonly applyForm: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly followerSelect: Locator;
  readonly instagramInput: Locator;
  readonly tiktokInput: Locator;
  readonly whyJoinTextarea: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly formError: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-ambassador-page');
    this.heroLabel = this.root.locator('.ambassador__hero .ambassador__label');
    this.heroTitle = this.root.locator('.ambassador__title');
    this.heroSubtitle = this.root.locator('.ambassador__subtitle');
    this.heroApplyButton = this.root.locator('.ambassador__hero lib-button');
    this.perksGrid = this.root.locator('.ambassador__perks-grid');
    this.perkCards = this.root.locator('.ambassador__perks-grid lib-benefit-card');
    this.stepsGrid = this.root.locator('.ambassador__steps-grid');
    this.stepCards = this.root.locator('.ambassador__steps-grid lib-step-card');
    this.ctaSection = this.root.locator('.ambassador__cta');
    this.ctaTitle = this.root.locator('.ambassador__cta-title');
    this.applySection = this.root.locator('.ambassador__apply');
    this.applyForm = this.root.locator('.ambassador__apply-form');
    this.fullNameInput = this.applyForm.locator('lib-form-input').first();
    this.emailInput = this.applyForm.locator('lib-form-input').nth(1);
    this.phoneInput = this.applyForm.locator('lib-form-input').nth(2);
    this.followerSelect = this.applyForm.locator('lib-form-select');
    this.instagramInput = this.applyForm.locator('lib-form-input').nth(3);
    this.tiktokInput = this.applyForm.locator('lib-form-input').nth(4);
    this.whyJoinTextarea = this.applyForm.locator('lib-form-textarea');
    this.submitButton = this.applyForm.locator('lib-button');
    this.successMessage = this.root.locator('.ambassador__apply-success');
    this.formError = this.root.locator('.ambassador__form-error');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/ambassador');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getPerkCardCount(): Promise<number> {
    return this.perkCards.count();
  }

  async getStepCardCount(): Promise<number> {
    return this.stepCards.count();
  }
}
