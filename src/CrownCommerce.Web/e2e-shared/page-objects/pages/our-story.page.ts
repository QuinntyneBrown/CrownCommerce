import { type Locator, type Page } from '@playwright/test';

export class OurStoryPagePOM {
  readonly root: Locator;
  readonly heroImage: Locator;
  readonly heroLabel: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly founderSection: Locator;
  readonly founderImage: Locator;
  readonly founderName: Locator;
  readonly missionSection: Locator;
  readonly missionTitle: Locator;
  readonly valuesGrid: Locator;
  readonly valueCards: Locator;
  readonly timelineGrid: Locator;
  readonly timelineCards: Locator;
  readonly ctaSection: Locator;
  readonly ctaButton: Locator;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;

  constructor(private page: Page) {
    this.root = page.locator('feat-our-story-page');
    this.heroImage = this.root.locator('.our-story__hero-image img');
    this.heroLabel = this.root.locator('.our-story__hero-content .our-story__label').first();
    this.heroTitle = this.root.locator('.our-story__title');
    this.heroSubtitle = this.root.locator('.our-story__subtitle');
    this.founderSection = this.root.locator('.our-story__founder');
    this.founderImage = this.root.locator('.our-story__founder-image img');
    this.founderName = this.root.locator('.our-story__founder-content .our-story__section-title');
    this.missionSection = this.root.locator('.our-story__mission');
    this.missionTitle = this.root.locator('.our-story__mission .our-story__section-title');
    this.valuesGrid = this.root.locator('.our-story__values-grid');
    this.valueCards = this.root.locator('.our-story__values-grid lib-benefit-card');
    this.timelineGrid = this.root.locator('.our-story__timeline-grid');
    this.timelineCards = this.root.locator('.our-story__timeline-grid lib-timeline-card');
    this.ctaSection = this.root.locator('.our-story__cta');
    this.ctaButton = this.root.locator('.our-story__cta lib-button');
    this.loadingSpinner = this.root.locator('lib-loading-spinner');
    this.errorState = this.root.locator('lib-error-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/about');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getValueCardCount(): Promise<number> {
    return this.valueCards.count();
  }

  async getTimelineCardCount(): Promise<number> {
    return this.timelineCards.count();
  }
}
