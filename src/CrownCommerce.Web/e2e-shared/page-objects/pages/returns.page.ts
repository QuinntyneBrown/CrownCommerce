import { type Locator, type Page } from '@playwright/test';

export class ReturnsPagePOM {
  readonly root: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly conditionsGrid: Locator;
  readonly conditionCards: Locator;
  readonly stepsGrid: Locator;
  readonly stepCards: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-returns-page');
    this.heroLabel = this.root.locator('.returns__hero .returns__label');
    this.heroTitle = this.root.locator('.returns__title');
    this.heroSubtitle = this.root.locator('.returns__subtitle');
    this.conditionsGrid = this.root.locator('.returns__conditions-grid');
    this.conditionCards = this.root.locator('.returns__conditions-grid lib-policy-card');
    this.stepsGrid = this.root.locator('.returns__steps-grid');
    this.stepCards = this.root.locator('.returns__steps-grid lib-step-card');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/returns');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getConditionCardCount(): Promise<number> {
    return this.conditionCards.count();
  }

  async getStepCardCount(): Promise<number> {
    return this.stepCards.count();
  }
}
