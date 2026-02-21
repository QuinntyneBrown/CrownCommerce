import { type Locator, type Page } from '@playwright/test';

export class ContactPagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly infoCards: Locator;
  readonly formSection: Locator;
  readonly formIntro: Locator;
  readonly formCard: Locator;
  readonly formRow: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectSelect: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly formError: Locator;
  readonly features: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-contact-page');
    this.heroLabel = this.root.locator('.contact__label').first();
    this.heroTitle = this.root.locator('.contact__title');
    this.heroSubtitle = this.root.locator('.contact__subtitle');
    this.infoCards = this.root.locator('.contact__info-cards lib-contact-info-card');
    this.formSection = this.root.locator('.contact__form-section');
    this.formIntro = this.root.locator('.contact__form-intro');
    this.formCard = this.root.locator('.contact__form-card');
    this.formRow = this.root.locator('.contact__form-row');
    this.nameInput = this.root.locator('lib-form-input').first();
    this.emailInput = this.root.locator('lib-form-input').nth(1);
    this.subjectSelect = this.root.locator('lib-form-select');
    this.messageTextarea = this.root.locator('lib-form-textarea');
    this.submitButton = this.root.locator('.contact__form-card lib-button');
    this.successMessage = this.root.locator('.contact__form-card--success');
    this.formError = this.root.locator('.contact__form-error');
    this.features = this.root.locator('.contact__features lib-checklist-item');
  }

  async goto(): Promise<void> {
    await this.page.goto('/contact');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getInfoCardCount(): Promise<number> {
    return this.infoCards.count();
  }

  async getFeatureCount(): Promise<number> {
    return this.features.count();
  }
}
